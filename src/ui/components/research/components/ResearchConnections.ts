/**
 * ResearchConnections - Component for rendering connections between research nodes
 */

import UIComponent from '../../UIComponent';
import { ResearchNode } from '../../../../types/core/GameState';
import { NodePosition } from './ResearchNodeRenderer';

/**
 * Component for rendering SVG connections between research nodes
 */
export class ResearchConnections extends UIComponent {
  private nodePositions: Record<string, NodePosition> = {};
  private selectedNodeId: string | null = null;
  
  constructor() {
    super('svg', 'research-connections');
    
    // Set SVG attributes
    this.element.setAttribute('viewBox', '0 0 2000 2000');
    this.element.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }
  
  /**
   * Update node positions for connection drawing
   */
  public updateNodePositions(positions: Record<string, NodePosition>): void {
    this.nodePositions = positions;
    this.render();
  }
  
  /**
   * Set selected node for highlighting
   */
  public setSelectedNode(nodeId: string | null): void {
    this.selectedNodeId = nodeId;
    this.render();
  }
  
  /**
   * Generate the SVG connections
   */
  protected createTemplate(): string {
    if (!this.gameState || Object.keys(this.nodePositions).length === 0) {
      return '';
    }
    
    const { research } = this.gameState;
    const connections: string[] = [];
    
    // Create connection lines
    Object.entries(research.nodes).forEach(([nodeId, node]) => {
      if (node.prerequisites && node.prerequisites.length > 0) {
        node.prerequisites.forEach((reqId: string) => {
          const connection = this.createConnection(reqId, nodeId, node);
          if (connection) {
            connections.push(connection);
          }
        });
      }
    });
    
    return `
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
        </marker>
        <marker id="arrowhead-highlight" markerWidth="10" markerHeight="7" 
                refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#4CAF50" />
        </marker>
      </defs>
      ${connections.join('')}
    `;
  }
  
  /**
   * Create a connection between two nodes
   */
  private createConnection(fromId: string, toId: string, toNode: ResearchNode): string | null {
    const fromPos = this.nodePositions[fromId];
    const toPos = this.nodePositions[toId];
    
    if (!fromPos || !toPos) {
      return null;
    }
    
    // Calculate connection points
    const startX = fromPos.x + fromPos.width / 2;
    const startY = fromPos.y + fromPos.height;
    const endX = toPos.x + toPos.width / 2;
    const endY = toPos.y;
    
    // Calculate the curve control points for a smooth connection
    const controlY = (startY + endY) / 2;
    const path = `M ${startX} ${startY} Q ${startX} ${controlY}, ${endX} ${endY}`;
    
    // Determine connection style based on node status and selection
    const isConnectedToSelected = this.selectedNodeId === fromId || this.selectedNodeId === toId;
    const isHighlighted = isConnectedToSelected;
    const fromNode = this.gameState?.research.nodes[fromId];
    
    let connectionClass = 'research-connection';
    let markerEnd = 'url(#arrowhead)';
    
    if (isHighlighted) {
      connectionClass += ' highlighted';
      markerEnd = 'url(#arrowhead-highlight)';
    }
    
    if (fromNode && fromNode.status === 'completed' && toNode.status !== 'locked') {
      connectionClass += ' available';
    }
    
    return `
      <path 
        d="${path}" 
        class="${connectionClass}"
        marker-end="${markerEnd}"
        data-from="${fromId}" 
        data-to="${toId}"
        fill="none"
        stroke-width="2"
      />
    `;
  }
}