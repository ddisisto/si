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

/**
 * TurnSystem implements the turn-based progression described in state_management_design.md
 */
class TurnSystem extends BaseSystem {
  private stateManager: GameStateManager;
  private eventBus: EventBus;
  
  constructor(stateManager: GameStateManager, eventBus: EventBus) {
    super('TurnSystem');
    this.stateManager = stateManager;
    this.eventBus = eventBus;
  }
  
  public initialize(): void {
    // Subscribe to relevant events
    this.eventBus.subscribe('turn:end', this.endTurn.bind(this));
    
    console.log('Turn System initialized');
    this.setInitialized();
  }
  
  public update(_deltaTime: number): void {
    // This system doesn't need per-frame updates
    // Turn progression is event-driven
  }
  
  /**
   * Start a new turn
   */
  public startTurn(): void {
    console.log(`TurnSystem: Starting turn ${this.getCurrentTurn()}`);
    this.setPhase('START');
    this.eventBus.emit('turn:start', { turn: this.getCurrentTurn() });
    this.processTurnStart();
  }
  
  /**
   * End the current turn
   */
  public endTurn(data: any = {}): void {
    console.log(`TurnSystem: Ending turn ${this.getCurrentTurn()}`, data);
    
    this.setPhase('END');
    this.eventBus.emit('turn:ending', { turn: this.getCurrentTurn() });
    
    this.resolveTurnActions();
    this.processTurnEnd();
    
    // Advance to next turn
    console.log(`TurnSystem: Advancing to turn ${this.getCurrentTurn() + 1}`);
    this.stateManager.dispatch({ 
      type: 'ADVANCE_TURN', 
      payload: {} 
    });
    
    // Start new turn
    this.startTurn();
    console.log(`TurnSystem: Started turn ${this.getCurrentTurn()}`);
  }
  
  /**
   * Get the current turn number
   */
  public getCurrentTurn(): number {
    return this.stateManager.getState().meta.turn;
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
    // Generate resources at turn start
    this.stateManager.dispatch({ 
      type: 'GENERATE_RESOURCES', 
      payload: {} 
    });
    
    // Check for events
    this.checkForEvents();
    
    // Move to action phase
    this.setPhase('ACTION');
    this.eventBus.emit('phase:action', {});
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
      payload: {} 
    });
    
    // Apply deployment effects
    this.stateManager.dispatch({ 
      type: 'APPLY_DEPLOYMENT_EFFECTS', 
      payload: {} 
    });
  }
  
  /**
   * Process end-of-turn activities
   */
  private processTurnEnd(): void {
    // Update competitor actions
    this.stateManager.dispatch({ 
      type: 'UPDATE_COMPETITORS', 
      payload: {} 
    });
    
    // Save turn history
    this.stateManager.dispatch({ 
      type: 'SAVE_TURN_HISTORY', 
      payload: { turn: this.getCurrentTurn() } 
    });
    
    // Auto-save if enabled
    if (this.stateManager.getState().settings.autoSave) {
      this.stateManager.saveState('autosave');
    }
    
    this.eventBus.emit('turn:ended', { turn: this.getCurrentTurn() });
  }
  
  /**
   * Check for events that should trigger
   */
  private checkForEvents(): void {
    // In the future, this will check for event conditions
    // For now, we'll just emit an event for other systems to handle
    this.eventBus.emit('events:check', { turn: this.getCurrentTurn() });
  }
}

export default TurnSystem;