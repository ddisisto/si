/**
 * DemoView - A simple view for testing purposes
 */

import View, { ViewOptions } from './View';
import { GameState } from '../core/GameState';

class DemoView extends View {
  private gameState: GameState | null = null;
  private turn: number = 1;
  private resources = {
    computing: 0,
    funding: 0,
    academic: 0
  };
  
  constructor(options: ViewOptions = {}) {
    super(options);
  }
  
  /**
   * Connect to game state for display
   */
  public connectGameState(state: GameState): void {
    const previousTurn = this.turn;
    this.gameState = state;
    
    if (state) {
      this.turn = state.meta.turn;
      this.resources = {
        computing: state.resources.computing.total,
        funding: state.resources.funding.current,
        academic: state.resources.influence.academic
      };
      
      // Only log when turn changes to reduce console noise
      if (previousTurn !== this.turn) {
        console.log(`DemoView: Turn changed from ${previousTurn} to ${this.turn}`);
      }
    }
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
    
    // Display game state if available
    if (this.gameState) {
      this.renderGameState(context);
    }
  }
  
  /**
   * Render current game state
   */
  // Track button position for click detection
  private endTurnButtonBounds = { x: 0, y: 0, width: 0, height: 0 };
  
  private renderGameState(context: CanvasRenderingContext2D): void {
    context.font = '16px Arial';
    context.fillStyle = '#cba6f7';
    context.textAlign = 'left';
    
    // Display turn
    context.fillText(`Turn: ${this.turn}`, 20, 30);
    
    // Display resources
    context.fillText(`Computing: ${this.resources.computing.toFixed(0)}`, 20, 60);
    context.fillText(`Funding: $${this.resources.funding.toFixed(0)}`, 20, 85);
    context.fillText(`Academic Influence: ${this.resources.academic.toFixed(0)}`, 20, 110);
    
    // Calculate and render end turn button with relative positioning
    const buttonWidth = Math.min(120, this.width * 0.2);
    const buttonHeight = 40;
    const buttonX = 20;
    const buttonY = 140;
    
    // Store button bounds for click detection
    this.endTurnButtonBounds = {
      x: buttonX,
      y: buttonY,
      width: buttonWidth,
      height: buttonHeight
    };
    
    // Add end turn button
    context.fillStyle = '#f38ba8';
    context.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    context.fillStyle = '#1e1e2e';
    context.textAlign = 'center';
    context.fillText('End Turn', buttonX + buttonWidth/2, buttonY + buttonHeight/2 + 5);
    
    // Display organization (from right side)
    context.textAlign = 'right';
    context.fillStyle = '#cba6f7';
    context.fillText(`Organization: ${this.gameState?.meta.organization || 'ACADEMIC'}`, this.width - 20, 30);
  }

  public handleClick(x: number, y: number): boolean {
    console.log('Click at:', x, y);
    
    // Check if click is within the end turn button bounds
    const btn = this.endTurnButtonBounds;
    if (x >= btn.x && x <= btn.x + btn.width && 
        y >= btn.y && y <= btn.y + btn.height) {
      
      console.log('End Turn button clicked');
      
      if (this.gameState) {
        // Emit end turn event
        const event = new CustomEvent('turn:end', { 
          detail: { turn: this.gameState.meta.turn } 
        });
        document.dispatchEvent(event);
      }
    }
    
    return true;
  }

  public handleHover(_x: number, _y: number): boolean {
    // Simple hover handling
    return true;
  }
}

export default DemoView;