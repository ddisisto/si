/**
 * Deployment reducer for managing deployed AI systems
 */

import { DeploymentState, DeploymentHistoryEntry } from '../../types/core/GameState';
import { GameAction } from '../GameStateManager';

export function deploymentReducer(state: DeploymentState, action: GameAction): DeploymentState {
  switch (action.type) {
    case 'DEPLOY_SYSTEM':
      const { id, type, computing, effects } = action.payload;
      
      return {
        ...state,
        active: {
          ...state.active,
          [id]: {
            id,
            type,
            computeAllocated: computing,
            turnDeployed: action.payload.turn,
            effects
          }
        }
      };
    
    case 'REMOVE_DEPLOYMENT':
      const { deploymentId, turn } = action.payload;
      const activeDeployments = { ...state.active };
      const deployment = activeDeployments[deploymentId];
      
      if (deployment) {
        delete activeDeployments[deploymentId];
        
        // Add to history
        const historyEntry: DeploymentHistoryEntry = {
          id: deployment.id,
          type: deployment.type,
          turnDeployed: deployment.turnDeployed,
          turnRemoved: turn,
          impact: { ...deployment.effects }
        };
        
        return {
          ...state,
          active: activeDeployments,
          history: [...state.history, historyEntry]
        };
      }
      
      return state;
      
    case 'UPDATE_DEPLOYMENT_SLOTS':
      return {
        ...state,
        slots: action.payload.slots
      };
      
    default:
      return state;
  }
}
