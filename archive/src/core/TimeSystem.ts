/**
 * TimeSystem - Manages game time progression
 * 
 * Handles dynamic time scaling, compression, and temporal progression
 */

import { BaseSystem } from './System';
import GameStateManager from './GameStateManager';
import EventBus from './EventBus';
import { GameTime, TurnHistoryEntry } from '../types/core/GameState';
import Logger from '../utils/Logger';

/**
 * TimeSystem implements the dynamic time scaling mechanics
 * as described in the game design documents.
 * 
 * As research progresses, time compression increases,
 * representing the accelerating pace of AI development.
 */
class TimeSystem extends BaseSystem {
  private stateManager: GameStateManager;
  private eventBus: EventBus;
  
  // Configurable constants
  private readonly MIN_TIME_SCALE = 1; // Minimum days per turn (fastest)
  private readonly MAX_RESEARCH_FACTOR = 5.0; // Maximum research speedup
  private readonly DAYS_IN_MONTH = 30; // Simplified calendar
  private readonly MONTHS_IN_QUARTER = 3;
  
  constructor(stateManager: GameStateManager, eventBus: EventBus) {
    super('TimeSystem');
    this.stateManager = stateManager;
    this.eventBus = eventBus;
  }
  
  /**
   * Initialize the system and subscribe to events
   */
  public initialize(): void {
    // Subscribe to turn events to update time
    this.eventBus.subscribe('turn:ending', this.onTurnEnding.bind(this));
    
    // Subscribe to research events to adjust time compression
    this.eventBus.subscribe('research:complete', this.onResearchComplete.bind(this));
    this.eventBus.subscribe('research:breakthrough', this.onResearchBreakthrough.bind(this));
    
    Logger.info('Time System initialized');
    this.setInitialized();
  }
  
  /**
   * Update system (called each frame)
   */
  public update(_deltaTime: number): void {
    // This system is event-driven, no per-frame updates needed
  }
  
  /**
   * Advance game time based on current time scale
   * Returns the number of days advanced
   */
  public advanceTime(): number {
    const state = this.stateManager.getState();
    const { gameTime } = state.meta;
    
    // Calculate days to advance based on current time scale
    const daysToAdvance = Math.max(1, Math.round(gameTime.timeScale));
    
    // Create new game time with advanced dates
    const newGameTime = this.calculateNewGameTime(gameTime, daysToAdvance);
    
    // Update the game state with new time
    this.stateManager.dispatch({
      type: 'UPDATE_GAME_TIME',
      payload: {
        gameTime: newGameTime,
        daysAdvanced: daysToAdvance
      }
    });
    
    // Record turn in history
    const researchProgress = this.calculateResearchProgress();
    this.recordTurnHistory(daysToAdvance, newGameTime, researchProgress);
    
    // Emit event for other systems
    this.eventBus.emit('time:advanced', { 
      daysToAdvance, 
      newGameTime, 
      previousGameTime: gameTime 
    });
    
    return daysToAdvance;
  }
  
  /**
   * Handle turn ending event
   */
  private onTurnEnding(_data: any): void {
    this.advanceTime();
  }
  
  /**
   * Handle research completion
   * Small increase in time compression
   */
  private onResearchComplete(_data: any): void {
    this.adjustTimeCompression(0.05); // Small 5% increase
  }
  
  /**
   * Handle research breakthrough
   * Larger increase in time compression
   */
  private onResearchBreakthrough(_data: any): void {
    this.adjustTimeCompression(0.1); // Larger 10% increase
  }
  
  /**
   * Adjust time compression factor
   */
  public adjustTimeCompression(amount: number): void {
    const state = this.stateManager.getState();
    const currentFactor = state.meta.gameTime.compressionFactor;
    
    // Calculate new compression factor (bounded)
    const newFactor = Math.min(this.MAX_RESEARCH_FACTOR, currentFactor + amount);
    
    // Calculate new time scale (days per turn)
    // As compression increases, time scale decreases (more time passes per turn)
    const initialTimeScale = 90; // Quarterly turns
    const newTimeScale = Math.max(
      this.MIN_TIME_SCALE, 
      initialTimeScale / newFactor
    );
    
    // Update game time
    this.stateManager.dispatch({
      type: 'UPDATE_TIME_COMPRESSION',
      payload: {
        compressionFactor: newFactor,
        timeScale: newTimeScale
      }
    });
    
    // Emit event for UI and other systems
    this.eventBus.emit('time:compression:changed', { 
      compressionFactor: newFactor,
      timeScale: newTimeScale
    });
  }
  
  /**
   * Calculate new game time after advancing by a certain number of days
   */
  private calculateNewGameTime(currentTime: GameTime, daysToAdvance: number): GameTime {
    // Start with a copy of the current time
    const newTime: GameTime = {
      ...currentTime,
      daysPassed: currentTime.daysPassed + daysToAdvance
    };
    
    // Advance days
    newTime.day += daysToAdvance;
    
    // Handle month overflow
    while (newTime.day > this.DAYS_IN_MONTH) {
      newTime.day -= this.DAYS_IN_MONTH;
      newTime.month++;
      
      // Handle quarter changes
      if (newTime.month > 0 && newTime.month % this.MONTHS_IN_QUARTER === 1) {
        newTime.quarter = Math.ceil(newTime.month / this.MONTHS_IN_QUARTER);
      }
      
      // Handle year overflow
      if (newTime.month > 12) {
        newTime.month = 1;
        newTime.quarter = 1;
        newTime.year++;
      }
    }
    
    return newTime;
  }
  
  /**
   * Record turn in history
   */
  private recordTurnHistory(daysAdvanced: number, gameTime: GameTime, researchProgress: number): void {
    const state = this.stateManager.getState();
    const turn = state.meta.turn;
    
    const historyEntry: TurnHistoryEntry = {
      turn,
      timeScale: gameTime.timeScale,
      daysAdvanced,
      gameTime: { ...gameTime },
      researchProgress,
      timestamp: Date.now()
    };
    
    this.stateManager.dispatch({
      type: 'ADD_TURN_HISTORY',
      payload: { historyEntry }
    });
  }
  
  /**
   * Calculate research progress factor
   */
  private calculateResearchProgress(): number {
    const state = this.stateManager.getState();
    const { completed, nodes } = state.research;
    
    // Simple measure: completed research nodes / total research nodes
    const totalNodes = Object.keys(nodes).length;
    if (totalNodes === 0) return 0;
    
    return completed.length / totalNodes;
  }
  
  /**
   * Get a human-readable description of current time scale
   */
  public getTimeScaleDescription(): string {
    const state = this.stateManager.getState();
    const { timeScale } = state.meta.gameTime;
    
    if (timeScale >= 85) return "Quarterly";
    if (timeScale >= 28) return "Monthly";
    if (timeScale >= 7) return "Weekly";
    if (timeScale >= 1) return "Daily";
    return "Hourly"; // Future expansion
  }
  
  /**
   * Format game date for display
   */
  public formatGameDate(): string {
    const state = this.stateManager.getState();
    const { year, quarter, month, day } = state.meta.gameTime;
    
    const timeScale = this.getTimeScaleDescription();
    
    // Adjust display based on time scale
    if (timeScale === "Quarterly") {
      return `Q${quarter} ${year}`;
    } else if (timeScale === "Monthly") {
      const monthName = this.getMonthName(month);
      return `${monthName} ${year}`;
    } else {
      const monthName = this.getMonthName(month);
      return `${monthName} ${day}, ${year}`;
    }
  }
  
  /**
   * Convert month number to name
   */
  private getMonthName(month: number): string {
    const monthNames = [
      "January", "February", "March", 
      "April", "May", "June", 
      "July", "August", "September", 
      "October", "November", "December"
    ];
    
    return monthNames[month - 1] || "January";
  }
}

export default TimeSystem;