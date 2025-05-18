/**
 * Game Engine - Core game loop and state management
 */

import { System } from './System';
import GameStateManager from './GameStateManager';
import EventBus from './EventBus';
import { GameAction } from './GameStateManager';
import { gameReducer } from './GameReducer';
import { createInitialState, GameState } from './GameState';
import TurnSystem from './TurnSystem';
import { ResourceSystem, ResearchSystem } from '../systems';

class GameEngine {
  private gameLoop: number | null = null;
  private lastTimestamp = 0;
  private stateManager: GameStateManager;
  public readonly eventBus: EventBus;
  private systems: System[] = [];
  private turnSystem: TurnSystem;
  private actionQueue: GameAction[] = [];
  
  constructor() {
    // Create event bus for system communication
    this.eventBus = new EventBus();
    
    // Create state manager with initial state and root reducer
    this.stateManager = new GameStateManager(
      createInitialState(),
      gameReducer,
      this.eventBus
    );
    
    // Create turn system (which will create TimeSystem internally)
    this.turnSystem = new TurnSystem(this.stateManager, this.eventBus);
    this.systems.push(this.turnSystem);
    
    // Create resource system
    const resourceSystem = new ResourceSystem(this.stateManager, this.eventBus);
    this.systems.push(resourceSystem);
    
    // Create research system
    const researchSystem = new ResearchSystem(this.stateManager, this.eventBus);
    this.systems.push(researchSystem);
    
    // Subscribe to events that need to queue actions
    this.eventBus.subscribe('action:queue', (data: any) => {
      console.log(`GameEngine: Received action:queue event with type: "${data.action?.type}"`);
      if (data.action) {
        this.actionQueue.push(data.action);
      }
    });
    
    // Subscribe to action events
    this.eventBus.subscribe('action:*', (data: any) => {
      const eventName = 'action:*';
      console.log(`GameEngine: Received action event "${eventName}" with data:`, data);
      
      // Create action from event data
      const action: GameAction = {
        type: eventName.replace('action:', '').toUpperCase(),
        ...data
      };
      
      console.log(`GameEngine: Queueing action: "${action.type}"`);
      this.actionQueue.push(action);
      
      // Process the action immediately (temporary - later may batch)
      this.processActions();
    });
    
    // Subscribe to save action
    this.eventBus.subscribe('action:save', (data: any) => {
      console.log(`GameEngine: Received action:save event with data:`, data);
      if (data.name) {
        this.saveGame(data.name);
        // Emit the game:saved event that SaveLoadPanel listens for
        this.eventBus.emit('game:saved', { name: data.name });
      } else {
        console.error('GameEngine: Save action missing name');
      }
    });
  }
  
  /**
   * Initialize the game engine
   */
  public initialize(): void {
    console.log('GameEngine: Starting initialization');
    console.log('GameEngine: Systems to initialize:', this.systems.map(s => s.getName()));
    
    // Initialize all systems
    this.systems.forEach(system => {
      console.log(`GameEngine: Initializing system ${system.getName()}`);
      system.initialize();
    });
    
    // Log final state of research nodes
    const finalState = this.stateManager.getState();
    console.log('GameEngine: After initialization, research nodes:', Object.keys(finalState.research.nodes).length);
    console.log('GameEngine: Research nodes:', finalState.research.nodes);
    
    // Send initialization event
    this.eventBus.emit('engine:initialized');
  }
  
  /**
   * Start the game loop
   */
  public start(): void {
    if (!this.gameLoop) {
      console.log('Game Engine: Starting game loop');
      this.lastTimestamp = performance.now();
      this.gameLoop = requestAnimationFrame(this.update.bind(this));
    }
  }
  
  /**
   * Main update loop
   */
  private update(currentTimestamp: number): void {
    const deltaTime = currentTimestamp - this.lastTimestamp;
    this.lastTimestamp = currentTimestamp;
    
    // Update systems before processing actions
    this.updateSystems(deltaTime);
    
    // Process any queued actions
    this.processActions();
    
    // Broadcast the current game state to any listeners
    this.eventBus.emit('state:updated', this.stateManager.getState());
    
    // Continue the game loop
    this.gameLoop = requestAnimationFrame(this.update.bind(this));
  }
  
  /**
   * Process all queued actions
   */
  private processActions(): void {
    while (this.actionQueue.length > 0) {
      const action = this.actionQueue.shift();
      if (action) {
        console.log(`GameEngine: Dispatching action: "${action.type}"`);
        this.stateManager.dispatch(action);
      }
    }
  }
  
  /**
   * Stop the game loop
   */
  public stop(): void {
    if (this.gameLoop) {
      console.log('Game Engine: Stopping game loop');
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }
  
  /**
   * Get the current game state
   * @returns The current game state
   */
  public getState(): GameState {
    return this.stateManager.getState();
  }
  
  /**
   * Get the state manager
   * @returns The state manager instance
   */
  public getStateManager(): GameStateManager {
    return this.stateManager;
  }
  
  /**
   * Get the turn system
   * @returns The turn system instance
   */
  public getTurnSystem(): TurnSystem {
    return this.turnSystem;
  }
  
  /**
   * Get the event bus
   * @returns The event bus instance
   */
  public getEventBus(): EventBus {
    return this.eventBus;
  }
  
  /**
   * Register a new system
   * @param system The system to register
   */
  public registerSystem(system: System): void {
    this.systems.push(system);
    if (this.gameLoop !== null) {
      system.initialize();
    }
  }
  
  /**
   * Subscribe to state changes  
   * @param listener Callback function that receives the new state
   * @returns Unsubscribe function
   */
  public subscribe(listener: (state: GameState) => void): () => void {
    console.log('GameEngine: Adding state subscription');
    return this.stateManager.subscribe(listener);
  }
  
  /**
   * Dispatch an action to the state manager
   * @param action The action to dispatch
   */
  public dispatch(action: GameAction): void {
    console.log(`GameEngine: Direct dispatch of action: "${action.type}"`);
    this.stateManager.dispatch(action);
  }
  
  
  
  /**
   * Update all registered systems
   */
  private updateSystems(deltaTime: number): void {
    // Update each system
    this.systems.forEach(system => {
      system.update(deltaTime);
    });
    
    // Log unusually large frame times during development
    if (deltaTime > 100) {
      console.warn(`Long frame time: ${deltaTime.toFixed(2)}ms`);
    }
  }
  
  /**
   * Save the current game state
   */
  public saveGame(name: string = 'default'): void {
    console.log(`GameEngine: Saving game "${name}"`);
    this.stateManager.saveState(name);
  }
  
  /**
   * Load a game state
   */
  public loadGame(name: string = 'default'): boolean {
    console.log(`GameEngine: Loading game "${name}"`);
    const result = this.stateManager.loadState(name);
    console.log(`GameEngine: Load result: ${result ? 'success' : 'failed'}`);
    return result;
  }
}

export default GameEngine;