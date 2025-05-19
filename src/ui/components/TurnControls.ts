/**
 * TurnControls - Controls for turn progression
 */

import UIComponent from './UIComponent';
import Logger from '../../utils/Logger';

/**
 * Component for controlling turn progression
 */
class TurnControls extends UIComponent {
  private formattedDate: string = '';
  private timeScale: string = 'Quarterly';

  /**
   * Create new turn controls
   */
  constructor(_eventBus?: any) {
    super('div', 'turn-controls');
  }
  
  /**
   * Generate the turn controls HTML
   */
  protected createTemplate(): string {
    const turn = this.gameState?.meta.turn || 1;
    const phase = this.gameState?.meta.phase || 'ACTION';
    
    // Format game date
    const gameTime = this.gameState?.meta.gameTime;
    let dateDisplay = '';
    
    if (gameTime) {
      const year = gameTime.year;
      const quarter = gameTime.quarter;
      const month = gameTime.month;
      const day = gameTime.day;
      
      if (this.timeScale === 'Quarterly') {
        dateDisplay = `Q${quarter} ${year}`;
      } else if (this.timeScale === 'Monthly') {
        dateDisplay = `${this.getMonthName(month)} ${year}`;
      } else {
        dateDisplay = `${this.getMonthName(month)} ${day}, ${year}`;
      }
      
      // Use cached formatted date if available
      if (this.formattedDate) {
        dateDisplay = this.formattedDate;
      }
    }
    
    return `
      <div class="turn-info">
        <div class="turn-number">Turn ${turn}</div>
        <div class="turn-date">${dateDisplay} <span class="time-scale">(${this.timeScale})</span></div>
        <div class="turn-phase">${this.formatPhase(phase)}</div>
      </div>
      <div class="turn-buttons">
        <button class="btn-danger">End Turn</button>
      </div>
    `;
  }
  
  /**
   * Bind event handlers after rendering
   */
  protected bindEvents(): void {
    // Add end turn button handler
    const endTurnButton = this.element.querySelector('.btn-danger');
    if (endTurnButton) {
      // Remove any existing click handlers first to prevent duplicates
      endTurnButton.removeEventListener('click', this.handleEndTurn);
      // Add the click handler
      endTurnButton.addEventListener('click', this.handleEndTurn);
    }
  }  
  
  /**
   * Set up event subscriptions after game engine is set
   */
  protected afterMount(): void {
    // Subscribe to time and phase events
    this.subscribe('turn:start', this.updateTimeDisplay.bind(this));
    this.subscribe('phase:action', this.updateTimeDisplay.bind(this));
    this.subscribe('time:compression:changed', this.updateTimeDisplay.bind(this));
  }
  
  /**
   * Update time display information
   */
  private updateTimeDisplay(data: any): void {
    if (data.formattedDate) {
      this.formattedDate = data.formattedDate;
    }
    
    if (data.timeScale) {
      this.timeScale = data.timeScale;
    }
    
    // Re-render the component
    this.render();
  }
  
  /**
   * Format phase name for display
   * @param phase Phase identifier
   */
  private formatPhase(phase: string): string {
    // Convert UPPERCASE_WITH_UNDERSCORES to Title Case With Spaces
    return phase
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  /**
   * Convert month number to name
   */
  private getMonthName(month: number): string {
    const monthNames = [
      "January", "February", "March", 
      "April", "May", "June", 
      "July", "August", "September", 
      "October", "November", "December"
    ];
    
    return monthNames[month - 1] || "January";
  }
  
  /**
   * Handle end turn button click
   */
  private handleEndTurn = (): void => {
    if (this.gameState) {
      // Emit end turn event
      this.emit('turn:end', { 
        turn: this.gameState.meta.turn,
        gameTime: this.gameState.meta.gameTime
      });
    }
  };
}

export default TurnControls;