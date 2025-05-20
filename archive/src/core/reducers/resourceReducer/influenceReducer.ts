/**
 * Influence resource reducer module
 * Handles all influence-related state updates
 */

import { ResourceState } from '../../../types/core/GameState';

/**
 * Handle influence generation (part of resource generation)
 */
export function generateInfluence(
  state: ResourceState,
  turn: number,
  influenceGrowth?: Record<string, number>
): ResourceState {
  const growth = {
    academic: Math.min(100, state.influence.academic + (influenceGrowth?.academic || 0)),
    industry: Math.min(100, state.influence.industry + (influenceGrowth?.industry || 0)),
    government: Math.min(100, state.influence.government + (influenceGrowth?.government || 0)),
    public: Math.min(100, state.influence.public + (influenceGrowth?.public || 0)),
    openSource: Math.min(100, state.influence.openSource + (influenceGrowth?.openSource || 0))
  };
  
  return {
    ...state,
    influence: {
      ...state.influence,
      ...growth,
      // Keep history of influence changes
      history: [
        ...(state.influence.history || []).slice(-9),
        {
          turn,
          previous: {
            academic: state.influence.academic,
            industry: state.influence.industry,
            government: state.influence.government,
            public: state.influence.public,
            openSource: state.influence.openSource
          },
          changes: {
            academic: (influenceGrowth?.academic || 0),
            industry: (influenceGrowth?.industry || 0),
            government: (influenceGrowth?.government || 0),
            public: (influenceGrowth?.public || 0),
            openSource: (influenceGrowth?.openSource || 0)
          },
          timestamp: Date.now()
        }
      ]
    }
  };
}

/**
 * Handle influence updates (specific field updates)
 */
export function handleInfluenceUpdate(
  state: ResourceState,
  field: string,
  amount: number
): ResourceState {
  return {
    ...state,
    influence: {
      ...state.influence,
      [field]: amount
    }
  };
}

/**
 * Handle influence spending
 */
export function spendInfluence(
  state: ResourceState,
  costs: Record<string, number>,
  reason: string,
  turn: number
): ResourceState {
  const newInfluence = { ...state.influence };
  const influenceChanges: Record<string, number> = {};
  
  // Apply each influence cost
  for (const [key, value] of Object.entries(costs)) {
    if (key in newInfluence && key !== 'history') {
      const fieldKey = key as keyof typeof newInfluence;
      const oldValue = newInfluence[fieldKey];
      // Influence can't go below 0
      if (typeof oldValue === 'number' && fieldKey !== 'history') {
        newInfluence[fieldKey] = Math.max(0, oldValue - value);
      }
      influenceChanges[key] = -value;
    }
  }
  
  return {
    ...state,
    influence: {
      ...newInfluence,
      // Track influence spending
      history: [
        ...(state.influence.history || []).slice(-9),
        {
          turn,
          previous: {
            academic: state.influence.academic,
            industry: state.influence.industry,
            government: state.influence.government,
            public: state.influence.public,
            openSource: state.influence.openSource
          },
          changes: influenceChanges,
          reason,
          timestamp: Date.now()
        }
      ]
    }
  };
}
