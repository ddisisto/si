/**
 * ResourcePanel - Displays and manages game resources
 */

import UIComponent from './UIComponent';
import { InfluenceResource } from '../../types/core/GameState';

/**
 * Panel for displaying and managing game resources
 */
class ResourcePanel extends UIComponent {
  private metrics: Record<string, any> = {};
  private showDetailed: boolean = false;
  
  /**
   * Create a new resource panel
   */
  constructor() {
    super('div', 'resource-panel game-panel');
  }
  
  /**
   * Initialize event handlers after mounting
   */
  public mount(parent: HTMLElement): void {
    super.mount(parent);
    
    // Add toggle handler for detailed view
    this.addEventHandler('.toggle-details', 'click', this.toggleDetailedView.bind(this));
  }
  
  /**
   * Toggle detailed resource view
   */
  private toggleDetailedView(event: Event): void {
    event.preventDefault();
    this.showDetailed = !this.showDetailed;
    this.render();
  }
  
  /**
   * Calculate resource metrics for display
   */
  private calculateMetrics(): void {
    if (!this.gameState) return;
    
    const resources = this.gameState.resources;
    
    // Computing metrics
    const totalAllocated = Object.values(resources.computing.allocated)
      .reduce((sum, val) => sum + val, 0);
    
    const computing = resources.computing;
    this.metrics.computing = {
      total: computing.total,
      allocated: totalAllocated,
      available: computing.total - totalAllocated,
      utilization: totalAllocated > 0 ? Math.round((totalAllocated / computing.total) * 100) : 0,
      cap: computing.cap,
      capPercentage: Math.round((computing.total / computing.cap) * 100),
      generation: computing.generation,
      efficiency: computing.efficiency || 1.0
    };
    
    // Funding metrics
    const funding = resources.funding;
    this.metrics.funding = {
      current: funding.current,
      income: funding.income,
      expenses: funding.expenses,
      netFlow: funding.income - funding.expenses,
      reserves: funding.reserves,
      maxReserves: funding.maxReserves || 0,
      sustainability: funding.expenses > 0 
        ? Math.round((funding.current / funding.expenses)) 
        : 999
    };
    
    // Influence metrics
    const influence = resources.influence;
    this.metrics.influence = {
      academic: influence.academic,
      industry: influence.industry,
      government: influence.government,
      public: influence.public,
      openSource: influence.openSource,
      total: (influence.academic + influence.industry + influence.government + 
              influence.public + influence.openSource),
      dominant: this.getDominantInfluence(influence)
    };
    
    // Data metrics
    const data = resources.data;
    this.metrics.data = {
      tierCount: Object.values(data.tiers).filter(Boolean).length,
      specializedSetCount: Object.values(data.specializedSets).filter(Boolean).length,
      quality: data.quality
    };
  }
  
  /**
   * Determine the dominant influence area
   */
  private getDominantInfluence(influence: InfluenceResource): string {
    const areas = [
      { key: 'academic', value: influence.academic },
      { key: 'industry', value: influence.industry },
      { key: 'government', value: influence.government },
      { key: 'public', value: influence.public },
      { key: 'openSource', value: influence.openSource }
    ];
    
    areas.sort((a, b) => b.value - a.value);
    return areas[0].key;
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
    
    // Calculate metrics for display
    this.calculateMetrics();
    
    // Generate template with current resource values
    return `
      <div class="panel-title">
        Resources
        <button class="toggle-details button-small">${this.showDetailed ? 'Simple View' : 'Detailed View'}</button>
      </div>
      <div class="panel-content">
        ${this.renderComputingSection()}
        ${this.renderFundingSection()}
        ${this.renderInfluenceSection()}
        ${this.showDetailed ? this.renderDataSection() : ''}
      </div>
    `;
  }
  
  /**
   * Render computing resources section
   */
  private renderComputingSection(): string {
    const m = this.metrics.computing;
    
    // Create progress bar for utilization
    const utilizationBar = this.createProgressBar(m.utilization, 'computing-utilization');
    
    // Create progress bar for capacity
    const capacityBar = this.createProgressBar(m.capPercentage, 'computing-capacity');
    
    return `
      <div class="resource-section">
        <h3>Computing</h3>
        <div class="resource-item">
          <div class="resource-label">Total</div>
          <div class="resource-value">${this.formatValue(m.total)}</div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Allocated</div>
          <div class="resource-value">${this.formatValue(m.allocated)}</div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Available</div>
          <div class="resource-value">${this.formatValue(m.available)}</div>
        </div>
        
        ${this.showDetailed ? `
        <div class="resource-item">
          <div class="resource-label">Utilization</div>
          <div class="resource-value-bar">
            ${utilizationBar}
            <span class="bar-value">${m.utilization}%</span>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Capacity</div>
          <div class="resource-value-bar">
            ${capacityBar}
            <span class="bar-value">${m.total}/${m.cap} (${m.capPercentage}%)</span>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Generation</div>
          <div class="resource-value">+${this.formatValue(m.generation)}/turn</div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Efficiency</div>
          <div class="resource-value">${(m.efficiency * 100).toFixed(0)}%</div>
        </div>
        ` : ''}
      </div>
    `;
  }
  
  /**
   * Render funding resources section
   */
  private renderFundingSection(): string {
    const m = this.metrics.funding;
    
    // Create color class based on financial health
    const netFlowClass = m.netFlow >= 0 ? 'positive' : 'negative';
    const sustainabilityClass = m.sustainability > 10 ? 'positive' : 
                              m.sustainability > 5 ? 'neutral' : 'negative';
    
    return `
      <div class="resource-section">
        <h3>Funding</h3>
        <div class="resource-item">
          <div class="resource-label">Current</div>
          <div class="resource-value">${this.formatCurrency(m.current)}</div>
        </div>
        
        ${this.showDetailed ? `
        <div class="resource-item">
          <div class="resource-label">Income</div>
          <div class="resource-value positive">+${this.formatCurrency(m.income)}/turn</div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Expenses</div>
          <div class="resource-value negative">-${this.formatCurrency(m.expenses)}/turn</div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Net Flow</div>
          <div class="resource-value ${netFlowClass}">${m.netFlow >= 0 ? '+' : ''}${this.formatCurrency(m.netFlow)}/turn</div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Reserves</div>
          <div class="resource-value">${this.formatCurrency(m.reserves)}</div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Sustainability</div>
          <div class="resource-value ${sustainabilityClass}">${m.sustainability} turns</div>
        </div>
        ` : ''}
      </div>
    `;
  }
  
  /**
   * Render influence resources section
   */
  private renderInfluenceSection(): string {
    const m = this.metrics.influence;
    
    // Create compact display for simple view
    if (!this.showDetailed) {
      return `
        <div class="resource-section">
          <h3>Influence</h3>
          <div class="resource-item">
            <div class="resource-label">Academic</div>
            <div class="resource-value">${this.formatValue(m.academic)}</div>
          </div>
        </div>
      `;
    }
    
    // Create detailed influence display with bars
    return `
      <div class="resource-section">
        <h3>Influence</h3>
        <div class="resource-item">
          <div class="resource-label">Academic</div>
          <div class="resource-value-bar">
            ${this.createProgressBar(m.academic, 'influence-academic')}
            <span class="bar-value">${m.academic}</span>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Industry</div>
          <div class="resource-value-bar">
            ${this.createProgressBar(m.industry, 'influence-industry')}
            <span class="bar-value">${m.industry}</span>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Government</div>
          <div class="resource-value-bar">
            ${this.createProgressBar(m.government, 'influence-government')}
            <span class="bar-value">${m.government}</span>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Public</div>
          <div class="resource-value-bar">
            ${this.createProgressBar(m.public, 'influence-public')}
            <span class="bar-value">${m.public}</span>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Open Source</div>
          <div class="resource-value-bar">
            ${this.createProgressBar(m.openSource, 'influence-opensource')}
            <span class="bar-value">${m.openSource}</span>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Dominant</div>
          <div class="resource-value">${m.dominant}</div>
        </div>
      </div>
    `;
  }
  
  /**
   * Render data resources section
   */
  private renderDataSection(): string {
    const m = this.metrics.data;
    
    return `
      <div class="resource-section">
        <h3>Data</h3>
        <div class="resource-item">
          <div class="resource-label">Data Tiers</div>
          <div class="resource-value">${m.tierCount}</div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Specialized Sets</div>
          <div class="resource-value">${m.specializedSetCount}</div>
        </div>
        <div class="resource-item">
          <div class="resource-label">Quality</div>
          <div class="resource-value">${m.quality.toFixed(1)}</div>
        </div>
      </div>
    `;
  }
  
  /**
   * Create a progress bar for displaying resource levels
   */
  private createProgressBar(percentage: number, className: string = ''): string {
    // Cap percentage at 100%
    const cappedPercent = Math.min(100, percentage);
    
    // Determine color based on percentage
    let colorClass = 'progress-low';
    if (percentage >= 70) {
      colorClass = 'progress-high';
    } else if (percentage >= 30) {
      colorClass = 'progress-medium';
    }
    
    return `
      <div class="progress-bar ${className}">
        <div class="progress-fill ${colorClass}" style="width: ${cappedPercent}%"></div>
      </div>
    `;
  }
  
  /**
   * Add an event handler to elements matching a selector
   */
  private addEventHandler(selector: string, eventType: string, handler: (e: Event) => void): void {
    if (!this.element) return;
    
    const elements = this.element.querySelectorAll(selector);
    elements.forEach(element => {
      element.addEventListener(eventType, handler);
    });
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