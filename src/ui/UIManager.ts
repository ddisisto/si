/**
 * UIManager - Manages DOM-based UI components
 */

import { GameState } from '../core/GameState';
import { EventBus } from '../core';
import UIComponent from './components/UIComponent';

interface GameEngineInterface {
  getState(): GameState;
  eventBus: EventBus;
}

/**
 * Manages UI components and handles their lifecycle and updates
 */
class UIManager {
  private components: Map<string, UIComponent> = new Map();
  private rootElement: HTMLElement | null = null;
  private gameState: Readonly<GameState> | null = null;
  private gameEngine: GameEngineInterface | null = null;
  
  /**
   * Create a new UI manager
   * @param eventBus Event bus for component communication
   */
  constructor(_eventBus: EventBus) {
    // We keep eventBus in constructor for compatibility but don't store it
    // Components will get eventBus through gameEngine reference
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
   * Set the game engine reference
   * @param gameEngine Game engine instance
   */
  public setGameEngine(gameEngine: GameEngineInterface): void {
    this.gameEngine = gameEngine;
    
    // Update existing components with the game engine
    this.components.forEach(component => {
      component.setGameEngine(gameEngine);
    });
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
      
      // Pass game engine (with event bus) to component if available
      console.log(`UIManager: Setting GameEngine for component ${id}`);
      if (this.gameEngine) {
        component.setGameEngine(this.gameEngine);
      }
      
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
    const prevTurn = this.gameState?.meta.turn;
    const newTurn = gameState.meta.turn;
    
    if (prevTurn !== newTurn) {
      console.log(`UIManager: Updating components with new state, turn changed from ${prevTurn} to ${newTurn}`);
    }
    
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