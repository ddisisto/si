/**
 * TurnControls - Controls for turn progression
 */

import UIComponent from './UIComponent';
import { EventBus } from '../../core';

/**
 * Component for controlling turn progression
 */
class TurnControls extends UIComponent {
  /**
   * Create new turn controls
   * @param eventBus Event bus for emitting turn events
   */
  constructor(eventBus: EventBus) {
    super('div', 'turn-controls');
    this.eventBus = eventBus;
  }
  
  /**
   * Generate the turn controls HTML
   */
  protected createTemplate(): string {
    const turn = this.gameState?.meta.turn || 1;
    const phase = this.gameState?.meta.phase || 'RESEARCH';
    
    return `
      <div class="turn-info">
        <div class="turn-number">Turn ${turn}</div>
        <div class="turn-phase">${this.formatPhase(phase)}</div>
      </div>
      <div class="turn-buttons">
        <button class="end-turn-button">End Turn</button>
      </div>
    `;
  }
  
  /**
   * Bind event handlers after rendering
   */
  protected bindEvents(): void {
    // Add end turn button handler
    const endTurnButton = this.element.querySelector('.end-turn-button');
    if (endTurnButton) {
      // Remove any existing click handlers first to prevent duplicates
      endTurnButton.removeEventListener('click', this.handleEndTurn);
      // Add the click handler
      endTurnButton.addEventListener('click', this.handleEndTurn);
      console.log('End turn button event bound');
    } else {
      console.warn('End turn button not found in DOM');
    }
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
   * Handle end turn button click
   */
  private handleEndTurn = (): void => {
    if (this.gameState && this.eventBus) {
      // Emit end turn event
      this.eventBus.emit('turn:end', { 
        turn: this.gameState.meta.turn 
      });
    }
  }
}

export default TurnControls;