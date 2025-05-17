/**
 * DemoView - A simple view for testing purposes
 */

import View, { ViewOptions } from './View';

class DemoView extends View {
  constructor(options: ViewOptions = {}) {
    super(options);
  }

  public render(context: CanvasRenderingContext2D): void {
    // Clear the view area
    context.fillStyle = '#1e1e2e';
    context.fillRect(this.x, this.y, this.width, this.height);

    // Draw a simple shape
    context.fillStyle = '#94e2d5';
    context.beginPath();
    context.arc(this.width / 2, this.height / 2, 50, 0, Math.PI * 2);
    context.fill();

    // Add some text
    context.font = '24px Arial';
    context.fillStyle = '#cdd6f4';
    context.textAlign = 'center';
    context.fillText('SuperInt++', this.width / 2, this.height / 2 + 100);
    context.font = '18px Arial';
    context.fillText('Game Engine Initialized', this.width / 2, this.height / 2 + 130);
  }

  public handleClick(x: number, y: number): boolean {
    console.log('Click at:', x, y);
    return true;
  }

  public handleHover(_x: number, _y: number): boolean {
    // Simple hover handling
    return true;
  }
}

export default DemoView;