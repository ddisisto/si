/**
 * ResearchControls - Component for research tree zoom and pan controls
 */

import UIComponent from '../../UIComponent';

export interface ZoomChangeEvent {
  zoom: number;
  translateX: number;
  translateY: number;
}

/**
 * Component for handling zoom and pan controls for research tree
 */
export class ResearchControls extends UIComponent {
  private zoomLevel: number = 0.5;
  private minZoom: number = 0.1;
  private maxZoom: number = 2.0;
  private zoomStep: number = 0.1;
  
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private viewportTranslateX: number = 0;
  private viewportTranslateY: number = 0;
  
  private onZoomChange?: (event: ZoomChangeEvent) => void;
  
  // Bound event handlers
  private boundHandleWheel: (event: Event) => void;
  private boundHandleMouseDown: (event: Event) => void;
  private boundHandleMouseMove: (event: Event) => void;
  private boundHandleMouseUp: (event: Event) => void;
  private boundHandleZoomIn: (event: Event) => void;
  private boundHandleZoomOut: (event: Event) => void;
  private boundHandleViewAll: (event: Event) => void;
  
  constructor(onZoomChange?: (event: ZoomChangeEvent) => void) {
    super('div', 'research-controls');
    this.onZoomChange = onZoomChange;
    
    // Bind event handlers
    this.boundHandleWheel = this.handleWheel.bind(this);
    this.boundHandleMouseDown = this.handleMouseDown.bind(this);
    this.boundHandleMouseMove = this.handleMouseMove.bind(this);
    this.boundHandleMouseUp = this.handleMouseUp.bind(this);
    this.boundHandleZoomIn = this.handleZoomIn.bind(this);
    this.boundHandleZoomOut = this.handleZoomOut.bind(this);
    this.boundHandleViewAll = this.handleViewAll.bind(this);
  }
  
  /**
   * Generate the control panel HTML
   */
  protected createTemplate(): string {
    return `
      <div class="zoom-controls">
        <button class="zoom-in btn-compact btn-secondary" title="Zoom In">+</button>
        <span class="zoom-level">${Math.round(this.zoomLevel * 100)}%</span>
        <button class="zoom-out btn-compact btn-secondary" title="Zoom Out">-</button>
        <button class="view-all btn-compact btn-secondary" title="View All">⊡</button>
      </div>
    `;
  }
  
  /**
   * Set up event listeners after render
   */
  protected setupEvents(): void {
    // Zoom button controls
    const zoomInButton = this.element.querySelector('.zoom-in');
    const zoomOutButton = this.element.querySelector('.zoom-out');
    const viewAllButton = this.element.querySelector('.view-all');
    
    if (zoomInButton) {
      zoomInButton.addEventListener('click', this.boundHandleZoomIn);
    }
    if (zoomOutButton) {
      zoomOutButton.addEventListener('click', this.boundHandleZoomOut);
    }
    if (viewAllButton) {
      viewAllButton.addEventListener('click', this.boundHandleViewAll);
    }
  }
  
  /**
   * Handle zoom in
   */
  private handleZoomIn(event: Event): void {
    event.preventDefault();
    this.setZoom(this.zoomLevel + this.zoomStep);
  }
  
  /**
   * Handle zoom out
   */
  private handleZoomOut(event: Event): void {
    event.preventDefault();
    this.setZoom(this.zoomLevel - this.zoomStep);
  }
  
  /**
   * Handle view all
   */
  private handleViewAll(event: Event): void {
    event.preventDefault();
    this.setZoom(0.5);
    this.viewportTranslateX = 0;
    this.viewportTranslateY = 0;
    this.notifyZoomChange();
  }
  
  /**
   * Handle mouse wheel for zooming
   */
  private handleWheel(event: Event): void {
    const wheelEvent = event as WheelEvent;
    wheelEvent.preventDefault();
    
    const delta = wheelEvent.deltaY > 0 ? -this.zoomStep : this.zoomStep;
    this.setZoom(this.zoomLevel + delta);
  }
  
  /**
   * Handle mouse down for panning
   */
  private handleMouseDown(event: Event): void {
    const mouseEvent = event as MouseEvent;
    this.isDragging = true;
    this.dragStartX = mouseEvent.clientX - this.viewportTranslateX;
    this.dragStartY = mouseEvent.clientY - this.viewportTranslateY;
    
    // Add global mouse move and up listeners
    document.addEventListener('mousemove', this.boundHandleMouseMove);
    document.addEventListener('mouseup', this.boundHandleMouseUp);
  }
  
  /**
   * Handle mouse move for panning
   */
  private handleMouseMove(event: Event): void {
    if (!this.isDragging) return;
    
    const mouseEvent = event as MouseEvent;
    this.viewportTranslateX = mouseEvent.clientX - this.dragStartX;
    this.viewportTranslateY = mouseEvent.clientY - this.dragStartY;
    
    this.notifyZoomChange();
  }
  
  /**
   * Handle mouse up to end panning
   */
  private handleMouseUp(_event: Event): void {
    this.isDragging = false;
    
    // Remove global mouse move and up listeners
    document.removeEventListener('mousemove', this.boundHandleMouseMove);
    document.removeEventListener('mouseup', this.boundHandleMouseUp);
  }
  
  /**
   * Set zoom level
   */
  private setZoom(zoom: number): void {
    this.zoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    this.updateZoomDisplay();
    this.notifyZoomChange();
  }
  
  /**
   * Update zoom level display
   */
  private updateZoomDisplay(): void {
    const zoomLevelElement = this.element.querySelector('.zoom-level');
    if (zoomLevelElement) {
      zoomLevelElement.textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }
  }
  
  /**
   * Notify parent component of zoom change
   */
  private notifyZoomChange(): void {
    if (this.onZoomChange) {
      this.onZoomChange({
        zoom: this.zoomLevel,
        translateX: this.viewportTranslateX,
        translateY: this.viewportTranslateY
      });
    }
  }
  
  /**
   * Attach viewport for wheel and pan events
   */
  public attachViewport(viewport: HTMLElement): void {
    viewport.addEventListener('wheel', this.boundHandleWheel);
    viewport.addEventListener('mousedown', this.boundHandleMouseDown);
    viewport.style.cursor = 'grab';
  }
  
  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    super.cleanup();
    
    // Remove document listeners if they exist
    document.removeEventListener('mousemove', this.boundHandleMouseMove);
    document.removeEventListener('mouseup', this.boundHandleMouseUp);
  }
}