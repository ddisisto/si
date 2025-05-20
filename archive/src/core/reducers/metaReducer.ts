/**
 * Meta reducer for game-wide metadata
 */

import { GameMetaState } from '../../types/core/GameState';
import { GameAction } from '../GameStateManager';

export function metaReducer(state: GameMetaState, action: GameAction): GameMetaState {
  switch (action.type) {
    case 'META_UPDATE':
      return {
        ...state,
        ...action.payload
      };
      
    case 'ADVANCE_TURN':
      return {
        ...state,
        turn: state.turn + 1
      };
      
    case 'SET_PHASE':
      return {
        ...state,
        phase: action.payload.phase
      };
      
    case 'UPDATE_GAME_TIME':
      return {
        ...state,
        gameTime: {
          ...state.gameTime,
          ...action.payload.gameTime
        }
      };
      
    case 'UPDATE_TIME_COMPRESSION':
      return {
        ...state,
        gameTime: {
          ...state.gameTime,
          compressionFactor: action.payload.compressionFactor,
          timeScale: action.payload.timeScale
        }
      };
      
    case 'ADD_TURN_HISTORY':
      return {
        ...state,
        turnHistory: [
          ...(state.turnHistory || []).slice(-9), // Keep last 10 entries
          action.payload.historyEntry
        ]
      };
      
    default:
      return state;
  }
}