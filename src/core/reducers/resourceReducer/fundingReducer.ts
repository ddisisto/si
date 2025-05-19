/**
 * Funding resource reducer module
 * Handles all funding-related state updates
 */

import { ResourceState } from '../../../types/core/GameState';

/**
 * Handle funding generation (part of resource generation)
 */
export function generateFunding(
  state: ResourceState,
  turn: number
): ResourceState {
  const newFunding = {
    ...state.funding,
    current: state.funding.current + state.funding.income - state.funding.expenses,
    // Keep history of funding changes
    history: [
      ...(state.funding.history || []).slice(-9),
      {
        turn,
        previous: state.funding.current,
        income: state.funding.income,
        expenses: state.funding.expenses,
        change: state.funding.income - state.funding.expenses,
        timestamp: Date.now()
      }
    ]
  };
  
  return {
    ...state,
    funding: newFunding
  };
}

/**
 * Handle funding updates (specific field updates)
 */
export function handleFundingUpdate(
  state: ResourceState,
  field: string,
  amount: number
): ResourceState {
  return {
    ...state,
    funding: {
      ...state.funding,
      [field]: amount
    }
  };
}

/**
 * Handle funding spending
 */
export function spendFunding(
  state: ResourceState,
  amount: number,
  reason: string,
  turn: number,
  recurring: boolean = false
): ResourceState {
  return {
    ...state,
    funding: {
      ...state.funding,
      current: state.funding.current - amount,
      // Track spending in history
      expenses: state.funding.expenses + (recurring ? amount : 0),
      spendingHistory: [
        ...(state.funding.spendingHistory || []).slice(-9),
        {
          turn,
          amount,
          reason,
          recurring,
          timestamp: Date.now()
        }
      ]
    }
  };
}

/**
 * Handle funding capacity updates
 */
export function handleFundingCapUpdate(
  state: ResourceState,
  maxReserves: number
): ResourceState {
  return {
    ...state,
    funding: {
      ...state.funding,
      maxReserves
    }
  };
}
