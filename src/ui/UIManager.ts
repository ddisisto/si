/**
 * UIManager - Manages DOM-based UI components
 */

import { GameState } from '../core/GameState';
import { EventBus } from '../core';
import UIComponent from './components/UIComponent';

/**
 * Manages UI components and handles their lifecycle and updates
 */
class UIManager {
  private components: Map<string, UIComponent> = new Map();
  private rootElement: HTMLElement | null = null;
  private eventBus: EventBus;
  private gameState: Readonly<GameState> | null = null;
  
  /**
   * Create a new UI manager
   * @param eventBus Event bus for component communication
   */
  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }
  
  /**
   * Initialize the UI manager with a root element
   * @param rootElement Root DOM element to mount components to
   */
  public initialize(rootElement: HTMLElement): void {
    this.rootElement = rootElement;
    
    // Clear any loading indicators or previous content
    const loading = rootElement.querySelector('#loading');
    if (loading) {
      loading.remove();
    }
    
    console.log('UIManager initialized with root element:', rootElement);
    
    // Add a class to the root element to indicate it's been initialized
    rootElement.classList.add('ui-initialized');
  }
  
  /**
   * Register a component with the UI manager
   * @param id Unique identifier for the component
   * @param component The component to register
   * @param parentId Optional parent component ID to mount to
   */
  public registerComponent(id: string, component: UIComponent): void {
    try {
      // Store the component
      this.components.set(id, component);
      
      // Set event bus for component
      console.log(`UIManager: Setting EventBus for component ${id}`);
      component.setEventBus(this.eventBus);
      
      console.log(`Component registered: ${id}`);
      
      // If we have a root element and this is the layout, mount it
      if (this.rootElement && id === 'layout') {
        console.log('Mounting layout to root element');
        
        // Replace the existing content with our layout
        this.rootElement.innerHTML = '';
        component.mount(this.rootElement);
        
        // Update with current state if available
        if (this.gameState) {
          component.update(this.gameState);
        }
      }
    } catch (error) {
      console.error(`Error registering component ${id}:`, error);
    }
  }
  
  /**
   * Update all components with new game state
   * @param gameState Current game state
   */
  public update(gameState: Readonly<GameState>): void {
    this.gameState = gameState;
    
    // Update all registered components
    this.components.forEach(component => {
      component.update(gameState);
    });
  }
  
  /**
   * Get a component by ID
   * @param id Component ID
   */
  public getComponent(id: string): UIComponent | undefined {
    return this.components.get(id);
  }
  
  /**
   * Remove a component
   * @param id Component ID
   */
  public removeComponent(id: string): void {
    const component = this.components.get(id);
    if (component) {
      component.unmount();
      this.components.delete(id);
    }
  }
  
  /**
   * Get the root element
   */
  public getRootElement(): HTMLElement | null {
    return this.rootElement;
  }
  
  /**
   * Get all registered components
   */
  public getComponents(): Map<string, UIComponent> {
    return this.components;
  }
}

export default UIManager;