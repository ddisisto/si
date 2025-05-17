/**
 * System - Base interface for game systems
 */

// This is a minimal system interface that will be expanded 
// as we implement specific game mechanics and state management
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
   * Update the system
   * @param deltaTime Time elapsed since last update in milliseconds
   */
  update(deltaTime: number): void;
}

/**
 * Abstract base class for systems
 */
export abstract class BaseSystem implements System {
  private name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  public getName(): string {
    return this.name;
  }
  
  public abstract initialize(): void;
  
  public abstract update(deltaTime: number): void;
}