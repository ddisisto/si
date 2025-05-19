/**
 * Root game reducer that delegates to sub-reducers for each state slice
 */

import { GameState } from '../../core/GameState';
import { GameAction } from '../GameStateManager';

// Import all sub-reducers
import { metaReducer } from './metaReducer';
import { resourceReducer } from './resourceReducer';
import { researchReducer } from '../GameReducer'; // TODO: Extract this in next phase
import { deploymentReducer } from './deploymentReducer';
import { eventReducer } from './eventReducer';
import { worldReducer } from './worldReducer';
import { competitorReducer } from './competitorReducer';
import { settingsReducer } from './settingsReducer';

/**
 * Root reducer that combines all sub-reducers
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  return {
    meta: metaReducer(state.meta, action),
    resources: resourceReducer(state.resources, action),
    research: researchReducer(state.research, action),
    deployments: deploymentReducer(state.deployments, action),
    events: eventReducer(state.events, action),
    world: worldReducer(state.world, action),
    competitors: competitorReducer(state.competitors, action),
    settings: settingsReducer(state.settings, action)
  };
}
