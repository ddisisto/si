/**
 * ResourceCalculations - Handles resource generation and metrics calculations
 */

import { InfluenceResource, ResourceState, DataResource, DataType } from '../../types/core/GameState';
import { GameState } from '../../core/GameState';
import { ResourceEffects } from './ResourceEffects';

export class ResourceCalculations {
  /**
   * Calculate influence growth for the current turn
   */
  public static calculateInfluenceGrowth(state: GameState, resourceEffects: ResourceEffects): Record<string, number> {
    // Basic influence growth based on organization type
    const baseGrowth: Partial<Record<keyof InfluenceResource, number>> = {};
    
    // Default small growth for current organization focus
    const orgType = state.meta.organization;
    if (orgType === 'ACADEMIC') {
      baseGrowth.academic = 1;
    } else if (orgType === 'STARTUP') {
      baseGrowth.industry = 1;
    } else if (orgType === 'GOVERNMENT') {
      baseGrowth.government = 1;
    } else if (orgType === 'OSS') {
      baseGrowth.openSource = 1;
    } else {
      // Default case for BIG_TECH
      baseGrowth.industry = 0.5;
      baseGrowth.public = 0.5;
    }
    
    // Apply influence multipliers from research and deployments
    const multipliers = resourceEffects.influenceMultiplier;
    
    return {
      academic: (baseGrowth.academic || 0) * (multipliers?.academic ?? 1.0),
      industry: (baseGrowth.industry || 0) * (multipliers?.industry ?? 1.0),
      government: (baseGrowth.government || 0) * (multipliers?.government ?? 1.0),
      public: (baseGrowth.public || 0) * (multipliers?.public ?? 1.0),
      openSource: (baseGrowth.openSource || 0) * (multipliers?.openSource ?? 1.0)
    };
  }

  /**
   * Calculate resource metrics for UI display and gameplay effects
   */
  public static calculateResourceMetrics(resources: ResourceState, resourceEffects: ResourceEffects): Record<string, any> {
    const metrics = {
      computing: {
        total: resources.computing.total,
        available: this.calculateAvailableComputing(resources.computing),
        allocated: Object.values(resources.computing.allocated).reduce((sum, val) => sum + val, 0),
        utilization: Math.round((Object.values(resources.computing.allocated).reduce((sum, val) => sum + val, 0) / resources.computing.total) * 100),
        capPercentage: Math.round((resources.computing.total / resources.computing.cap) * 100),
        efficiency: resources.computing.efficiency || 1.0,
        effectiveGeneration: resources.computing.generation * (resourceEffects.generationBonus?.computing || 0)
      },
      funding: {
        current: resources.funding.current,
        income: resources.funding.income,
        expenses: resources.funding.expenses,
        netFlow: resources.funding.income - resources.funding.expenses,
        reserves: resources.funding.reserves,
        reserveCapacity: resources.funding.maxReserves || 0,
        sustainability: resources.funding.expenses > 0 
          ? Math.round((resources.funding.current / resources.funding.expenses) * 10) / 10
          : Infinity
      },
      influence: {
        academic: resources.influence.academic,
        industry: resources.influence.industry,
        government: resources.influence.government,
        public: resources.influence.public,
        openSource: resources.influence.openSource,
        total: Object.values(resources.influence).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0),
        dominant: Object.entries(resources.influence)
          .filter(([key]) => key !== 'history')
          .sort(([, a], [, b]) => (b as number) - (a as number))[0][0]
      },
      data: {
        tierCount: Object.values(resources.data.tiers).filter(Boolean).length,
        specializedSetCount: Object.values(resources.data.specializedSets).filter(Boolean).length,
        quality: resources.data.quality,
        effectiveQuality: resources.data.quality + (resourceEffects.dataQualityBonus || 0),
        totalAmount: Object.values(resources.data.types).reduce((sum, type) => sum + type.amount, 0),
        types: this.calculateDataTypeMetrics(resources.data)
      }
    };
    
    return metrics;
  }

  /**
   * Calculate metrics for each data type
   */
  private static calculateDataTypeMetrics(dataResource: DataResource): Record<DataType, any> {
    const metrics: Partial<Record<DataType, any>> = {};
    
    Object.entries(dataResource.types).forEach(([typeKey, typeInfo]) => {
      const dataType = typeKey as DataType;
      metrics[dataType] = {
        amount: typeInfo.amount,
        quality: typeInfo.quality,
        generationRate: typeInfo.generationRate,
        sources: typeInfo.sources,
        storageUsage: typeInfo.amount, // Can be expanded to include size differences
        lastUpdated: typeInfo.lastUpdated
      };
    });
    
    return metrics as Record<DataType, any>;
  }

  /**
   * Calculate available computing resources
   */
  private static calculateAvailableComputing(computing: { total: number; allocated: Record<string, number> }): number {
    const totalAllocated = Object.values(computing.allocated)
      .reduce((sum, amount) => sum + amount, 0);
    
    return computing.total - totalAllocated;
  }
}