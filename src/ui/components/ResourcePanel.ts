/**
 * ResourcePanel - Displays and manages game resources
 */

import UIComponent from './UIComponent';

/**
 * Panel for displaying and managing game resources
 */
class ResourcePanel extends UIComponent {
  /**
   * Create a new resource panel
   */
  constructor() {
    super('div', 'resource-panel game-panel');
  }
  
  /**
   * Generate the resource panel's HTML
   */
  protected createTemplate(): string {
    if (!this.gameState) {
      return `
        <div class="panel-title">Resources</div>
        <div class="panel-content">
          <div class="loading">Loading resources...</div>
        </div>
      `;
    }
    
    // Format resource values with proper precision and abbreviations
    const computing = this.formatValue(this.gameState.resources.computing.total);
    const computingAllocated = this.formatValue(
      Object.values(this.gameState.resources.computing.allocated)
        .reduce((sum, val) => sum + val, 0)
    );
    const computingAvailable = this.formatValue(
      this.gameState.resources.computing.total - 
      Object.values(this.gameState.resources.computing.allocated)
        .reduce((sum, val) => sum + val, 0)
    );
    
    const funding = this.formatCurrency(this.gameState.resources.funding.current);
    const influence = this.formatValue(this.gameState.resources.influence.academic);
    
    // Generate template with current resource values
    return `
      <div class="panel-title">Resources</div>
      <div class="panel-content">
        <div class="resource-section">
          <h3>Computing</h3>
          <div class="resource-item">
            <div class="resource-label">Total</div>
            <div class="resource-value">${computing}</div>
          </div>
          <div class="resource-item">
            <div class="resource-label">Allocated</div>
            <div class="resource-value">${computingAllocated}</div>
          </div>
          <div class="resource-item">
            <div class="resource-label">Available</div>
            <div class="resource-value">${computingAvailable}</div>
          </div>
        </div>
        
        <div class="resource-section">
          <h3>Funding</h3>
          <div class="resource-item">
            <div class="resource-label">Current</div>
            <div class="resource-value">${funding}</div>
          </div>
        </div>
        
        <div class="resource-section">
          <h3>Influence</h3>
          <div class="resource-item">
            <div class="resource-label">Academic</div>
            <div class="resource-value">${influence}</div>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Format a numeric value with proper precision and abbreviations
   * @param value Value to format
   */
  private formatValue(value: number): string {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return value.toFixed(0);
    }
  }
  
  /**
   * Format a currency value
   * @param value Value to format
   */
  private formatCurrency(value: number): string {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  }
}

export default ResourcePanel;