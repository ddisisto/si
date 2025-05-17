/**
 * InputHandler - Manages user input events
 */

import { EventBus } from '../core';

export type InputCallback = (x: number, y: number) => void;

class InputHandler {
  private canvas: HTMLCanvasElement;
  private eventBus: EventBus;
  
  private clickHandlers: InputCallback[] = [];
  private moveHandlers: InputCallback[] = [];
  
  constructor(canvas: HTMLCanvasElement, eventBus: EventBus) {
    this.canvas = canvas;
    this.eventBus = eventBus;
    this.initialize();
  }
  
  private initialize(): void {
    // Mouse events
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // Touch events for mobile
    this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    
    // Prevent context menu on right-click
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
  
  /**
   * Register a click handler
   */
  public addClickHandler(handler: InputCallback): void {
    this.clickHandlers.push(handler);
  }
  
  /**
   * Register a move handler
   */
  public addMoveHandler(handler: InputCallback): void {
    this.moveHandlers.push(handler);
  }
  
  /**
   * Handle mouse click events
   */
  private handleClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Notify all registered handlers
    this.clickHandlers.forEach(handler => handler(x, y));
    
    // Emit event for system-wide use
    this.eventBus.emit('input:click', { x, y, button: event.button });
  }
  
  /**
   * Handle mouse move events
   */
  private handleMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Notify all registered handlers
    this.moveHandlers.forEach(handler => handler(x, y));
    
    // Emit event for system-wide use
    this.eventBus.emit('input:move', { x, y });
  }
  
  /**
   * Handle touch events (for mobile)
   */
  private handleTouch(event: TouchEvent): void {
    event.preventDefault();
    
    if (event.touches.length > 0) {
      const rect = this.canvas.getBoundingClientRect();
      const touch = event.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // Notify all registered handlers
      this.clickHandlers.forEach(handler => handler(x, y));
      
      // Emit event for system-wide use
      this.eventBus.emit('input:touch', { x, y });
    }
  }
  
  /**
   * Handle touch move events (for mobile)
   */
  private handleTouchMove(event: TouchEvent): void {
    event.preventDefault();
    
    if (event.touches.length > 0) {
      const rect = this.canvas.getBoundingClientRect();
      const touch = event.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // Notify all registered handlers
      this.moveHandlers.forEach(handler => handler(x, y));
      
      // Emit event for system-wide use
      this.eventBus.emit('input:touchmove', { x, y });
    }
  }
}

export default InputHandler;