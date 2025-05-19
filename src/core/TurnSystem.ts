/**
 * TurnSystem - Manages game turn progression
 * 
 * Handles the turn cycle, phases, and associated actions
 */

// We need GameAction for method signatures, but not using it directly
import { BaseSystem } from './System';
import { GamePhase } from '../types/core/GameState';
import GameStateManager from './GameStateManager';
import EventBus from './EventBus';
import TimeSystem from './TimeSystem';
import Logger from '../utils/Logger';

/**
 * TurnSystem implements the turn-based progression described in state_management_design.md
 * Enhanced with dynamic time progression from PLAN.md
 */
class TurnSystem extends BaseSystem {
  private stateManager: GameStateManager;
  private eventBus: EventBus;
  private timeSystem: TimeSystem;
  
  constructor(stateManager: GameStateManager, eventBus: EventBus) {
    super('TurnSystem');
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    
    // Create time system that will handle temporal progression
    this.timeSystem = new TimeSystem(stateManager, eventBus);
  }
  
  public initialize(): void {
    // Initialize time system
    this.timeSystem.initialize();
    
    // Subscribe to relevant events
    this.eventBus.subscribe('turn:end', this.endTurn.bind(this));
    
    Logger.info('Turn System initialized');
    this.setInitialized();
  }
  
  public update(deltaTime: number): void {
    // Update time system
    this.timeSystem.update(deltaTime);
    
    // This system doesn't need per-frame updates beyond that
    // Turn progression is event-driven
  }
  
  /**
   * Start a new turn
   */
  public startTurn(): void {
    const currentTurn = this.getCurrentTurn();
    const gameDate = this.timeSystem.formatGameDate();
    Logger.info(`TurnSystem: Starting turn ${currentTurn} (${gameDate})`);
    
    this.setPhase('START');
    this.eventBus.emit('turn:start', { 
      turn: currentTurn,
      gameTime: this.stateManager.getState().meta.gameTime,
      formattedDate: gameDate
    });
    
    this.processTurnStart();
  }
  
  /**
   * End the current turn
   */
  public endTurn(): void {
    const currentTurn = this.getCurrentTurn();
    
    this.setPhase('END');
    this.eventBus.emit('turn:ending', { 
      turn: currentTurn,
      gameTime: this.stateManager.getState().meta.gameTime 
    });
    
    this.resolveTurnActions();
    this.processTurnEnd();
    
    // Advance to next turn
    this.stateManager.dispatch({ 
      type: 'ADVANCE_TURN', 
      payload: {} 
    });
    
    // Start new turn (will be logged by EventBus)
    this.startTurn();
  }
  
  /**
   * Get the current turn number
   */
  public getCurrentTurn(): number {
    return this.stateManager.getState().meta.turn;
  }
  
  /**
   * Get the time system
   */
  public getTimeSystem(): TimeSystem {
    return this.timeSystem;
  }
  
  /**
   * Set the current game phase
   */
  public setPhase(phase: GamePhase): void {
    this.stateManager.dispatch({
      type: 'SET_PHASE',
      payload: { phase }
    });
    
    this.eventBus.emit('phase:changed', { phase });
  }
  
  /**
   * Process start-of-turn activities
   */
  private processTurnStart(): void {
    // Auto-save at the beginning of the turn if enabled (after turn state has been updated)
    // This ensures that when loading, we'll be at the same turn number the player was at
    if (this.stateManager.getState().settings.autoSave) {
      this.stateManager.saveState('autosave');
    }
    
    // Generate resources at turn start
    this.stateManager.dispatch({ 
      type: 'GENERATE_RESOURCES', 
      payload: { 
        turn: this.getCurrentTurn(),
        gameTime: this.stateManager.getState().meta.gameTime
      } 
    });
    
    // Check for events
    this.checkForEvents();
    
    // Move to action phase
    this.setPhase('ACTION');
    this.eventBus.emit('phase:action', {
      timeScale: this.timeSystem.getTimeScaleDescription(),
      formattedDate: this.timeSystem.formatGameDate()
    });
  }
  
  /**
   * Resolve actions taken during the turn
   */
  private resolveTurnActions(): void {
    // Enter resolution phase
    this.setPhase('RESOLUTION');
    this.eventBus.emit('phase:resolution', {});
    
    // Process research progress
    this.stateManager.dispatch({ 
      type: 'UPDATE_RESEARCH_PROGRESS', 
      payload: { 
        turn: this.getCurrentTurn(),
        gameTime: this.stateManager.getState().meta.gameTime
      } 
    });
    
    // Apply deployment effects
    this.stateManager.dispatch({ 
      type: 'APPLY_DEPLOYMENT_EFFECTS', 
      payload: { 
        turn: this.getCurrentTurn(),
        gameTime: this.stateManager.getState().meta.gameTime
      } 
    });
  }
  
  /**
   * Process end-of-turn activities
   */
  private processTurnEnd(): void {
    // Update competitor actions
    this.stateManager.dispatch({ 
      type: 'UPDATE_COMPETITORS', 
      payload: { 
        turn: this.getCurrentTurn(),
        gameTime: this.stateManager.getState().meta.gameTime
      } 
    });
    
    // Save turn history
    this.stateManager.dispatch({ 
      type: 'SAVE_TURN_HISTORY', 
      payload: { 
        turn: this.getCurrentTurn(),
        gameTime: this.stateManager.getState().meta.gameTime
      } 
    });
    
    // Note: Auto-save now happens at the START of the turn, not the end
    
    this.eventBus.emit('turn:ended', { 
      turn: this.getCurrentTurn(),
      gameTime: this.stateManager.getState().meta.gameTime,
      formattedDate: this.timeSystem.formatGameDate()
    });
  }
  
  /**
   * Check for events that should trigger
   */
  private checkForEvents(): void {
    // In the future, this will check for event conditions
    // For now, we'll just emit an event for other systems to handle
    this.eventBus.emit('events:check', { 
      turn: this.getCurrentTurn(),
      gameTime: this.stateManager.getState().meta.gameTime
    });
  }
}

export default TurnSystem;