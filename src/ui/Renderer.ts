/**
 * Renderer - Handles all canvas rendering operations
 */

import View from './View';

class Renderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private views: Map<string, View> = new Map();
  private activeView: string = '';

  constructor() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
    this.context = ctx;

    // Set initial canvas size
    this.resize();

    // Append to document
    document.body.appendChild(this.canvas);

    // Handle window resize
    window.addEventListener('resize', this.resize.bind(this));
  }

  /**
   * Adjust canvas size to match window dimensions
   */
  public resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Update views with new dimensions
    this.views.forEach(view => {
      view.resize(this.canvas.width, this.canvas.height);
    });
  }

  /**
   * Clear the entire canvas
   */
  public clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  /**
   * Register a new view
   */
  public registerView(name: string, view: View): void {
    this.views.set(name, view);
    
    // If this is the first view, make it active
    if (this.views.size === 1) {
      this.activeView = name;
    }
  }
  
  /**
   * Set the active view
   */
  public setActiveView(name: string): void {
    if (this.views.has(name)) {
      this.activeView = name;
    } else {
      console.error(`View not found: ${name}`);
    }
  }
  
  /**
   * Render the active view
   */
  public render(): void {
    this.clear();
    
    const view = this.views.get(this.activeView);
    if (view) {
      view.render(this.context);
    }
  }
  
  /**
   * Handle click events
   */
  public handleClick(x: number, y: number): void {
    const view = this.views.get(this.activeView);
    if (view) {
      view.handleClick(x, y);
    }
  }
  
  /**
   * Handle hover events
   */
  public handleHover(x: number, y: number): void {
    const view = this.views.get(this.activeView);
    if (view) {
      view.handleHover(x, y);
    }
  }
  
  /**
   * Get canvas dimensions
   */
  public getDimensions(): { width: number; height: number; canvas: HTMLCanvasElement } {
    return {
      width: this.canvas.width,
      height: this.canvas.height,
      canvas: this.canvas
    };
  }
}

export default Renderer;