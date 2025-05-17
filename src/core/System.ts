/**
 * System - Base interface for game systems
 */

import { GameAction } from './GameStateManager';

/**
 * System interface defines the contract for all game systems
 */
export interface System {
  /**
   * Get the name of the system
   */
  getName(): string;
  
  /**
   * Initialize the system
   */
  initialize(): void;
  
  /**
   * Check if the system has been initialized
   */
  isInitialized(): boolean;
  
  /**
   * Update the system
   * @param deltaTime Time elapsed since last update in milliseconds
   */
  update(deltaTime: number): void;
  
  /**
   * Handle an action that affects this system
   * @param action The action to handle
   */
  handleAction?(action: GameAction): void;
}

/**
 * Abstract base class for systems
 * Provides common functionality for all systems
 */
export abstract class BaseSystem implements System {
  protected name: string;
  protected initialized: boolean = false;
  
  constructor(name: string) {
    this.name = name;
  }
  
  public getName(): string {
    return this.name;
  }
  
  public isInitialized(): boolean {
    return this.initialized;
  }
  
  public abstract initialize(): void;
  
  public abstract update(deltaTime: number): void;
  
  public handleAction?(action: GameAction): void;
  
  /**
   * Set the initialized state
   * Should be called at the end of initialize() in implementing classes
   */
  protected setInitialized(): void {
    this.initialized = true;
  }
}