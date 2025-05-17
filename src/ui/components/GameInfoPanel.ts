/**
 * GameInfoPanel - Displays general game information
 */

import UIComponent from './UIComponent';

/**
 * Panel for displaying general game information
 */
class GameInfoPanel extends UIComponent {
  /**
   * Create a new game info panel
   */
  constructor() {
    super('div', 'game-info-panel game-panel');
  }
  
  /**
   * Generate the game info panel's HTML
   */
  protected createTemplate(): string {
    if (!this.gameState) {
      return `
        <div class="panel-title">Game Info</div>
        <div class="panel-content">
          <div class="loading">Loading game information...</div>
        </div>
      `;
    }
    
    const organization = this.gameState.meta.organization || 'ACADEMIC';
    const turn = this.gameState.meta.turn;
    const year = this.calcGameYear(turn);
    
    return `
      <div class="panel-title">Game Information</div>
      <div class="panel-content">
        <div class="info-section">
          <h3>Organization</h3>
          <div class="info-value">${this.formatOrganization(organization)}</div>
        </div>
        
        <div class="info-section">
          <h3>Timeline</h3>
          <div class="info-row">
            <div class="info-label">Turn</div>
            <div class="info-value">${turn}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Year</div>
            <div class="info-value">${year}</div>
          </div>
        </div>
        
        <div class="info-section">
          <h3>Status</h3>
          <div class="info-row">
            <div class="info-label">Phase</div>
            <div class="info-value">${this.formatPhase(this.gameState.meta.phase)}</div>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Calculate the game year based on turn number
   * @param turn Current turn
   */
  private calcGameYear(turn: number): number {
    // Starting year is 2025, each turn represents 3 months
    return Math.floor(2025 + (turn - 1) / 4);
  }
  
  /**
   * Format organization name for display
   * @param org Organization identifier
   */
  private formatOrganization(org: string): string {
    // Convert UPPERCASE to Title Case with icon
    let icon = '🏫';
    
    switch (org.toUpperCase()) {
      case 'ACADEMIC':
        icon = '🏫';
        break;
      case 'STARTUP':
        icon = '🚀';
        break;
      case 'CORPORATE':
        icon = '🏢';
        break;
      case 'NONPROFIT':
        icon = '🤝';
        break;
      case 'GOVERNMENT':
        icon = '🏛️';
        break;
    }
    
    const name = org.charAt(0) + org.slice(1).toLowerCase();
    return `${icon} ${name}`;
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
}

export default GameInfoPanel;