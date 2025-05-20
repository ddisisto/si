/**
 * World reducer for global map and regions
 */

import { WorldState } from '../../types/core/GameState';
import { GameAction } from '../GameStateManager';

export function worldReducer(state: WorldState, action: GameAction): WorldState {
  switch (action.type) {
    case 'UPDATE_GLOBAL_VALUES':
      const { awareness, alignment, regulation } = action.payload;
      
      return {
        ...state,
        globalAwareness: awareness ?? state.globalAwareness,
        globalAlignment: alignment ?? state.globalAlignment,
        globalRegulation: regulation ?? state.globalRegulation
      };
      
    case 'UPDATE_REGION':
      const { regionId, field, value } = action.payload;
      
      if (state.regions[regionId]) {
        return {
          ...state,
          regions: {
            ...state.regions,
            [regionId]: {
              ...state.regions[regionId],
              [field]: value
            }
          }
        };
      }
      
      return state;
      
    default:
      return state;
  }
}
