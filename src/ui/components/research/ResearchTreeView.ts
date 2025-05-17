/**
 * ResearchTreeView - Component for displaying the research tree
 */

import UIComponent from '../UIComponent';
import { GameState } from '../../../core/GameState';
import { ResearchNode } from '../../../types/core/GameState';

/**
 * Component for displaying the research tree
 */
class ResearchTreeView extends UIComponent {
  private selectedNodeId: string | null = null;
  
  /**
   * Create a new research tree view
   */
  constructor() {
    super('div', 'research-tree-view');
  }
  
  /**
   * Generate the research tree HTML
   */
  protected createTemplate(): string {
    if (!this.gameState) {
      return `<div class="research-loading">Loading research data...</div>`;
    }
    
    const { research } = this.gameState;
    const nodeCount = Object.keys(research.nodes).length;
    
    if (nodeCount === 0) {
      return `<div class="research-empty">No research nodes available.</div>`;
    }
    
    // Group nodes by category
    const categorizedNodes: Record<string, ResearchNode[]> = {};
    
    Object.values(research.nodes).forEach(node => {
      const category = node.category as string || 'Uncategorized';
      if (!categorizedNodes[category]) {
        categorizedNodes[category] = [];
      }
      categorizedNodes[category].push(node);
    });
    
    // Build the HTML for the research tree
    let html = `
      <div class="research-tree-header">
        <h2>Research Tree</h2>
        <div class="stats">
          <span>Nodes: ${nodeCount}</span>
          <span>Active: ${research.activeResearch.length}</span>
          <span>Completed: ${research.completed.length}</span>
        </div>
      </div>
      <div class="research-categories">
    `;
    
    // Add each category and its nodes
    Object.entries(categorizedNodes).forEach(([category, nodes]) => {
      html += `
        <div class="research-category">
          <h3>${category}</h3>
          <div class="research-nodes">
      `;
      
      nodes.forEach(node => {
        const isSelected = node.id === this.selectedNodeId;
        const statusClass = this.getStatusClass(node.status);
        const nodeClass = `research-node ${statusClass} ${isSelected ? 'selected' : ''}`;
        
        html += `
          <div class="${nodeClass}" data-id="${node.id}">
            <div class="node-header">
              <span class="node-name">${node.name || node.id}</span>
              <span class="node-status">${this.formatStatus(node.status)}</span>
            </div>
            <div class="node-info">
              ${node.progress > 0 ? `<div class="progress-bar"><div class="progress" style="width: ${Math.round(node.progress * 100)}%"></div></div>` : ''}
              ${node.computeAllocated > 0 ? `<div class="compute">Compute: ${node.computeAllocated}</div>` : ''}
            </div>
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    });
    
    html += `
      </div>
      <div class="research-details">
        ${this.selectedNodeId ? this.renderNodeDetails(this.getSelectedNode()) : '<p>Select a research node to see details</p>'}
      </div>
    `;
    
    return html;
  }
  
  /**
   * Get the CSS class for a node status
   */
  private getStatusClass(status: string): string {
    switch(status) {
      case 'LOCKED':
      case 'locked':
        return 'status-locked';
      case 'UNLOCKED':
      case 'available':
        return 'status-available';
      case 'IN_PROGRESS':
      case 'in_progress':
        return 'status-in-progress';
      case 'COMPLETED':
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  }
  
  /**
   * Format the status for display
   */
  private formatStatus(status: string): string {
    switch(status) {
      case 'LOCKED':
      case 'locked':
        return 'Locked';
      case 'UNLOCKED':
      case 'available':
        return 'Available';
      case 'IN_PROGRESS':
      case 'in_progress':
        return 'In Progress';
      case 'COMPLETED':
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  }
  
  /**
   * Get the selected node from the game state
   */
  private getSelectedNode(): ResearchNode | null {
    if (!this.gameState || !this.selectedNodeId) {
      return null;
    }
    
    return this.gameState.research.nodes[this.selectedNodeId] || null;
  }
  
  /**
   * Render detailed information for a selected node
   */
  private renderNodeDetails(node: ResearchNode | null): string {
    if (!node) {
      return '<p>Node not found</p>';
    }
    
    // Build HTML for prerequisites
    let prerequisitesHtml = '';
    if (node.prerequisites && node.prerequisites.length > 0) {
      prerequisitesHtml = `
        <div class="node-prerequisites">
          <h4>Prerequisites</h4>
          <ul>
            ${node.prerequisites.map(id => `<li>${this.getNodeName(id)}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    // Build HTML for costs
    let costsHtml = '';
    if (node.computeCost) {
      costsHtml += `<div>Compute: ${node.computeCost}</div>`;
    }
    
    if (node.influenceCost) {
      const influenceCosts = Object.entries(node.influenceCost)
        .map(([type, amount]) => `${type}: ${amount}`)
        .join(', ');
      
      if (influenceCosts) {
        costsHtml += `<div>Influence: ${influenceCosts}</div>`;
      }
    }
    
    if (costsHtml) {
      costsHtml = `
        <div class="node-costs">
          <h4>Costs</h4>
          ${costsHtml}
        </div>
      `;
    }
    
    // Build HTML for effects
    let effectsHtml = '';
    if (node.effects && Object.keys(node.effects).length > 0) {
      effectsHtml = `
        <div class="node-effects">
          <h4>Effects</h4>
          <ul>
            ${Object.entries(node.effects).map(([key, value]) => `<li>${key}: ${this.formatEffect(key, value)}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    // Action buttons based on status
    let actionsHtml = '';
    if (this.gameState) {
      if (node.status === 'UNLOCKED' || node.status === 'available') {
        actionsHtml = `<button class="action-button start-research" data-id="${node.id}">Start Research</button>`;
      } else if (node.status === 'IN_PROGRESS' || node.status === 'in_progress') {
        actionsHtml = `
          <button class="action-button allocate-compute" data-id="${node.id}">Add Compute</button>
          <button class="action-button cancel-research" data-id="${node.id}">Cancel</button>
        `;
      }
    }
    
    return `
      <div class="node-details">
        <h3>${node.name || node.id}</h3>
        <div class="node-category">${node.category} - ${node.subcategory}</div>
        <div class="node-type">Type: ${node.type}</div>
        <p class="node-description">${node.description || 'No description available.'}</p>
        
        ${prerequisitesHtml}
        ${costsHtml}
        ${effectsHtml}
        
        <div class="node-actions">
          ${actionsHtml}
        </div>
      </div>
    `;
  }
  
  /**
   * Format an effect value for display
   */
  private formatEffect(key: string, value: any): string {
    if (typeof value === 'number') {
      // Display numbers with proper sign for multipliers
      if (key.includes('Efficiency') || key.includes('Multiplier')) {
        return value < 1 ? `-${Math.abs((1 - value) * 100).toFixed(0)}%` : `+${Math.abs((value - 1) * 100).toFixed(0)}%`;
      } else {
        return value.toString();
      }
    } else if (Array.isArray(value)) {
      return value.join(', ');
    } else if (typeof value === 'object') {
      return JSON.stringify(value);
    } else {
      return String(value);
    }
  }
  
  /**
   * Get a node name from its ID
   */
  private getNodeName(id: string): string {
    if (!this.gameState) {
      return id;
    }
    
    const node = this.gameState.research.nodes[id];
    return node ? (node.name || id) : id;
  }
  
  /**
   * Handle node selection
   */
  protected bindEvents(): void {
    // Add click event to research nodes
    const nodeElements = this.element.querySelectorAll('.research-node');
    nodeElements.forEach(node => {
      node.addEventListener('click', this.handleNodeClick.bind(this));
    });
    
    // Add click events to action buttons
    const startButtons = this.element.querySelectorAll('.start-research');
    startButtons.forEach(button => {
      button.addEventListener('click', this.handleStartResearch.bind(this));
    });
    
    const allocateButtons = this.element.querySelectorAll('.allocate-compute');
    allocateButtons.forEach(button => {
      button.addEventListener('click', this.handleAllocateCompute.bind(this));
    });
    
    const cancelButtons = this.element.querySelectorAll('.cancel-research');
    cancelButtons.forEach(button => {
      button.addEventListener('click', this.handleCancelResearch.bind(this));
    });
  }
  
  /**
   * Handle node click
   */
  private handleNodeClick(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const nodeId = target.dataset.id;
    
    if (nodeId) {
      this.selectedNodeId = nodeId;
      this.render();
    }
  }
  
  /**
   * Handle start research button click
   */
  private handleStartResearch(event: Event): void {
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    const nodeId = target.dataset.id;
    
    if (nodeId && this.eventBus) {
      // Start with fixed compute allocation for now - in a real implementation, we'd show a dialog
      const computeAllocation = 10;
      
      this.eventBus.emit('action:start_research', {
        nodeId,
        allocatedCompute: computeAllocation
      });
    }
  }
  
  /**
   * Handle allocate compute button click
   */
  private handleAllocateCompute(event: Event): void {
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    const nodeId = target.dataset.id;
    
    if (nodeId && this.eventBus) {
      // Add fixed amount of compute for now - in a real implementation, we'd show a dialog
      const additionalCompute = 5;
      
      this.eventBus.emit('action:allocate_research_compute', {
        nodeId,
        amount: additionalCompute
      });
    }
  }
  
  /**
   * Handle cancel research button click
   */
  private handleCancelResearch(event: Event): void {
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    const nodeId = target.dataset.id;
    
    if (nodeId && this.eventBus) {
      this.eventBus.emit('action:cancel_research', {
        nodeId
      });
    }
  }
}

export default ResearchTreeView;