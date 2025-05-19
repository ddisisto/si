/**
 * Settings reducer for game configuration
 */

import { SettingsState } from '../../types/core/GameState';
import { GameAction } from '../GameStateManager';

export function settingsReducer(state: SettingsState, action: GameAction): SettingsState {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      console.log(`GameReducer: Updating settings with`, action.payload);
      return {
        ...state,
        ...action.payload
      };
      
    default:
      return state;
  }
}
