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

class GameEngine {
  private gameLoop: number | null = null;
  private lastTimestamp = 0;
  private stateManager: GameStateManager;
  private eventBus: EventBus;
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
    
    // Subscribe to events that need to queue actions
    this.eventBus.subscribe('action:queue', (data: any) => {
      console.log(`GameEngine: Received action:queue event with type: "${data.action?.type}"`);
      if (data.action) {
        this.actionQueue.push(data.action);
      }
    });
    
    // Subscribe to save/load events
    this.eventBus.subscribe('action:save', (data: any) => {
      console.log(`GameEngine: Received action:save event with name: "${data.name}"`);
      this.saveGame(data.name);
      console.log(`GameEngine: Emitting game:saved event for "${data.name}"`);
      this.eventBus.emit('game:saved', { name: data.name });
    });
    
    this.eventBus.subscribe('action:load', (data: any) => {
      console.log(`GameEngine: Received action:load event with name: "${data.name}"`);
      console.log(`GameEngine: Current turn before load: ${this.stateManager.getState().meta.turn}`);
      
      const success = this.loadGame(data.name);
      
      if (success) {
        console.log(`GameEngine: Load succeeded, new turn: ${this.stateManager.getState().meta.turn}`);
        console.log(`GameEngine: Emitting game:loaded event for "${data.name}"`);
        this.eventBus.emit('game:loaded', { name: data.name });
      } else {
        console.error(`GameEngine: Failed to load game "${data.name}"`);
      }
    });
    
    console.log('Game Engine initialized');
  }
  
  /**
   * Initialize the game and all systems
   */
  public initialize(): void {
    // Initialize all registered systems
    this.systems.forEach(system => {
      system.initialize();
    });
    
    console.log('Game Engine systems initialized');
  }

  /**
   * Start the game loop
   */
  public start(): void {
    if (this.gameLoop !== null) return;
    
    // Initialize systems if not already done
    if (this.systems.some(system => !system.isInitialized())) {
      this.initialize();
    }
    
    // Start the first turn
    this.turnSystem.startTurn();
    
    this.lastTimestamp = performance.now();
    this.gameLoop = requestAnimationFrame(this.update.bind(this));
    console.log('Game loop started');
  }

  /**
   * Stop the game loop
   */
  public stop(): void {
    if (this.gameLoop === null) return;
    
    cancelAnimationFrame(this.gameLoop);
    this.gameLoop = null;
    console.log('Game loop stopped');
  }

  /**
   * Register a system with the game engine
   */
  public registerSystem(system: System): void {
    this.systems.push(system);
    
    // Initialize the system if the engine is already running
    if (this.gameLoop !== null && !system.isInitialized()) {
      system.initialize();
    }
    
    console.log(`System registered: ${system.getName()}`);
  }
  
  /**
   * Get the current game state
   */
  public getState(): Readonly<GameState> {
    return this.stateManager.getState();
  }
  
  /**
   * Get the state manager
   */
  public getStateManager(): GameStateManager {
    return this.stateManager;
  }
  
  /**
   * Dispatch an action to update the game state
   */
  public dispatch(action: GameAction): void {
    this.stateManager.dispatch(action);
  }
  
  /**
   * Get the event bus
   */
  public getEventBus(): EventBus {
    return this.eventBus;
  }
  
  /**
   * Get the turn system
   */
  public getTurnSystem(): TurnSystem {
    return this.turnSystem;
  }

  /**
   * Main update loop
   */
  private update(timestamp: number): void {
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Process any queued actions
    this.processActions();
    
    // Update all systems
    this.updateSystems(deltaTime);
    
    // Request next frame if game is still running
    if (this.gameLoop !== null) {
      this.gameLoop = requestAnimationFrame(this.update.bind(this));
    }
  }
  
  /**
   * Process any actions in the queue
   */
  private processActions(): void {
    if (this.actionQueue.length > 0) {
      const actions = [...this.actionQueue];
      this.actionQueue = [];
      
      actions.forEach(action => {
        this.stateManager.dispatch(action);
      });
    }
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