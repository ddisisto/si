/**
 * Computing resource reducer module
 * Handles all computing-related state updates
 */

import { ResourceState } from '../../../types/core/GameState';
import { GameAction } from '../../GameStateManager';

/**
 * Handle computing allocation actions
 */
export function handleComputingAllocation(
  state: ResourceState, 
  action: GameAction
): ResourceState {
  const targetAllocation = (state.computing.allocated[action.payload.target] || 0) + action.payload.amount;
  
  return {
    ...state,
    computing: {
      ...state.computing,
      allocated: {
        ...state.computing.allocated,
        [action.payload.target]: targetAllocation
      },
      // Add to allocation history
      allocationHistory: [
        ...(state.computing.allocationHistory || []).slice(-9), // Keep last 10 entries
        {
          turn: action.payload.turn || 0,
          target: action.payload.target,
          amount: action.payload.amount,
          timestamp: Date.now()
        }
      ]
    }
  };
}

/**
 * Handle computing deallocation actions
 */
export function handleComputingDeallocation(
  state: ResourceState, 
  action: GameAction
): ResourceState {
  const allocations = { ...state.computing.allocated };
  const currentAllocation = allocations[action.payload.target] || 0;
  const newAllocation = Math.max(0, currentAllocation - action.payload.amount);
  
  // Update or remove the allocation
  if (newAllocation > 0) {
    allocations[action.payload.target] = newAllocation;
  } else {
    delete allocations[action.payload.target];
  }
  
  return {
    ...state,
    computing: {
      ...state.computing,
      allocated: allocations,
      // Add to allocation history
      allocationHistory: [
        ...(state.computing.allocationHistory || []).slice(-9),
        {
          turn: action.payload.turn || 0,
          target: action.payload.target,
          amount: -action.payload.amount, // Negative to show deallocation
          timestamp: Date.now()
        }
      ]
    }
  };
}

/**
 * Handle computing generation (part of resource generation)
 */
export function generateComputing(
  state: ResourceState,
  turn: number
): ResourceState {
  const newComputingTotal = Math.min(
    state.computing.total + state.computing.generation,
    state.computing.cap
  );
  
  return {
    ...state,
    computing: {
      ...state.computing,
      total: newComputingTotal,
      // Keep history of generation
      generationHistory: [
        ...(state.computing.generationHistory || []).slice(-9),
        {
          turn,
          previous: state.computing.total,
          generated: state.computing.generation,
          newTotal: newComputingTotal,
          timestamp: Date.now()
        }
      ]
    }
  };
}

/**
 * Handle computing updates (specific field updates)
 */
export function handleComputingUpdate(
  state: ResourceState,
  field: string,
  amount: number
): ResourceState {
  return {
    ...state,
    computing: {
      ...state.computing,
      [field]: amount
    }
  };
}

/**
 * Handle computing capacity updates
 */
export function handleComputingCapUpdate(
  state: ResourceState,
  newCap: number
): ResourceState {
  return {
    ...state,
    computing: {
      ...state.computing,
      cap: newCap
    }
  };
}
