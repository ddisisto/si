/**
 * View - Base class for game views
 */

export interface ViewOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/**
 * Abstract base class for views
 * Each view represents a visual section of the game
 */
abstract class View {
  protected x: number;
  protected y: number;
  protected width: number;
  protected height: number;
  
  constructor(options: ViewOptions = {}) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.width = options.width || 0;
    this.height = options.height || 0;
  }
  
  /**
   * Update the view dimensions
   */
  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
  
  /**
   * Render the view to the provided context
   */
  public abstract render(context: CanvasRenderingContext2D): void;
  
  /**
   * Handle mouse/touch interactions
   */
  public abstract handleClick(x: number, y: number): boolean;
  
  /**
   * Handle mouse/touch move events
   */
  public abstract handleHover(x: number, y: number): boolean;
}

export default View;