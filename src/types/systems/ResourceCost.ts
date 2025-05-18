/**
 * ResourceCost - Interface for resource costs in game mechanics
 */

import { InfluenceResource, DataType } from '../core/GameState';

/**
 * Interface for resource costs used across various game systems
 */
export interface ResourceCost {
  computing?: number;
  funding?: number;
  influence?: Partial<Record<keyof InfluenceResource, number>>;
  data?: {
    types?: Partial<Record<DataType, number>>;    // Required amounts of specific data types
    tiers?: Record<string, boolean>;             // Required data tiers
    specializedSets?: Record<string, boolean>;   // Required specialized data sets
    minimumQuality?: number;                     // Minimum quality threshold
  };
  recurring?: boolean;
}