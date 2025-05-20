/**
 * Competitor reducer for managing AI competitors
 */

import { CompetitorState } from '../../types/core/GameState';
import { GameAction } from '../GameStateManager';

export function competitorReducer(state: CompetitorState, action: GameAction): CompetitorState {
  switch (action.type) {
    case 'UPDATE_COMPETITOR':
      const { competitorId, fields } = action.payload;
      
      if (state.organizations[competitorId]) {
        return {
          ...state,
          organizations: {
            ...state.organizations,
            [competitorId]: {
              ...state.organizations[competitorId],
              ...fields
            }
          }
        };
      }
      
      return state;
      
    case 'UPDATE_PLAYER_RANKING':
      return {
        ...state,
        playerRanking: action.payload.ranking
      };
      
    default:
      return state;
  }
}
