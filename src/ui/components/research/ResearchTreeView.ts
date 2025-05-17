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
  // Store filters with appropriate type definitions
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
    'available': true,
    'in_progress': true,
    'completed': true,
    'locked': true
  };
  // Store filter visibility state
  private isFilterPanelVisible: boolean = false;
  // Bound event handlers for filters
  private boundHandleToggleFilterPanel: (event: Event) => void;
  private boundHandleToggleDropdown: (event: Event) => void;
  private boundHandleSelectFilterOption: (event: Event) => void;
  // Track which dropdowns are open
  private openDropdowns: Set<string> = new Set();
  
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
    
    // Create bound event handlers for filters
    this.boundHandleToggleFilterPanel = this.handleToggleFilterPanel.bind(this);
    this.boundHandleToggleDropdown = this.handleToggleDropdown.bind(this);
    this.boundHandleSelectFilterOption = this.handleSelectFilterOption.bind(this);
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
      <div class="research-controls">
        <button class="zoom-control view-all">View All</button>
        <button class="filter-toggle" data-expanded="${this.isFilterPanelVisible}">
          <span class="filter-icon">⚙️</span>
        </button>
        <div class="stats">
          <span>Nodes: ${nodeCount}</span>
          <span>Active: ${research.activeResearch.length}</span>
          <span>Completed: ${research.completed.length}</span>
        </div>
      </div>
      <div class="filter-panel ${this.isFilterPanelVisible ? 'visible' : 'hidden'}">
        <div class="filter-controls">
          <div class="filter-dropdown">
            <label for="category-filter">Category:</label>
            <div class="dropdown-container">
              <div class="dropdown-selected" data-filter-type="category">
                <span>${Object.entries(this.categoryFilters).filter(([_, isEnabled]) => isEnabled).length} selected</span>
                <span class="dropdown-arrow">▼</span>
              </div>
              <div class="dropdown-options">
                <div class="dropdown-option select-all" data-filter-type="category" data-filter-action="all">
                  <span>Select All</span>
                </div>
                <div class="dropdown-option select-none" data-filter-type="category" data-filter-action="none">
                  <span>Select None</span>
                </div>
                <div class="dropdown-divider"></div>
                ${Object.entries(this.categoryFilters).map(([category, isEnabled]) => `
                  <div class="dropdown-option ${isEnabled ? 'active' : ''}" 
                       data-filter-type="category" data-filter-value="${category}">
                    <span class="filter-color" style="background-color: ${this.getCategoryColor(category)}"></span>
                    <span>${category}</span>
                    ${isEnabled ? '<span class="check-mark">✓</span>' : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div class="filter-dropdown">
            <label for="status-filter">Status:</label>
            <div class="dropdown-container">
              <div class="dropdown-selected" data-filter-type="status">
                <span>${Object.entries(this.statusFilters).filter(([_, isEnabled]) => isEnabled).length} selected</span>
                <span class="dropdown-arrow">▼</span>
              </div>
              <div class="dropdown-options">
                <div class="dropdown-option select-all" data-filter-type="status" data-filter-action="all">
                  <span>Select All</span>
                </div>
                <div class="dropdown-option select-none" data-filter-type="status" data-filter-action="none">
                  <span>Select None</span>
                </div>
                <div class="dropdown-divider"></div>
                ${Object.entries(this.statusFilters).map(([status, isEnabled]) => `
                  <div class="dropdown-option ${isEnabled ? 'active' : ''}" 
                       data-filter-type="status" data-filter-value="${status}">
                    <span class="filter-color status-color ${status}"></span>
                    <span>${this.formatStatus(status)}</span>
                    ${isEnabled ? '<span class="check-mark">✓</span>' : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
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
      
      // Skip nodes that don't match the current filters
      const category = node.category as string;
      const status = (node.status as string).toLowerCase();
      
      if (!this.categoryFilters[category] || !this.statusFilters[status]) {
        return;
      }
      
      // Get this node's position
      const nodePos = this.nodePositions[node.id];
      if (!nodePos) return;
      
      // Starting point for the line (left center of this node)
      const startX = nodePos.x;
      const startY = nodePos.y + (nodePos.height / 2);
      
      // Draw line to each prerequisite
      node.prerequisites.forEach(prereqId => {
        const prereq = research.nodes[prereqId];
        if (!prereq) return;
        
        // Skip connections to filtered-out prerequisites
        const prereqCategory = prereq.category as string;
        const prereqStatus = (prereq.status as string).toLowerCase();
        
        if (!this.categoryFilters[prereqCategory] || !this.statusFilters[prereqStatus]) {
          return;
        }
        
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
      // Skip nodes that don't match the current filters
      const category = node.category as string;
      const status = (node.status as string).toLowerCase();
      
      if (!this.categoryFilters[category] || !this.statusFilters[status]) {
        return;
      }
      
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
    
    // Bind filter panel toggle event
    const filterToggleButton = this.element.querySelector('.filter-toggle');
    if (filterToggleButton) {
      filterToggleButton.addEventListener('click', this.boundHandleToggleFilterPanel);
    }
    
    // Bind dropdown toggle events
    const dropdownSelected = this.element.querySelectorAll('.dropdown-selected');
    dropdownSelected.forEach(dropdown => {
      dropdown.addEventListener('click', this.boundHandleToggleDropdown);
    });
    
    // Bind dropdown option events
    const dropdownOptions = this.element.querySelectorAll('.dropdown-option');
    dropdownOptions.forEach(option => {
      option.addEventListener('click', this.boundHandleSelectFilterOption);
    });
    
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
    
    // Get viewport dimensions
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    
    // Make zooming smoother by using a smaller delta based on the actual wheel delta
    // Normalize the wheel delta to a smaller range for smoother zooming
    const rawDelta = wheelEvent.deltaY;
    const zoomDirection = rawDelta < 0 ? 1 : -1; // 1 for zoom in, -1 for zoom out
    const normalizedDelta = Math.min(Math.abs(rawDelta) / 100, 0.5) * 0.15 * zoomDirection;
    
    // Calculate the current zoom level with smoother increment
    const newZoomLevel = Math.max(0.5, Math.min(3.0, this.zoomLevel + normalizedDelta));
    
    // Only proceed if zoom level actually changed
    if (newZoomLevel !== this.zoomLevel) {
      // Use the same absolute center point approach for both zooming in and out
      // This creates a more stable and predictable zoom experience
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate the absolute center point in the content space
      const absoluteCenterX = (centerX / this.zoomLevel) - this.viewportTranslateX;
      const absoluteCenterY = (centerY / this.zoomLevel) - this.viewportTranslateY;
      
      // Calculate new viewport position to maintain absolute center
      this.viewportTranslateX = -absoluteCenterX + centerX / newZoomLevel;
      this.viewportTranslateY = -absoluteCenterY + centerY / newZoomLevel;
      
      // Update zoom level
      this.zoomLevel = newZoomLevel;
      
      // Apply the new transformation
      this.applyZoomAndPan();
    }
  }
  
  /**
   * Handle toggling the filter panel visibility
   */
  private handleToggleFilterPanel(event: Event): void {
    event.stopPropagation();
    
    // Toggle the filter panel visibility
    this.isFilterPanelVisible = !this.isFilterPanelVisible;
    
    // Clear any open dropdowns
    this.openDropdowns.clear();
    
    // Re-render the tree with the updated filter panel state
    this.render();
    
    // Add document click handler to close filter panel when clicking outside
    if (this.isFilterPanelVisible) {
      document.addEventListener('click', this.handleClickOutside.bind(this));
    } else {
      document.removeEventListener('click', this.handleClickOutside.bind(this));
    }
  }
  
  /**
   * Handle clicks outside the filter panel to close it
   */
  private handleClickOutside(event: Event): void {
    const filterPanel = this.element.querySelector('.filter-panel');
    const filterToggle = this.element.querySelector('.filter-toggle');
    
    if (filterPanel && filterToggle && 
        !filterPanel.contains(event.target as Node) && 
        !filterToggle.contains(event.target as Node)) {
      // Close any open dropdowns
      this.openDropdowns.clear();
      
      // If clicking outside, close the filter panel
      if (this.isFilterPanelVisible) {
        this.isFilterPanelVisible = false;
        this.render();
        document.removeEventListener('click', this.handleClickOutside.bind(this));
      }
    }
  }
  
  /**
   * Handle toggling dropdown visibility
   */
  private handleToggleDropdown(event: Event): void {
    event.stopPropagation();
    const dropdownElement = event.currentTarget as HTMLElement;
    const filterType = dropdownElement.dataset.filterType;
    
    if (filterType) {
      // Close other dropdowns
      this.openDropdowns.forEach(type => {
        if (type !== filterType) {
          this.openDropdowns.delete(type);
        }
      });
      
      // Toggle this dropdown
      if (this.openDropdowns.has(filterType)) {
        this.openDropdowns.delete(filterType);
      } else {
        this.openDropdowns.add(filterType);
      }
      
      // Update dropdown visibility without full re-render
      this.updateDropdownVisibility();
    }
  }
  
  /**
   * Update dropdown visibility without re-rendering the whole tree
   */
  private updateDropdownVisibility(): void {
    // Update all dropdowns
    const dropdowns = this.element.querySelectorAll('.dropdown-container');
    dropdowns.forEach(dropdown => {
      const selected = dropdown.querySelector('.dropdown-selected');
      const options = dropdown.querySelector('.dropdown-options');
      if (selected && options) {
        const filterType = (selected as HTMLElement).dataset.filterType;
        if (filterType) {
          if (this.openDropdowns.has(filterType)) {
            options.classList.add('visible');
          } else {
            options.classList.remove('visible');
          }
        }
      }
    });
    
    // Add or remove click outside listener based on whether any dropdown is open
    if (this.openDropdowns.size > 0) {
      document.addEventListener('click', this.handleClickOutsideDropdowns.bind(this));
    } else {
      document.removeEventListener('click', this.handleClickOutsideDropdowns.bind(this));
    }
  }
  
  /**
   * Handle clicks outside the dropdown to close it
   */
  private handleClickOutsideDropdowns(event: Event): void {
    // Only process if we have any open dropdowns
    if (this.openDropdowns.size === 0) return;
    
    // Get all dropdown elements
    const dropdownElements = this.element.querySelectorAll('.dropdown-container');
    let clickedInside = false;
    
    // Check if click was inside any dropdown
    dropdownElements.forEach(dropdown => {
      if (dropdown.contains(event.target as Node)) {
        clickedInside = true;
      }
    });
    
    // If clicked outside all dropdowns, close them all
    if (!clickedInside) {
      this.openDropdowns.clear();
      this.updateDropdownVisibility();
    }
  }
  
  /**
   * Handle selecting a filter option from dropdown
   */
  private handleSelectFilterOption(event: Event): void {
    event.stopPropagation();
    const optionElement = event.currentTarget as HTMLElement;
    const filterType = optionElement.dataset.filterType;
    const filterValue = optionElement.dataset.filterValue;
    const filterAction = optionElement.dataset.filterAction;
    
    if (filterType) {
      // Handle "Select All" or "Select None" actions
      if (filterAction === 'all' || filterAction === 'none') {
        const selectAll = filterAction === 'all';
        
        if (filterType === 'category') {
          // Set all category filters to the selection state
          Object.keys(this.categoryFilters).forEach(category => {
            this.categoryFilters[category] = selectAll;
          });
        } else if (filterType === 'status') {
          // Set all status filters to the selection state
          Object.keys(this.statusFilters).forEach(status => {
            this.statusFilters[status] = selectAll;
          });
        }
      } 
      // Handle individual item selection
      else if (filterValue) {
        if (filterType === 'category') {
          this.categoryFilters[filterValue] = !this.categoryFilters[filterValue];
        } else if (filterType === 'status') {
          this.statusFilters[filterValue] = !this.statusFilters[filterValue];
        }
      }
      
      // Re-render the tree with the new filters
      this.render();
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
    
    // Remove filter panel toggle event
    const filterToggleButton = this.element.querySelector('.filter-toggle');
    if (filterToggleButton) {
      filterToggleButton.removeEventListener('click', this.boundHandleToggleFilterPanel);
    }
    
    // Remove dropdown toggle events
    const dropdownSelected = this.element.querySelectorAll('.dropdown-selected');
    dropdownSelected.forEach(dropdown => {
      dropdown.removeEventListener('click', this.boundHandleToggleDropdown);
    });
    
    // Remove dropdown option events
    const dropdownOptions = this.element.querySelectorAll('.dropdown-option');
    dropdownOptions.forEach(option => {
      option.removeEventListener('click', this.boundHandleSelectFilterOption);
    });
    
    // Remove document click listeners
    document.removeEventListener('click', this.handleClickOutside.bind(this));
    document.removeEventListener('click', this.handleClickOutsideDropdowns.bind(this));
    
    // Clear any open dropdowns
    this.openDropdowns.clear();
    
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