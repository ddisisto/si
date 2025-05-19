/**
 * Data resource reducer module
 * Handles all data-related state updates
 */

import { ResourceState, DataType } from '../../../types/core/GameState';

/**
 * Handle data generation and quality decay (part of resource generation)
 */
export function generateAndDecayData(
  state: ResourceState,
  turn: number
): ResourceState {
  const updatedDataTypes = { ...state.data.types };
  const MIN_QUALITY = 0.1; // Data never becomes completely unusable
  
  Object.values(DataType).forEach(type => {
    const currentTypeData = updatedDataTypes[type];
    if (currentTypeData) {
      // Apply quality decay (if decayRate is defined)
      const decayRate = currentTypeData.decayRate || 0.01; // Default decay rate
      const newQuality = Math.max(MIN_QUALITY, currentTypeData.quality - decayRate);
      
      // Apply generation (if any)
      const newAmount = currentTypeData.generationRate > 0 
        ? currentTypeData.amount + currentTypeData.generationRate 
        : currentTypeData.amount;
      
      updatedDataTypes[type] = {
        ...currentTypeData,
        amount: newAmount,
        quality: newQuality,
        lastUpdated: turn
      };
    }
  });
  
  return {
    ...state,
    data: {
      ...state.data,
      types: updatedDataTypes
    }
  };
}

/**
 * Handle data updates (specific field updates)
 */
export function handleDataUpdate(
  state: ResourceState,
  field: string,
  amount: number,
  key?: string,
  value?: any
): ResourceState {
  if (field === 'tiers' || field === 'specializedSets') {
    return {
      ...state,
      data: {
        ...state.data,
        [field]: {
          ...(state.data[field as keyof typeof state.data] as Record<string, boolean>),
          [key!]: value
        }
      }
    };
  } else {
    return {
      ...state,
      data: {
        ...state.data,
        [field]: amount
      }
    };
  }
}

/**
 * Handle data type updates
 */
export function handleDataTypeUpdate(
  state: ResourceState,
  dataType: DataType,
  updates: any
): ResourceState {
  return {
    ...state,
    data: {
      ...state.data,
      types: {
        ...state.data.types,
        [dataType]: {
          ...state.data.types[dataType],
          ...updates
        }
      }
    }
  };
}

/**
 * Handle data tier and specialized set changes (spending)
 */
export function spendData(
  state: ResourceState,
  costs: { tiers?: Record<string, boolean>, specializedSets?: Record<string, boolean> }
): ResourceState {
  const newData = { ...state.data };
  
  // Handle tier changes
  if (costs.tiers) {
    for (const [key, value] of Object.entries(costs.tiers)) {
      if (value === false) {
        newData.tiers = {
          ...newData.tiers,
          [key]: false
        };
      }
    }
  }
  
  // Handle specialized set changes
  if (costs.specializedSets) {
    for (const [key, value] of Object.entries(costs.specializedSets)) {
      if (value === false) {
        newData.specializedSets = {
          ...newData.specializedSets,
          [key]: false
        };
      }
    }
  }
  
  return {
    ...state,
    data: newData
  };
}
