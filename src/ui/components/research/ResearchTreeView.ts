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
  private boundHandleViewAll: (event: Event) => void;
  private boundHandleWheel: (event: Event) => void;
  // Store drag state for panning
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private viewportTranslateX: number = 0;
  private viewportTranslateY: number = 0;
  // Store node positions for connection drawing and highlighting
  private nodePositions: Record<string, { x: number, y: number, width: number, height: number }> = {};
  
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
    this.boundHandleViewAll = this.handleViewAll.bind(this);
    this.boundHandleWheel = this.handleWheel.bind(this);
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
          <button class="zoom-control view-all">View All</button>
        </div>
      </div>
      <div class="research-tree-container">
        <div class="research-tree-view-port">
          <svg class="research-connections" width="100%" height="100%">
    `;
    
    // Process nodes first to store their positions
    this.nodePositions = {};
    
    Object.values(research.nodes).forEach(node => {
      // Calculate position based on node.position or default
      const position = node.position || { x: 0, y: 0 };
      
      // Calculate visual position (multiplier for spacing)
      const xPos = position.x * 220 + 50; // 220px width + 50px margin
      const yPos = position.y * 140 + 100; // 140px height + 100px margin
      
      // Store the position for connection drawing
      this.nodePositions[node.id] = {
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
      const nodePos = this.nodePositions[node.id];
      if (!nodePos) return;
      
      // Starting point for the line (left center of this node)
      const startX = nodePos.x;
      const startY = nodePos.y + (nodePos.height / 2);
      
      // Draw line to each prerequisite
      node.prerequisites.forEach(prereqId => {
        const prereqPos = this.nodePositions[prereqId];
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
        
        // Add path to SVG with data attributes for connection highlighting
        html += `
          <path 
            class="${lineClass}"
            data-from="${node.id}"
            data-to="${prereqId}"
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
    // Skip rendering if element is not available
    if (!this.element) {
      return;
    }
    
    // Update the element's content
    const template = this.createTemplate();
    this.element.innerHTML = template;
    
    // Always re-attach event handlers after rendering
    this.bindEvents();
    
    // Apply zoom and pan transformations
    this.applyZoomAndPan();
  }
  
  
  /**
   * Handle node selection
   */
  
  protected bindEvents(): void {
    // Add click event to research nodes
    const nodeElements = this.element.querySelectorAll('.research-node');
    
    nodeElements.forEach(node => {
      node.addEventListener('click', this.boundHandleNodeClick);
    });
    
    // Bind zoom control events
    const viewAllButton = this.element.querySelector('.view-all');
    if (viewAllButton) {
      viewAllButton.addEventListener('click', this.boundHandleViewAll);
    }
    
    // Bind panning and zooming events
    const viewPort = this.element.querySelector('.research-tree-view-port');
    if (viewPort) {
      // Panning events
      viewPort.addEventListener('mousedown', (e: Event) => this.handleDragStart(e as MouseEvent));
      viewPort.addEventListener('mousemove', (e: Event) => this.handleDragMove(e as MouseEvent));
      viewPort.addEventListener('mouseup', () => this.handleDragEnd());
      viewPort.addEventListener('mouseleave', () => this.handleDragEnd());
      
      // Wheel zooming
      viewPort.addEventListener('wheel', this.boundHandleWheel, { passive: false });
    }
  }
  
  /**
   * Handle view all button click - zooms out to see the entire tree
   */
  private handleViewAll(event: Event): void {
    event.stopPropagation();
    this.zoomLevel = 0.5; // Zoomed out to see most of the tree
    this.viewportTranslateX = 0;
    this.viewportTranslateY = 0;
    this.applyZoomAndPan();
  }
  
  /**
   * Handle wheel events for zooming
   * 
   * TODO: Add pinch-to-zoom support for touch devices:
   * - Implement touch gesture handling for pinch zoom
   * - Use pointer events or touch events API
   * - Calculate zoom based on distance between touch points
   */
  private handleWheel(event: Event): void {
    // Cast to WheelEvent to access necessary properties
    const wheelEvent = event as WheelEvent;
    // Prevent default behavior (page scrolling)
    event.preventDefault();
    
    // Get mouse position relative to the viewport
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = wheelEvent.clientX - rect.left;
    const mouseY = wheelEvent.clientY - rect.top;
    
    // Calculate the point to zoom towards (mouse position)
    const zoomPointX = (mouseX / this.zoomLevel) - this.viewportTranslateX;
    const zoomPointY = (mouseY / this.zoomLevel) - this.viewportTranslateY;
    
    // Determine zoom direction and amount
    const delta = wheelEvent.deltaY < 0 ? 0.1 : -0.1;
    const newZoomLevel = Math.max(0.5, Math.min(3.0, this.zoomLevel + delta));
    
    // Only proceed if zoom level actually changed
    if (newZoomLevel !== this.zoomLevel) {
      // Calculate new viewport position to zoom toward mouse
      const zoomFactor = newZoomLevel / this.zoomLevel;
      this.viewportTranslateX = -zoomPointX * zoomFactor + mouseX / newZoomLevel;
      this.viewportTranslateY = -zoomPointY * zoomFactor + mouseY / newZoomLevel;
      
      // Update zoom level
      this.zoomLevel = newZoomLevel;
      
      // Apply the new transformation
      this.applyZoomAndPan();
    }
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
      
      // Update node selection visuals without full re-render to preserve viewport position
      this.updateNodeSelectionVisuals();
    }
  }
  
  /**
   * Update visual selection state of nodes without full re-render
   */
  private updateNodeSelectionVisuals(): void {
    // First remove selected class from all nodes
    const nodeElements = this.element.querySelectorAll('.research-node');
    nodeElements.forEach(node => {
      node.classList.remove('selected');
    });
    
    // Add selected class to the currently selected node
    if (this.selectedNodeId) {
      const selectedNode = this.element.querySelector(`.research-node[data-id="${this.selectedNodeId}"]`);
      if (selectedNode) {
        selectedNode.classList.add('selected');
      }
    }
    
    // Update connection highlight state
    this.updateConnectionHighlights();
  }
  
  /**
   * Update connection highlights based on selected node
   */
  private updateConnectionHighlights(): void {
    // Remove highlighted class from all connections
    const connections = this.element.querySelectorAll('.connection');
    connections.forEach(conn => {
      conn.classList.remove('connection-highlighted');
    });
    
    // Skip if no node is selected or no game state
    if (!this.selectedNodeId || !this.gameState) return;
    
    // Get the selected node
    const selectedNode = this.gameState.research.nodes[this.selectedNodeId];
    if (!selectedNode) return;
    
    // For each connection related to the selected node, add the highlight class
    if (selectedNode.prerequisites) {
      // Add data-from and data-to attributes to paths when creating them to make this easier
      const relatedConnections = this.element.querySelectorAll(`.connection[data-from="${this.selectedNodeId}"], .connection[data-to="${this.selectedNodeId}"]`);
      relatedConnections.forEach(conn => {
        conn.classList.add('connection-highlighted');
      });
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
    
    // Remove zoom control events
    const viewAllButton = this.element.querySelector('.view-all');
    if (viewAllButton) {
      viewAllButton.removeEventListener('click', this.boundHandleViewAll);
    }
    
    // Remove wheel event listener
    const viewPort = this.element.querySelector('.research-tree-view-port');
    if (viewPort) {
      viewPort.removeEventListener('wheel', this.boundHandleWheel);
    }
    
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