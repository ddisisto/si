/**
 * ResearchTreeView - Component for displaying the research tree
 */

import UIComponent from '../UIComponent';
import { ResearchNode } from '../../../types/core/GameState';

/**
 * Component for displaying the research tree with zoomable view
 */
class ResearchTreeView extends UIComponent {
  private selectedNodeId: string | null = null;
  
  // Store bound event handlers to allow proper cleanup
  private boundHandleNodeClick: (event: Event) => void;
  private boundHandleStartResearch: (event: Event) => void;
  private boundHandleAllocateCompute: (event: Event) => void;
  private boundHandleCancelResearch: (event: Event) => void;
  
  // Store current zoom level
  private zoomLevel: number = 1.0;
  // Store bound event handlers for zoom controls
  private boundHandleZoomIn: (event: Event) => void;
  private boundHandleZoomOut: (event: Event) => void;
  private boundHandleZoomReset: (event: Event) => void;
  // Store drag state for panning
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private viewportTranslateX: number = 0;
  private viewportTranslateY: number = 0;
  
  /**
   * Create a new research tree view
   */
  constructor() {
    super('div', 'research-tree-view');
    
    // Create bound event handlers for node interaction
    this.boundHandleNodeClick = this.handleNodeClick.bind(this);
    this.boundHandleStartResearch = this.handleStartResearch.bind(this);
    this.boundHandleAllocateCompute = this.handleAllocateCompute.bind(this);
    this.boundHandleCancelResearch = this.handleCancelResearch.bind(this);
    
    // Create bound event handlers for zoom controls
    this.boundHandleZoomIn = this.handleZoomIn.bind(this);
    this.boundHandleZoomOut = this.handleZoomOut.bind(this);
    this.boundHandleZoomReset = this.handleZoomReset.bind(this);
  }
  
  /**
   * Generate the research tree HTML
   */
  protected createTemplate(): string {
    if (!this.gameState) {
      console.log('ResearchTreeView: No game state available');
      return `<div class="research-loading">Loading research data...</div>`;
    }
    
    const { research } = this.gameState;
    const nodeCount = Object.keys(research.nodes).length;
    console.log(`ResearchTreeView: Found ${nodeCount} research nodes`);
    
    if (nodeCount === 0) {
      return `<div class="research-empty">No research nodes available.</div>`;
    }
    
    // Build the HTML for the research tree controls
    let html = `
      <div class="research-tree-header">
        <div class="research-title">
          <h2>Research Tree</h2>
          <div class="stats">
            <span>Nodes: ${nodeCount}</span>
            <span>Active: ${research.activeResearch.length}</span>
            <span>Completed: ${research.completed.length}</span>
          </div>
        </div>
        <div class="research-controls">
          <button class="zoom-control zoom-in">+</button>
          <button class="zoom-control zoom-out">-</button>
          <button class="zoom-control zoom-reset">Reset</button>
        </div>
      </div>
      <div class="research-tree-container">
        <div class="research-tree-view-port">
          <svg class="research-connections" width="100%" height="100%">
    `;
    
    // Process nodes first to store their positions
    const nodePositions: Record<string, { x: number, y: number, width: number, height: number }> = {};
    
    Object.values(research.nodes).forEach(node => {
      // Calculate position based on node.position or default
      const position = node.position || { x: 0, y: 0 };
      
      // Calculate visual position (multiplier for spacing)
      const xPos = position.x * 220 + 50; // 220px width + 50px margin
      const yPos = position.y * 140 + 100; // 140px height + 100px margin
      
      // Store the position for connection drawing
      nodePositions[node.id] = {
        x: xPos,
        y: yPos,
        width: 200, // Fixed width of research node
        height: 100 // Approximate height
      };
    });
    
    // Draw connection lines
    Object.values(research.nodes).forEach(node => {
      if (!node.prerequisites || node.prerequisites.length === 0) {
        return; // Skip nodes with no prerequisites
      }
      
      // Get this node's position
      const nodePos = nodePositions[node.id];
      if (!nodePos) return;
      
      // Starting point for the line (left center of this node)
      const startX = nodePos.x;
      const startY = nodePos.y + (nodePos.height / 2);
      
      // Draw line to each prerequisite
      node.prerequisites.forEach(prereqId => {
        const prereqPos = nodePositions[prereqId];
        if (!prereqPos) return;
        
        // Ending point for the line (right center of prerequisite node)
        const endX = prereqPos.x + prereqPos.width;
        const endY = prereqPos.y + (prereqPos.height / 2);
        
        // Determine status for styling
        let lineClass = "connection";
        
        if (this.selectedNodeId === node.id || this.selectedNodeId === prereqId) {
          lineClass += " connection-highlighted";
        }
        
        // Add appropriate styling based on node status
        if (node.status === "COMPLETED" || node.status === "completed") {
          lineClass += " connection-completed";
        } else if (node.status === "IN_PROGRESS" || node.status === "in_progress") {
          lineClass += " connection-in-progress";
        } else if (node.status === "LOCKED" || node.status === "locked") {
          lineClass += " connection-locked";
        }
        
        // Create bezier curve between nodes
        const controlPoint1X = startX - 50; // Control point to the left of start
        const controlPoint1Y = startY;
        const controlPoint2X = endX + 50; // Control point to the right of end
        const controlPoint2Y = endY;
        
        // Add path to SVG
        html += `
          <path 
            class="${lineClass}"
            d="M ${startX},${startY} C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${endX},${endY}"
            marker-end="url(#arrowhead)"
          />
        `;
      });
    });
    
    // Add arrowhead marker definition to SVG
    html += `
      <defs>
        <marker 
          id="arrowhead" 
          markerWidth="10" 
          markerHeight="7" 
          refX="10" 
          refY="3.5" 
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
        </marker>
      </defs>
    `;
    
    // Close SVG and start the nodes container
    html += `
          </svg>
          <div class="research-nodes-container">
    `;
    
    // Add all nodes with their positions
    Object.values(research.nodes).forEach(node => {
      const isSelected = node.id === this.selectedNodeId;
      const statusClass = this.getStatusClass(node.status);
      const nodeClass = `research-node ${statusClass} ${isSelected ? 'selected' : ''}`;
      
      // Calculate position based on node.position or default
      const position = node.position || { x: 0, y: 0 };
      
      // Calculate visual position (multiplier for spacing)
      const xPos = position.x * 220 + 50; // 220px width + 50px margin
      const yPos = position.y * 140 + 100; // 140px height + 100px margin
      
      // Determine node type icon/indicator
      const nodeTypeIcon = this.getNodeTypeIcon(node.type as string);
      const categoryColor = this.getCategoryColor(node.category as string);
      
      html += `
        <div class="${nodeClass}" data-id="${node.id}" style="left: ${xPos}px; top: ${yPos}px; border-color: ${categoryColor};">
          <div class="node-header">
            <span class="node-name">${node.name || node.id}</span>
            <span class="node-type-icon">${nodeTypeIcon}</span>
          </div>
          <div class="node-status-indicator">${this.formatStatus(node.status)}</div>
          ${node.progress > 0 ? 
            `<div class="progress-bar"><div class="progress" style="width: ${Math.round(node.progress * 100)}%"></div></div>` : 
            ''}
          ${node.computeAllocated > 0 ? 
            `<div class="compute-allocation">💻 ${node.computeAllocated}</div>` : 
            ''}
        </div>
      `;
    });
    
    html += `
          </div>
        </div>
      </div>
    `;
    
    return html;
  }
  
  /**
   * Get a color for a research category
   */
  private getCategoryColor(category: string): string {
    const categoryColors: Record<string, string> = {
      'Foundations': '#4285F4', // Blue
      'Scaling': '#EA4335',     // Red
      'Capabilities': '#34A853', // Green
      'Infrastructure': '#FBBC05', // Yellow
      'Agency': '#AA46BC',     // Purple
      'Alignment': '#0F9D58',  // Teal
      'Uncategorized': '#757575' // Gray
    };
    
    return categoryColors[category] || categoryColors['Uncategorized'];
  }
  
  /**
   * Get an icon for a node type
   */
  private getNodeTypeIcon(nodeType: string): string {
    const typeIcons: Record<string, string> = {
      'standard': '📄',
      'breakthrough': '⭐',
      'tiered': '🔼',
      'risk': '⚠️',
      'divergent': '🔀'
    };
    
    return typeIcons[nodeType] || '📄';
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
   * Override the render method to ensure events are always bound
   */
  public render(): void {
    console.log('ResearchTreeView: render() called');
    
    // Skip rendering if element is not available
    if (!this.element) {
      console.log('ResearchTreeView: Cannot render, no element available');
      return;
    }
    
    console.log('ResearchTreeView: Creating template and updating element content');
    // Update the element's content
    const template = this.createTemplate();
    this.element.innerHTML = template;
    
    console.log(`ResearchTreeView: innerHTML set, element has ${this.element.children.length} children`);
    
    // Always re-attach event handlers after rendering
    this.bindEvents();
    
    // Debug: what's actually in the DOM?
    console.log('ResearchTreeView: Checking for research nodes in DOM after render:');
    const nodesInDom = this.element.querySelectorAll('.research-node');
    console.log(`ResearchTreeView: Found ${nodesInDom.length} research nodes in DOM after render`);
  }
  
  
  /**
   * Handle node selection
   */
  
  protected bindEvents(): void {
    console.log('ResearchTreeView: Binding events');
    
    // Add click event to research nodes
    const nodeElements = this.element.querySelectorAll('.research-node');
    console.log(`ResearchTreeView: Found ${nodeElements.length} node elements to bind events to`);
    
    nodeElements.forEach((node, index) => {
      const nodeId = node.getAttribute('data-id');
      console.log(`ResearchTreeView: Binding click event to node #${index}: ${nodeId}`);
      node.addEventListener('click', this.boundHandleNodeClick);
    });
    
    // Bind zoom control events
    const zoomInButton = this.element.querySelector('.zoom-in');
    if (zoomInButton) {
      zoomInButton.addEventListener('click', this.boundHandleZoomIn);
    }
    
    const zoomOutButton = this.element.querySelector('.zoom-out');
    if (zoomOutButton) {
      zoomOutButton.addEventListener('click', this.boundHandleZoomOut);
    }
    
    const zoomResetButton = this.element.querySelector('.zoom-reset');
    if (zoomResetButton) {
      zoomResetButton.addEventListener('click', this.boundHandleZoomReset);
    }
    
    // Bind panning events
    const viewPort = this.element.querySelector('.research-tree-view-port');
    if (viewPort) {
      viewPort.addEventListener('mousedown', (e: Event) => this.handleDragStart(e as MouseEvent));
      viewPort.addEventListener('mousemove', (e: Event) => this.handleDragMove(e as MouseEvent));
      viewPort.addEventListener('mouseup', () => this.handleDragEnd());
      viewPort.addEventListener('mouseleave', () => this.handleDragEnd());
    }
  }
  
  /**
   * Handle zoom in button click
   */
  private handleZoomIn(event: Event): void {
    event.stopPropagation();
    this.zoomLevel = Math.min(this.zoomLevel + 0.2, 3.0); // Limit max zoom to 3x
    this.applyZoomAndPan();
  }
  
  /**
   * Handle zoom out button click
   */
  private handleZoomOut(event: Event): void {
    event.stopPropagation();
    this.zoomLevel = Math.max(this.zoomLevel - 0.2, 0.5); // Limit min zoom to 0.5x
    this.applyZoomAndPan();
  }
  
  /**
   * Handle zoom reset button click
   */
  private handleZoomReset(event: Event): void {
    event.stopPropagation();
    this.zoomLevel = 1.0;
    this.viewportTranslateX = 0;
    this.viewportTranslateY = 0;
    this.applyZoomAndPan();
  }
  
  /**
   * Apply zoom and pan transformations to the viewport
   */
  private applyZoomAndPan(): void {
    const nodesContainer = this.element.querySelector('.research-nodes-container');
    const svg = this.element.querySelector('.research-connections');
    
    if (nodesContainer) {
      nodesContainer.setAttribute('style', 
        `transform: scale(${this.zoomLevel}) translate(${this.viewportTranslateX}px, ${this.viewportTranslateY}px);`
      );
    }
    
    if (svg) {
      svg.setAttribute('style', 
        `transform: scale(${this.zoomLevel}) translate(${this.viewportTranslateX}px, ${this.viewportTranslateY}px);`
      );
    }
  }
  
  /**
   * Handle drag start for panning
   */
  private handleDragStart(event: MouseEvent): void {
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
  }
  
  /**
   * Handle drag move for panning
   */
  private handleDragMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    
    const deltaX = (event.clientX - this.dragStartX) / this.zoomLevel;
    const deltaY = (event.clientY - this.dragStartY) / this.zoomLevel;
    
    this.viewportTranslateX += deltaX;
    this.viewportTranslateY += deltaY;
    
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    
    this.applyZoomAndPan();
  }
  
  /**
   * Handle drag end for panning
   */
  private handleDragEnd(): void {
    this.isDragging = false;
  }
  
  /**
   * Handle node click
   */
  private handleNodeClick(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const nodeId = target.dataset.id;
    
    if (nodeId) {
      this.selectedNodeId = nodeId;
      
      // Emit an event for the selected node to display details in the game info panel
      if (this.eventBus) {
        const node = this.getSelectedNode();
        this.eventBus.emit('ui:research_node_selected', {
          nodeId,
          node
        });
      }
      
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
  
  /**
   * Remove event listeners and clean up when component is unmounted
   */
  public unmount(): void {
    // Call the parent unmount method
    super.unmount();
    
    // Clean up any remaining listeners
    this.cleanupEventListeners();
  }
  
  /**
   * Cleanup event listeners attached to DOM elements
   */
  private cleanupEventListeners(): void {
    if (!this.element) return;
    
    // Remove click events from research nodes
    const nodeElements = this.element.querySelectorAll('.research-node');
    nodeElements.forEach(node => {
      node.removeEventListener('click', this.boundHandleNodeClick);
    });
    
    // Remove click events from action buttons
    const startButtons = this.element.querySelectorAll('.start-research');
    startButtons.forEach(button => {
      button.removeEventListener('click', this.boundHandleStartResearch);
    });
    
    const allocateButtons = this.element.querySelectorAll('.allocate-compute');
    allocateButtons.forEach(button => {
      button.removeEventListener('click', this.boundHandleAllocateCompute);
    });
    
    const cancelButtons = this.element.querySelectorAll('.cancel-research');
    cancelButtons.forEach(button => {
      button.removeEventListener('click', this.boundHandleCancelResearch);
    });
  }
}

export default ResearchTreeView;