/**
 * UIComponent - Base class for DOM-based UI components
 */

import { GameState } from '../../core/GameState';
import { EventBus } from '../../core';

/**
 * Abstract base class for UI components
 * Each component represents a self-contained UI element 
 * with its own DOM representation, state handling, and event binding
 */
abstract class UIComponent {
  protected element: HTMLElement;
  protected gameState: Readonly<GameState> | null = null;
  protected eventBus: EventBus | null = null;
  
  /**
   * Create a new UI component
   * @param elementType HTML element type (div, button, etc.)
   * @param className Optional CSS class name
   */
  constructor(elementType: string, className?: string) {
    this.element = document.createElement(elementType);
    
    if (className) {
      this.element.className = className;
    }
  }
  
  /**
   * Mount the component to a parent element
   * @param parent Parent DOM element
   */
  public mount(parent: HTMLElement): void {
    parent.appendChild(this.element);
    this.render();
    this.afterMount();
  }
  
  /**
   * Called after the component is mounted
   * Override to add event listeners or perform other initialization
   */
  protected afterMount(): void {
    // Can be overridden by subclasses
  }
  
  /**
   * Remove the component from its parent
   */
  public unmount(): void {
    if (this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
  }
  
  /**
   * Update the component with new game state
   * @param gameState Current game state
   */
  public update(gameState: Readonly<GameState>): void {
    this.gameState = gameState;
    this.render();
  }
  
  /**
   * Render the component's content
   */
  public render(): void {
    // Skip rendering if element is not available
    if (!this.element) {
      return;
    }
    
    // Get current element innerHTML
    const currentHTML = this.element.innerHTML;
    const newHTML = this.createTemplate();
    
    // Only update if content has changed (optimization)
    if (currentHTML !== newHTML) {
      // Replace the inner HTML with the template
      this.element.innerHTML = newHTML;
      
      // Re-attach any event handlers
      this.bindEvents();
    }
  }
  
  /**
   * Called after render to bind events to DOM elements
   * Override in subclasses to attach event listeners
   */
  protected bindEvents(): void {
    // Can be overridden by subclasses
  }
  
  /**
   * Create the HTML template for the component
   * Must be implemented by subclasses
   */
  protected abstract createTemplate(): string;
  
  /**
   * Get the DOM element for this component
   */
  public getElement(): HTMLElement {
    return this.element;
  }
  
  /**
   * Set event bus for component communication
   * @param eventBus Event bus instance
   */
  public setEventBus(eventBus: EventBus): void {
    this.eventBus = eventBus;
  }
}

export default UIComponent;