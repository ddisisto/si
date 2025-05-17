/**
 * GameStateManager - Manages game state and provides dispatch capabilities
 * 
 * Implements the state management design from state_management_design.md
 */

import { GameState, createInitialState } from './GameState';
import EventBus from './EventBus';

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
    console.log(`GameStateManager: Dispatching action ${action.type}`, action.payload);
    const prevState = this.state;
    this.state = this.reducer(this.state, action);
    
    // Notify listeners only if state has changed
    if (prevState !== this.state) {
      console.log(`GameStateManager: State changed after ${action.type}`);
      this.notifyListeners(prevState, this.state, action);
      
      // Emit state change event on the event bus
      this.eventBus.emit('stateChanged', {
        action: action.type,
        prevState,
        nextState: this.state
      });
    } else {
      console.log(`GameStateManager: No state change after ${action.type}`);
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
        console.error('Error in state change listener:', error);
      }
    });
  }
  
  /**
   * Save current state to local storage
   */
  public saveState(name: string = 'default'): void {
    try {
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
      
      localStorage.setItem(`si_save_${name}`, JSON.stringify(saveData));
      
      // Update last saved timestamp
      this.dispatch({
        type: 'META_UPDATE',
        payload: {
          lastSaved: new Date()
        }
      });
      
      console.log(`Game saved as "${name}"`);
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }
  
  /**
   * Load state from local storage
   */
  public loadState(name: string = 'default'): boolean {
    try {
      const saveData = localStorage.getItem(`si_save_${name}`);
      if (!saveData) {
        console.warn(`No save found with name "${name}"`);
        return false;
      }
      
      const parsedData = JSON.parse(saveData);
      this.state = parsedData.gameState;
      
      // Notify about complete state replacement
      this.eventBus.emit('stateLoaded', { name });
      console.log(`Game loaded from "${name}"`);
      return true;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  }
}

export default GameStateManager;