/**
 * ResearchTreeView - Component for displaying the research tree
 */

import UIComponent from '../UIComponent';
import { ResearchNode } from '../../../types/core/GameState';
import {
  ResearchNodeRenderer,
  ResearchControls,
  ResearchFilters,
  ResearchInfoPanel,
  ResearchConnections,
  NodePosition,
  ZoomChangeEvent,
  FilterChangeEvent,
  ResearchActionEvent
} from './components';

/**
 * Component for displaying the research tree with zoomable view
 */
class ResearchTreeView extends UIComponent {
  private selectedNodeId: string | null = null;
  
  // Child components
  private controlsComponent: ResearchControls;
  private filtersComponent: ResearchFilters;
  private infoPanelComponent: ResearchInfoPanel;
  private connectionsComponent: ResearchConnections;
  private nodeRenderers: Map<string, ResearchNodeRenderer> = new Map();
  
  // View state
  private zoomLevel: number = 0.5;
  private viewportTranslateX: number = 0;
  private viewportTranslateY: number = 0;
  private nodePositions: Record<string, NodePosition> = {};
  
  // Filter state
  private categoryFilters: Record<string, boolean> = {
    'Foundations': true,
    'Scaling': true,
    'Capabilities': true,
    'Infrastructure': true,
    'Agency': true,
    'Alignment': true,
    'Uncategorized': true
  };
  
  private statusFilters: Record<string, boolean> = {
    'AVAILABLE': true,
    'IN_PROGRESS': true,
    'COMPLETED': true,
    'LOCKED': true
  };
  
  // Event handlers
  private boundHandleNodeClick: (event: Event) => void;
  
  /**
   * Create a new research tree view
   */
  constructor() {
    super('div', 'research-tree-view');
    
    // Initialize child components
    this.controlsComponent = new ResearchControls(this.handleZoomChange.bind(this));
    this.filtersComponent = new ResearchFilters(this.handleFilterChange.bind(this));
    this.infoPanelComponent = new ResearchInfoPanel(this.handleResearchAction.bind(this));
    this.connectionsComponent = new ResearchConnections();
    
    // Bind event handlers
    this.boundHandleNodeClick = this.handleNodeClick.bind(this);
  }
  
  /**
   * Generate the research tree HTML
   */
  protected createTemplate(): string {
    console.log('ResearchTreeView: createTemplate called');
    
    if (!this.gameState) {
      console.log('ResearchTreeView: No game state available');
      return `<div class="research-loading">Loading research data...</div>`;
    }
    
    const { research } = this.gameState;
    const nodeCount = Object.keys(research.nodes).length;
    
    console.log('ResearchTreeView: Research nodes count:', nodeCount);
    console.log('ResearchTreeView: Research state:', research);
    
    if (nodeCount === 0) {
      console.log('ResearchTreeView: No research nodes available');
      return `<div class="research-empty">No research nodes available.</div>`;
    }
    
    return `
      <div class="research-tree-container">
        <div class="research-header">
          <h1>Research Tree</h1>
          <div class="tree-controls">
            <div id="research-controls"></div>
            <div id="research-filters"></div>
          </div>
        </div>
        
        <div class="research-main">
          <div class="research-tree-wrapper">
            <div class="research-tree-view-port">
              <div class="research-tree-content" style="transform: translate(${this.viewportTranslateX}px, ${this.viewportTranslateY}px) scale(${this.zoomLevel})">
                <div id="research-connections"></div>
                <div class="research-nodes" id="research-nodes"></div>
              </div>
            </div>
          </div>
          
          <div id="research-info-panel"></div>
        </div>
      </div>
    `;
  }
  
  /**
   * Set up event listeners and child components after render
   */
  protected setupEvents(): void {
    // Mount child components
    const controlsContainer = this.element.querySelector('#research-controls');
    const filtersContainer = this.element.querySelector('#research-filters');
    const infoPanelContainer = this.element.querySelector('#research-info-panel');
    const connectionsContainer = this.element.querySelector('#research-connections');
    
    if (controlsContainer && this.gameEngine) {
      controlsContainer.appendChild(this.controlsComponent.element);
      this.controlsComponent.setGameEngine(this.gameEngine);
      
      // Attach viewport for zoom controls
      const viewport = this.element.querySelector('.research-tree-view-port');
      if (viewport instanceof HTMLElement) {
        this.controlsComponent.attachViewport(viewport);
      }
    }
    
    if (filtersContainer && this.gameEngine) {
      filtersContainer.appendChild(this.filtersComponent.element);
      this.filtersComponent.setGameEngine(this.gameEngine);
    }
    
    if (infoPanelContainer && this.gameEngine) {
      infoPanelContainer.appendChild(this.infoPanelComponent.element);
      this.infoPanelComponent.setGameEngine(this.gameEngine);
    }
    
    if (connectionsContainer && this.gameEngine) {
      connectionsContainer.appendChild(this.connectionsComponent.element);
      this.connectionsComponent.setGameEngine(this.gameEngine);
    }
    
    // Render nodes
    console.log('ResearchTreeView: setupEvents - calling renderNodes');
    this.renderNodes();
    
    // Update connections
    console.log('ResearchTreeView: setupEvents - calling updateNodePositions');
    this.updateNodePositions();
  }
  
  /**
   * Render all research nodes
   */
  private renderNodes(): void {
    const nodesContainer = this.element.querySelector('#research-nodes');
    if (!nodesContainer || !this.gameState) return;
    
    // Clear existing nodes
    nodesContainer.innerHTML = '';
    this.nodeRenderers.clear();
    
    const { research } = this.gameState;
    
    // Create and render filtered nodes
    let visibleNodeCount = 0;
    
    Object.entries(research.nodes).forEach(([nodeId, node]) => {
      console.log(`ResearchTreeView: Processing node ${nodeId}, visible: ${this.isNodeVisible(node)}`);
      
      if (this.isNodeVisible(node)) {
        visibleNodeCount++;
        const isSelected = nodeId === this.selectedNodeId;
        const nodeRenderer = new ResearchNodeRenderer(node, nodeId, isSelected);
        if (this.gameEngine) {
          nodeRenderer.setGameEngine(this.gameEngine);
        }
        
        console.log(`ResearchTreeView: Adding node ${nodeId} to container`);
        nodesContainer.appendChild(nodeRenderer.element);
        
        // Add click handler
        nodeRenderer.element.addEventListener('click', this.boundHandleNodeClick);
        
        this.nodeRenderers.set(nodeId, nodeRenderer);
      }
    });
    
    console.log(`ResearchTreeView: Rendered ${visibleNodeCount} visible nodes`);
  }
  
  /**
   * Update node positions for connection drawing
   */
  private updateNodePositions(): void {
    this.nodePositions = {};
    
    this.nodeRenderers.forEach((renderer, nodeId) => {
      const position = renderer.getPosition();
      this.nodePositions[nodeId] = position;
    });
    
    this.connectionsComponent.updateNodePositions(this.nodePositions);
  }
  
  /**
   * Check if a node is visible based on filters
   */
  private isNodeVisible(node: ResearchNode): boolean {
    const nodeCategory = node.category || 'Uncategorized';
    const categoryVisible = this.categoryFilters[nodeCategory];
    const statusVisible = this.statusFilters[node.status];
    
    console.log(`ResearchTreeView: Node ${node.id} - category: ${nodeCategory}, status: ${node.status}`);
    console.log(`ResearchTreeView: Category visible: ${categoryVisible}, Status visible: ${statusVisible}`);
    console.log(`ResearchTreeView: Status filters:`, this.statusFilters);
    
    return categoryVisible && statusVisible;
  }
  
  /**
   * Handle node click
   */
  private handleNodeClick(event: Event): void {
    event.stopPropagation();
    
    const nodeElement = (event.currentTarget as HTMLElement).closest('.research-node');
    if (!nodeElement) return;
    
    const nodeId = nodeElement.getAttribute('data-node-id');
    if (!nodeId || !this.gameState) return;
    
    // Update selection
    this.selectedNodeId = nodeId;
    const selectedNode = this.gameState.research.nodes[nodeId];
    
    // Update components
    this.infoPanelComponent.setSelectedNode(selectedNode, nodeId);
    this.connectionsComponent.setSelectedNode(nodeId);
    
    // Update node rendering
    this.nodeRenderers.forEach((renderer, id) => {
      renderer.setSelected(id === nodeId);
    });
  }
  
  /**
   * Handle zoom change from controls
   */
  private handleZoomChange(event: ZoomChangeEvent): void {
    this.zoomLevel = event.zoom;
    this.viewportTranslateX = event.translateX;
    this.viewportTranslateY = event.translateY;
    
    const content = this.element.querySelector('.research-tree-content');
    if (content instanceof HTMLElement) {
      content.style.transform = `translate(${this.viewportTranslateX}px, ${this.viewportTranslateY}px) scale(${this.zoomLevel})`;
    }
  }
  
  /**
   * Handle filter change
   */
  private handleFilterChange(event: FilterChangeEvent): void {
    if (event.filterType === 'category') {
      this.categoryFilters[event.filterValue] = event.enabled;
    } else if (event.filterType === 'status') {
      this.statusFilters[event.filterValue] = event.enabled;
    }
    
    // Re-render nodes with new filters
    this.renderNodes();
    this.updateNodePositions();
  }
  
  /**
   * Handle research action from info panel
   */
  private handleResearchAction(event: ResearchActionEvent): void {
    if (!this.gameEngine || !this.gameEngine.eventBus) return;
    
    const { eventBus } = this.gameEngine;
    
    switch (event.action) {
      case 'start':
        eventBus.emit('action:research:start', { researchId: event.nodeId });
        break;
      case 'allocate':
        const computeToAllocate = 10;
        eventBus.emit('action:research:allocateCompute', { 
          researchId: event.nodeId,
          computeAmount: computeToAllocate
        });
        break;
      case 'cancel':
        eventBus.emit('action:research:cancel', { researchId: event.nodeId });
        break;
    }
  }
  
  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    // Clean up node click handlers
    this.nodeRenderers.forEach(renderer => {
      renderer.element.removeEventListener('click', this.boundHandleNodeClick);
    });
    
    // Clean up child components
    if (this.controlsComponent) {
      this.controlsComponent.cleanup();
    }
    if (this.filtersComponent) {
      this.filtersComponent.cleanup();
    }
    if (this.infoPanelComponent) {
      this.infoPanelComponent.cleanup();
    }
    if (this.connectionsComponent) {
      this.connectionsComponent.cleanup();
    }
    
    // Clear collections
    this.nodeRenderers.clear();
    this.nodePositions = {};
  }
}

export default ResearchTreeView;