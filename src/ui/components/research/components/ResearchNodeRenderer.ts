/**
 * ResearchNodeRenderer - Component for rendering individual research nodes
 */

import UIComponent from '../../UIComponent';
import { ResearchNode } from '../../../../types/core/GameState';

export interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Component for rendering individual research nodes with appropriate styling
 */
export class ResearchNodeRenderer extends UIComponent {
  private node: ResearchNode;
  private nodeId: string;
  private isSelected: boolean;
  
  constructor(node: ResearchNode, nodeId: string, isSelected: boolean = false) {
    super('div', `research-node ${node.status}`);
    this.node = node;
    this.nodeId = nodeId;
    this.isSelected = isSelected;
  }
  
  /**
   * Generate the research node HTML
   */
  protected createTemplate(): string {
    const { research } = this.gameState || { research: null };
    if (!research) return '';
    
    const hasRequirements = (this.node.prerequisites && this.node.prerequisites.length > 0) || 
                           (this.node.computeCost && this.node.computeCost > 0) ||
                           (this.node.influenceCost && Object.keys(this.node.influenceCost).length > 0);
    const isInProgress = this.node.status === 'in_progress';
    const progressBar = isInProgress ? this.createProgressBar() : '';
    
    const categoryClass = this.node.category ? this.node.category.toLowerCase() : 'uncategorized';
    const name = this.node.name || 'Unknown Research';
    const category = this.node.category || 'Uncategorized';
    const posX = this.node.position?.x || 0;
    const posY = this.node.position?.y || 0;
    
    return `
      <div class="research-node ${this.node.status} ${categoryClass} ${this.isSelected ? 'selected' : ''}" 
           data-node-id="${this.nodeId}"
           style="left: ${posX}px; top: ${posY}px;">
        <div class="node-header ${categoryClass}">
          <h3>${name}</h3>
        </div>
        <div class="node-body">
          <span class="category-badge ${categoryClass}">${category}</span>
          <span class="status-indicator ${this.node.status}"></span>
        </div>
        ${progressBar}
        ${hasRequirements ? this.createRequirementsIndicator() : ''}
      </div>
    `;
  }
  
  /**
   * Create progress bar for in-progress research
   */
  private createProgressBar(): string {
    const progress = this.node.progress || 0;
    const totalRequired = this.node.computeCost || 0;
    const percentage = totalRequired > 0 ? (progress / totalRequired) * 100 : 0;
    
    return `
      <div class="research-progress">
        <div class="progress-bar" style="width: ${percentage}%"></div>
        <span class="progress-text">${progress} / ${totalRequired}</span>
      </div>
    `;
  }
  
  /**
   * Create requirements indicator
   */
  private createRequirementsIndicator(): string {
    const hasUnmetRequirements = this.hasUnmetRequirements();
    const indicatorClass = hasUnmetRequirements ? 'unmet' : 'met';
    
    return `<div class="requirements-indicator ${indicatorClass}"></div>`;
  }
  
  /**
   * Check if node has unmet requirements
   */
  private hasUnmetRequirements(): boolean {
    const { research, resources } = this.gameState || { research: null, resources: null };
    if (!research || !resources) return true;
    
    // Check research prerequisites
    if (this.node.prerequisites && this.node.prerequisites.length > 0) {
      const unmetPrereqs = this.node.prerequisites.some((reqId: string) => {
        const reqNode = research.nodes[reqId];
        return !reqNode || reqNode.status !== 'completed';
      });
      
      if (unmetPrereqs) return true;
    }
    
    // Check compute requirements
    if (this.node.computeCost && this.node.computeCost > 0) {
      if ((resources.computing?.total || 0) < this.node.computeCost) {
        return true;
      }
    }
    
    // Check influence requirements
    if (this.node.influenceCost) {
      for (const [influenceType, required] of Object.entries(this.node.influenceCost)) {
        const currentInfluence = (resources.influence as any)?.[influenceType] || 0;
        if (currentInfluence < required) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  /**
   * Get node position for connection drawing
   */
  public getPosition(): NodePosition {
    const element = this.element;
    const rect = element.getBoundingClientRect();
    const parent = element.parentElement?.getBoundingClientRect();
    
    if (!parent) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    
    const posX = this.node.position?.x || 0;
    const posY = this.node.position?.y || 0;
    
    return {
      x: posX,
      y: posY,
      width: rect.width,
      height: rect.height
    };
  }
  
  /**
   * Update selection state
   */
  public setSelected(selected: boolean): void {
    this.isSelected = selected;
    this.render();
  }
}