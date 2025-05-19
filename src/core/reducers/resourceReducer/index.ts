/**
 * Resource reducer - Coordinates all resource-related state updates
 * Delegates to specialized sub-modules for each resource type
 */

import { ResourceState } from '../../../types/core/GameState';
import { GameAction } from '../../GameStateManager';

// Import sub-modules
import {
  handleComputingAllocation,
  handleComputingDeallocation,
  generateComputing,
  handleComputingUpdate,
  handleComputingCapUpdate
} from './computingReducer';

import {
  generateFunding,
  handleFundingUpdate,
  spendFunding,
  handleFundingCapUpdate
} from './fundingReducer';

import {
  generateInfluence,
  handleInfluenceUpdate,
  spendInfluence
} from './influenceReducer';

import {
  generateAndDecayData,
  handleDataUpdate,
  handleDataTypeUpdate,
  spendData
} from './dataReducer';

/**
 * Main resource reducer that delegates to sub-modules
 */
export function resourceReducer(state: ResourceState, action: GameAction): ResourceState {
  switch (action.type) {
    case 'ALLOCATE_COMPUTING':
      return handleComputingAllocation(state, action);
    
    case 'DEALLOCATE_COMPUTING':
      return handleComputingDeallocation(state, action);
      
    case 'GENERATE_RESOURCES':
      // Apply all resource generation in sequence
      let newState = state;
      newState = generateComputing(newState, action.payload.turn);
      newState = generateFunding(newState, action.payload.turn);
      newState = generateInfluence(newState, action.payload.turn, action.payload.influenceGrowth);
      newState = generateAndDecayData(newState, action.payload.turn);
      return newState;
      
    case 'UPDATE_RESOURCE':
      // Generic resource update for specific fields
      const { resourceType, field, amount } = action.payload;
      
      if (resourceType === 'computing') {
        return handleComputingUpdate(state, field, amount);
      } else if (resourceType === 'influence') {
        return handleInfluenceUpdate(state, field, amount);
      } else if (resourceType === 'funding') {
        return handleFundingUpdate(state, field, amount);
      } else if (resourceType === 'data') {
        return handleDataUpdate(state, field, amount, action.payload.key, action.payload.value);
      }
      return state;
      
    case 'UPDATE_DATA_TYPE':
      return handleDataTypeUpdate(state, action.payload.dataType, action.payload);
    
    case 'SPEND_RESOURCES':
      // Handle spending multiple resource types at once
      const { costs, reason } = action.payload;
      let updatedState = state;
      
      // Handle computing allocation separately (computing is allocated, not spent)
      if (costs.computing) {
        updatedState = handleComputingAllocation(updatedState, {
          type: 'ALLOCATE_COMPUTING',
          payload: {
            target: reason || 'general',
            amount: costs.computing,
            turn: action.payload.turn
          }
        });
      }
      
      // Handle funding costs
      if (costs.funding) {
        updatedState = spendFunding(
          updatedState,
          costs.funding,
          reason || 'general',
          action.payload.turn,
          costs.recurring
        );
      }
      
      // Handle influence costs
      if (costs.influence) {
        updatedState = spendInfluence(
          updatedState,
          costs.influence,
          reason || 'general',
          action.payload.turn
        );
      }
      
      // Handle data costs (setting tiers or specialized sets to false)
      if (costs.data) {
        updatedState = spendData(updatedState, costs.data);
      }
      
      return updatedState;

    case 'UPDATE_RESOURCE_CAPS':
      // Update resource caps
      let stateWithCaps = state;
      
      if (action.payload.computing !== undefined) {
        stateWithCaps = handleComputingCapUpdate(stateWithCaps, action.payload.computing);
      }
      
      if (action.payload.funding !== undefined) {
        stateWithCaps = handleFundingCapUpdate(stateWithCaps, action.payload.funding);
      }
      
      return stateWithCaps;
    
    default:
      return state;
  }
}