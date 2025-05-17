/**
 * Renderer - Handles all canvas rendering operations
 */

class Renderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

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

  public resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Additional rendering methods will be added here
}

export default Renderer;
