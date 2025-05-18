/**
 * ResearchInfoPanel - Component for displaying research node details
 */

import UIComponent from '../../UIComponent';
import { ResearchNode } from '../../../../types/core/GameState';

export type ResearchAction = 'start' | 'allocate' | 'cancel';

export interface ResearchActionEvent {
  action: ResearchAction;
  nodeId: string;
}

/**
 * Component for displaying detailed information about a selected research node
 */
export class ResearchInfoPanel extends UIComponent {
  private selectedNode: ResearchNode | null = null;
  private selectedNodeId: string | null = null;
  private onResearchAction?: (event: ResearchActionEvent) => void;
  
  // Bound event handlers
  private boundHandleStartResearch: (event: Event) => void;
  private boundHandleAllocateCompute: (event: Event) => void;
  private boundHandleCancelResearch: (event: Event) => void;
  
  constructor(onResearchAction?: (event: ResearchActionEvent) => void) {
    super('div', 'research-node-info');
    this.onResearchAction = onResearchAction;
    
    // Bind event handlers
    this.boundHandleStartResearch = this.handleStartResearch.bind(this);
    this.boundHandleAllocateCompute = this.handleAllocateCompute.bind(this);
    this.boundHandleCancelResearch = this.handleCancelResearch.bind(this);
  }
  
  /**
   * Set the selected node
   */
  public setSelectedNode(node: ResearchNode | null, nodeId: string | null): void {
    this.selectedNode = node;
    this.selectedNodeId = nodeId;
    this.render();
  }
  
  /**
   * Generate the info panel HTML
   */
  protected createTemplate(): string {
    if (!this.selectedNode || !this.selectedNodeId) {
      return this.createEmptyTemplate();
    }
    
    return this.createNodeInfoTemplate();
  }
  
  /**
   * Create empty state template
   */
  private createEmptyTemplate(): string {
    return `
      <div class="info-empty">
        <p>Select a research node to view details</p>
      </div>
    `;
  }
  
  /**
   * Create node info template
   */
  private createNodeInfoTemplate(): string {
    const node = this.selectedNode!;
    const nodeId = this.selectedNodeId!;
    const name = node.name || 'Unknown Research';
    const category = node.category || 'Uncategorized';
    const categoryClass = category.toLowerCase();
    const description = node.description || 'No description available.';
    
    return `
      <div class="info-header">
        <h2>${name}</h2>
        <span class="category-badge ${categoryClass}">${category}</span>
      </div>
      
      <div class="info-content">
        <div class="description">
          <p>${description}</p>
        </div>
        
        ${this.createStatusSection(node)}
        ${this.createRequirementsSection(node)}
        ${this.createEffectsSection(node)}
        ${this.createProgressSection(node)}
        ${this.createActionsSection(node, nodeId)}
      </div>
    `;
  }
  
  /**
   * Create status section
   */
  private createStatusSection(node: ResearchNode): string {
    const statusText = this.getStatusText(node.status);
    const statusIcon = this.getStatusIcon(node.status);
    
    return `
      <div class="status-section">
        <h3>Status</h3>
        <div class="status-display ${node.status}">
          <span class="status-icon">${statusIcon}</span>
          <span class="status-text">${statusText}</span>
        </div>
      </div>
    `;
  }
  
  /**
   * Create requirements section
   */
  private createRequirementsSection(node: ResearchNode): string {
    const { research, resources } = this.gameState || {};
    if (!research || !resources) return '';
    
    let prereqsHtml = '';
    if (node.prerequisites && node.prerequisites.length > 0) {
      const prereqItems = node.prerequisites.map((reqId: string) => {
        const reqNode = research.nodes[reqId];
        const status = reqNode ? reqNode.status : 'unknown';
        const name = reqNode ? reqNode.name : 'Unknown Research';
        const isMet = status === 'completed';
        
        return `
          <li class="${isMet ? 'met' : 'unmet'}">
            ${name} ${isMet ? '✓' : '✗'}
          </li>
        `;
      }).join('');
      
      prereqsHtml = `
        <div class="prerequisite-research">
          <h4>Required Research:</h4>
          <ul>
            ${prereqItems}
          </ul>
        </div>
      `;
    }
    
    let resourcesHtml = '';
    let allResourceItems: string[] = [];
    
    // Add compute cost
    if (node.computeCost && node.computeCost > 0) {
      const current = resources.computing?.total || 0;
      const isMet = current >= node.computeCost;
      allResourceItems.push(`
        <li class="${isMet ? 'met' : 'unmet'}">
          Computing: ${current} / ${node.computeCost} ${isMet ? '✓' : '✗'}
        </li>
      `);
    }
    
    // Add influence costs
    if (node.influenceCost && Object.keys(node.influenceCost).length > 0) {
      Object.entries(node.influenceCost).map(([type, amount]) => {
        const current = (resources.influence as any)?.[type] || 0;
        const isMet = current >= (amount as number);
        allResourceItems.push(`
          <li class="${isMet ? 'met' : 'unmet'}">
            ${type} influence: ${current} / ${amount} ${isMet ? '✓' : '✗'}
          </li>
        `);
      });
    }
    
    if (allResourceItems.length > 0) {
      resourcesHtml = `
        <div class="resource-requirements">
          <h4>Required Resources:</h4>
          <ul>
            ${allResourceItems.join('')}
          </ul>
        </div>
      `;
    }
    
    if (!prereqsHtml && !resourcesHtml) {
      return '';
    }
    
    return `
      <div class="requirements-section">
        <h3>Requirements</h3>
        ${prereqsHtml}
        ${resourcesHtml}
      </div>
    `;
  }
  
  /**
   * Create effects section
   */
  private createEffectsSection(node: ResearchNode): string {
    if (!node.effects || Object.keys(node.effects).length === 0) {
      return '';
    }
    
    const effectItems = Object.entries(node.effects).map(([key, value]) => {
      return `<li>${this.formatEffectKey(key)}: ${this.formatEffectValue(value)}</li>`;
    }).join('');
    
    return `
      <div class="effects-section">
        <h3>Effects When Completed</h3>
        <ul>
          ${effectItems}
        </ul>
      </div>
    `;
  }
  
  /**
   * Create progress section for in-progress research
   */
  private createProgressSection(node: ResearchNode): string {
    if (node.status !== 'in_progress') {
      return '';
    }
    
    const progress = node.progress || 0;
    const totalRequired = node.computeCost || 0;
    const percentage = totalRequired > 0 ? (progress / totalRequired) * 100 : 0;
    
    return `
      <div class="progress-section">
        <h3>Progress</h3>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="progress-text">
          ${progress} / ${totalRequired} Computing Resources
        </div>
      </div>
    `;
  }
  
  /**
   * Create actions section
   */
  private createActionsSection(node: ResearchNode, nodeId: string): string {
    let actions = '';
    
    if (node.status === 'available') {
      actions = `
        <button class="start-research btn-primary" data-node-id="${nodeId}">
          Start Research
        </button>
      `;
    } else if (node.status === 'in_progress') {
      actions = `
        <button class="allocate-compute btn-primary" data-node-id="${nodeId}">
          Allocate Computing
        </button>
        <button class="cancel-research btn-secondary" data-node-id="${nodeId}">
          Cancel Research
        </button>
      `;
    }
    
    if (!actions) {
      return '';
    }
    
    return `
      <div class="actions-section">
        <h3>Actions</h3>
        <div class="action-buttons">
          ${actions}
        </div>
      </div>
    `;
  }
  
  /**
   * Set up event listeners after render
   */
  protected setupEvents(): void {
    // Start research button
    const startButton = this.element.querySelector('.start-research');
    if (startButton) {
      startButton.addEventListener('click', this.boundHandleStartResearch);
    }
    
    // Allocate compute button
    const allocateButton = this.element.querySelector('.allocate-compute');
    if (allocateButton) {
      allocateButton.addEventListener('click', this.boundHandleAllocateCompute);
    }
    
    // Cancel research button
    const cancelButton = this.element.querySelector('.cancel-research');
    if (cancelButton) {
      cancelButton.addEventListener('click', this.boundHandleCancelResearch);
    }
  }
  
  /**
   * Handle start research action
   */
  private handleStartResearch(event: Event): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    const nodeId = target.getAttribute('data-node-id');
    
    if (nodeId && this.onResearchAction) {
      this.onResearchAction({ action: 'start', nodeId });
    }
  }
  
  /**
   * Handle allocate compute action
   */
  private handleAllocateCompute(event: Event): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    const nodeId = target.getAttribute('data-node-id');
    
    if (nodeId && this.onResearchAction) {
      this.onResearchAction({ action: 'allocate', nodeId });
    }
  }
  
  /**
   * Handle cancel research action
   */
  private handleCancelResearch(event: Event): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    const nodeId = target.getAttribute('data-node-id');
    
    if (nodeId && this.onResearchAction) {
      this.onResearchAction({ action: 'cancel', nodeId });
    }
  }
  
  /**
   * Get status text
   */
  private getStatusText(status: string): string {
    switch (status) {
      case 'available': return 'Available';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'locked': return 'Locked';
      default: return 'Unknown';
    }
  }
  
  /**
   * Get status icon
   */
  private getStatusIcon(status: string): string {
    switch (status) {
      case 'available': return '◯';
      case 'in_progress': return '◐';
      case 'completed': return '●';
      case 'locked': return '🔒';
      default: return '?';
    }
  }
  
  /**
   * Format effect key for display
   */
  private formatEffectKey(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
  }
  
  /**
   * Format effect value for display
   */
  private formatEffectValue(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'Enabled' : 'Disabled';
    }
    if (typeof value === 'number') {
      return value > 1 ? `+${value}` : value.toString();
    }
    return value.toString();
  }
}