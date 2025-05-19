/**
 * GameStateManager - Manages game state and provides dispatch capabilities
 * 
 * Implements the state management design from state_management_design.md
 */

import { GameState, createInitialState } from './GameState';
import EventBus from './EventBus';
import Logger from '../utils/Logger';

export interface GameAction {
  type: string;
  payload: any;
}

export type Reducer<S> = (state: S, action: GameAction) => S;
export type StateChangeListener = (prevState: GameState, nextState: GameState, action: GameAction) => void;

/**
 * GameStateManager provides a centralized way to access and update game state
 * using an immutable, reducer-based pattern
 */
class GameStateManager {
  private state: GameState;
  private reducer: Reducer<GameState>;
  private listeners: StateChangeListener[] = [];
  private eventBus: EventBus;
  
  constructor(initialState: GameState = createInitialState(), reducer: Reducer<GameState>, eventBus: EventBus) {
    this.state = initialState;
    this.reducer = reducer;
    this.eventBus = eventBus;
  }
  
  /**
   * Get a readonly version of the current game state
   */
  public getState(): Readonly<GameState> {
    return this.state;
  }
  
  /**
   * Dispatch an action to update the game state
   * @param action The action to dispatch
   */
  public dispatch(action: GameAction): void {
    Logger.debug(`GameStateManager: Dispatching action ${action.type}`, action.payload);
    const prevState = this.state;
    this.state = this.reducer(this.state, action);
    
    // Notify listeners only if state has changed
    if (prevState !== this.state) {
      Logger.debug(`GameStateManager: State changed after ${action.type}`);
      this.notifyListeners(prevState, this.state, action);
      
      // Emit state change event on the event bus
      this.eventBus.emit('stateChanged', {
        action: action.type,
        prevState,
        nextState: this.state
      });
    } else {
      Logger.debug(`GameStateManager: No state change after ${action.type}`);
    }
  }
  
  /**
   * Subscribe to state changes
   * @param listener Function to call when state changes
   * @returns Unsubscribe function
   */
  public subscribe(listener: StateChangeListener): () => void {
    this.listeners.push(listener);
    
    // Return function to unsubscribe
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  /**
   * Subscribe to changes in a specific part of the state
   * @param selector Function to extract the specific state slice
   * @param listener Function to call when selected state changes
   * @returns Unsubscribe function
   */
  public subscribeToSlice<S>(
    selector: (state: GameState) => S,
    listener: (prevSlice: S, nextSlice: S, action: GameAction) => void
  ): () => void {
    const sliceListener: StateChangeListener = (prevState, nextState, action) => {
      const prevSlice = selector(prevState);
      const nextSlice = selector(nextState);
      
      if (prevSlice !== nextSlice) {
        listener(prevSlice, nextSlice, action);
      }
    };
    
    return this.subscribe(sliceListener);
  }
  
  /**
   * Notify all listeners of a state change
   */
  private notifyListeners(prevState: GameState, nextState: GameState, action: GameAction): void {
    this.listeners.forEach(listener => {
      try {
        listener(prevState, nextState, action);
      } catch (error) {
        Logger.error('Error in state change listener:', error);
      }
    });
  }
  
  /**
   * Save current state to local storage
   */
  public saveState(name: string = 'default'): void {
    try {
      Logger.info(`GameStateManager: Saving game as "${name}"`);
      
      const gameTime = this.state.meta.gameTime;
      const turn = this.state.meta.turn;
      
      const saveData = {
        version: '1.0.0',
        gameState: this.state,
        timestamp: Date.now(),
        meta: {
          turn,
          year: gameTime.year,
          quarter: gameTime.quarter,
          month: gameTime.month,
          day: gameTime.day
        }
      };
      
      // Log save data details before saving
      Logger.debug(`GameStateManager: Save data details:
        - Turn: ${turn}
        - Date: ${gameTime.year} Q${gameTime.quarter} (${gameTime.month}/${gameTime.day})
        - Timestamp: ${new Date(saveData.timestamp).toLocaleString()}
        - Key: si_save_${name}
      `);
      
      // Convert to JSON and check size
      const jsonData = JSON.stringify(saveData);
      Logger.debug(`GameStateManager: Save data size: ${(jsonData.length / 1024).toFixed(2)} KB`);
      
      // Actually save to localStorage
      localStorage.setItem(`si_save_${name}`, jsonData);
      
      // Check if it was actually saved
      const savedItem = localStorage.getItem(`si_save_${name}`);
      if (savedItem) {
        Logger.debug(`GameStateManager: Successfully verified save in localStorage`);
      } else {
        Logger.warn(`GameStateManager: Failed to verify save in localStorage`);
      }
      
      // Update last saved timestamp
      this.dispatch({
        type: 'META_UPDATE',
        payload: {
          lastSaved: new Date()
        }
      });
      
      Logger.info(`GameStateManager: Game saved as "${name}"`);
      
      // Emit event to notify UI
      this.eventBus.emit('game:saved', { name, timestamp: saveData.timestamp });
    } catch (error) {
      Logger.error('GameStateManager: Failed to save game:', error);
    }
  }
  
  /**
   * Load state from local storage
   */
  public loadState(name: string = 'default'): boolean {
    try {
      Logger.info(`GameStateManager: Attempting to load game "${name}"`);
      
      // Check localStorage for the save
      const saveData = localStorage.getItem(`si_save_${name}`);
      if (!saveData) {
        Logger.warn(`GameStateManager: No save found with name "${name}"`);
        return false;
      }
      
      Logger.debug(`GameStateManager: Found save data, size: ${(saveData.length / 1024).toFixed(2)} KB`);
      
      // Parse the data
      try {
        const parsedData = JSON.parse(saveData);
        Logger.debug(`GameStateManager: Successfully parsed save data:
          - Version: ${parsedData.version}
          - Timestamp: ${new Date(parsedData.timestamp).toLocaleString()}
          - Turn: ${parsedData.meta?.turn}
        `);
        
        // Keep track of the previous state
        const prevState = this.state;
        
        // Replace state
        this.state = parsedData.gameState;
        Logger.debug(`GameStateManager: State successfully replaced`);
        
        // Notify listeners about the state change
        this.notifyListeners(prevState, this.state, { 
            type: 'STATE_LOADED', 
            payload: { name } 
        });
        
        // Notify about complete state replacement via event bus
        this.eventBus.emit('stateLoaded', { name });
        Logger.info(`GameStateManager: Game loaded from "${name}"`);
        return true;
      } catch (parseError) {
        Logger.error('GameStateManager: Failed to parse save data:', parseError);
        return false;
      }
    } catch (error) {
      Logger.error('GameStateManager: Failed to load game:', error);
      return false;
    }
  }
}

export default GameStateManager;