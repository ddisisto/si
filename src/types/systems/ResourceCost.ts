/**
 * ResourceCost - Interface for resource costs in game mechanics
 */

import { InfluenceResource, DataType } from '../core/GameState';

/**
 * Data requirement for persistent asset model
 */
export interface DataRequirement {
  minAmount: number;
  minQuality: number;
}

/**
 * Interface for resource costs used across various game systems
 * Updated for persistent data asset model
 */
export interface ResourceCost {
  computing?: number;
  funding?: number;
  influence?: Partial<Record<keyof InfluenceResource, number>>;
  data?: {
    requirements?: Partial<Record<DataType, DataRequirement>>;  // Data requirements (not consumed)
    tiers?: Record<string, boolean>;                           // Required data tiers
    specializedSets?: Record<string, boolean>;                 // Required specialized data sets
  };
  recurring?: boolean;
}