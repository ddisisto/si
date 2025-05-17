/**
 * ResourceCost - Interface for resource costs in game mechanics
 */

import { InfluenceResource } from '../core/GameState';

/**
 * Interface for resource costs used across various game systems
 */
export interface ResourceCost {
  computing?: number;
  funding?: number;
  influence?: Partial<Record<keyof InfluenceResource, number>>;
  data?: {
    tiers?: Record<string, boolean>;
    specializedSets?: Record<string, boolean>;
  };
  recurring?: boolean;
}