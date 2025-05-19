/**
 * Game Engine - Core game loop and state management
 */

import { System } from './System';
import GameStateManager from './GameStateManager';
import EventBus, { EventBusOptions } from './EventBus';
import { GameAction } from './GameStateManager';
import { gameReducer } from './reducers';
import { createInitialState, GameState } from './GameState';
import TurnSystem from './TurnSystem';
import { ResourceSystem, ResearchSystem } from '../systems';
import Logger from '../utils/Logger';

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
    this.eventBus = new EventBus({
      debugMode: process.env.NODE_ENV === 'development',
      enableEventChaining: true,
      maxListenersPerEvent: 20
    });
    
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
      Logger.info(`GameEngine: Received action:queue event with type: "${data.action?.type}"`);
      if (data.action) {
        this.actionQueue.push(data.action);
      }
    });
    
    // Subscribe to action events
    this.eventBus.subscribe('action:*', (data: any) => {
      const eventName = 'action:*';
      Logger.info(`GameEngine: Received action event "${eventName}" with data:`, data);
      
      // Create action from event data
      const action: GameAction = {
        type: eventName.replace('action:', '').toUpperCase(),
        ...data
      };
      
      Logger.info(`GameEngine: Queueing action: "${action.type}"`);
      this.actionQueue.push(action);
      
      // Process the action immediately (temporary - later may batch)
      this.processActions();
    });
    
    // Subscribe to save action
    this.eventBus.subscribe('action:save', (data: any) => {
      Logger.info(`GameEngine: Received action:save event with data:`, data);
      if (data.name) {
        this.saveGame(data.name);
        // Emit the game:saved event that SaveLoadPanel listens for
        this.eventBus.emit('game:saved', { name: data.name });
      } else {
        Logger.error('GameEngine: Save action missing name');
      }
    });
  }
  
  /**
   * Initialize the game engine
   */
  public initialize(): void {
    Logger.info('GameEngine: Starting initialization');
    Logger.info('GameEngine: Systems to initialize:', this.systems.map(s => s.getName()));
    
    // Initialize all systems
    this.systems.forEach(system => {
      Logger.info(`GameEngine: Initializing system ${system.getName()}`);
      system.initialize();
    });
    
    // Log final state of research nodes
    const finalState = this.stateManager.getState();
    Logger.info('GameEngine: After initialization, research nodes:', Object.keys(finalState.research.nodes).length);
    Logger.debug('GameEngine: Research nodes:', finalState.research.nodes);
    
    // Send initialization event
    this.eventBus.emit('engine:initialized');
  }
  
  /**
   * Start the game loop
   */
  public start(): void {
    if (!this.gameLoop) {
      Logger.info('Game Engine: Starting game loop');
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
        Logger.debug(`GameEngine: Dispatching action: "${action.type}"`);
        this.stateManager.dispatch(action);
      }
    }
  }
  
  /**
   * Stop the game loop
   */
  public stop(): void {
    if (this.gameLoop) {
      Logger.info('Game Engine: Stopping game loop');
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
    Logger.debug('GameEngine: Adding state subscription');
    return this.stateManager.subscribe(listener);
  }
  
  /**
   * Dispatch an action to the state manager
   * @param action The action to dispatch
   */
  public dispatch(action: GameAction): void {
    Logger.info(`GameEngine: Direct dispatch of action: "${action.type}"`);
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
      Logger.warn(`Long frame time: ${deltaTime.toFixed(2)}ms`);
    }
  }
  
  /**
   * Save the current game state
   */
  public saveGame(name: string = 'default'): void {
    Logger.info(`GameEngine: Saving game "${name}"`);
    this.stateManager.saveState(name);
  }
  
  /**
   * Load a game state
   */
  public loadGame(name: string = 'default'): boolean {
    Logger.info(`GameEngine: Loading game "${name}"`);
    const result = this.stateManager.loadState(name);
    Logger.info(`GameEngine: Load result: ${result ? 'success' : 'failed'}`);
    return result;
  }

  /**
   * Get system health status for debugging
   */
  public getHealthStatus(): {
    eventBus: ReturnType<typeof EventBus.prototype.getHealthStatus>;
    systems: { name: string; initialized: boolean }[];
    stateVersion: number;
  } {
    return {
      eventBus: this.eventBus.getHealthStatus(),
      systems: this.systems.map(system => ({
        name: system.getName(),
        initialized: system.isInitialized()
      })),
      stateVersion: this.getState().meta.version
    };
  }
}

export default GameEngine;