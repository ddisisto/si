/**
 * ResourceOperations - Handles resource spending and affordability checks
 */

import GameStateManager from '../../core/GameStateManager';
import EventBus from '../../core/EventBus';
import { ResourceCost } from '../../types/systems/ResourceCost';
import { ComputingResource, InfluenceResource, DataType } from '../../types/core/GameState';

export class ResourceOperations {
  private stateManager: GameStateManager;
  private eventBus: EventBus;

  constructor(stateManager: GameStateManager, eventBus: EventBus) {
    this.stateManager = stateManager;
    this.eventBus = eventBus;
  }

  /**
   * Get available (unallocated) computing
   */
  private getAvailableComputing(computing: ComputingResource): number {
    const totalAllocated = Object.values(computing.allocated)
      .reduce((sum, amount) => sum + amount, 0);
    
    return computing.total - totalAllocated;
  }

  /**
   * Check if the player can afford a resource cost
   */
  public canAfford(costs: ResourceCost): boolean {
    const state = this.stateManager.getState();
    const resources = state.resources;
    
    // Check computing costs
    if (costs.computing && this.getAvailableComputing(resources.computing) < costs.computing) {
      return false;
    }
    
    // Check funding costs
    if (costs.funding && resources.funding.current < costs.funding) {
      return false;
    }
    
    // Check influence costs
    if (costs.influence) {
      for (const [key, value] of Object.entries(costs.influence)) {
        const typedKey = key as keyof InfluenceResource;
        if (typedKey in resources.influence && 
           (resources.influence[typedKey] as number) < value) {
          return false;
        }
      }
    }
    
    // Check data requirements (persistent model - not consumed)
    if (costs.data) {
      // Check data type requirements (amount and quality)
      if (costs.data.requirements) {
        for (const [typeKey, requirement] of Object.entries(costs.data.requirements)) {
          const dataType = typeKey as DataType;
          const typeData = resources.data.types[dataType];
          
          if (!typeData || 
              typeData.amount < requirement.minAmount || 
              typeData.quality < requirement.minQuality) {
            return false;
          }
        }
      }
      
      // Check tier access
      if (costs.data.tiers) {
        for (const [key, value] of Object.entries(costs.data.tiers)) {
          if (value && !resources.data.tiers[key]) {
            return false;
          }
        }
      }
      
      // Check specialized data sets
      if (costs.data.specializedSets) {
        for (const [key, value] of Object.entries(costs.data.specializedSets)) {
          if (value && !resources.data.specializedSets[key]) {
            return false;
          }
        }
      }
    }
    
    return true;
  }

  /**
   * Spend resources (for one-time costs or recurring expenses)
   */
  public spendResources(costs: ResourceCost, reason: string = 'general'): boolean {
    if (!this.canAfford(costs)) {
      this.eventBus.emit('resource:spend:failed', {
        costs,
        reason,
        message: 'Insufficient resources'
      });
      return false;
    }
    
    const state = this.stateManager.getState();
    const turn = state.meta.turn;
    
    // Dispatch resource spending action
    this.stateManager.dispatch({
      type: 'SPEND_RESOURCES',
      payload: {
        costs,
        reason,
        turn,
        recurring: costs.recurring || false
      }
    });
    
    // Emit event for UI updates
    this.eventBus.emit('resources:spent', { 
      costs,
      reason,
      turn,
      recurring: costs.recurring || false
    });
    
    return true;
  }

  /**
   * Handle resource spending events
   */
  public handleResourceSpending(data: any): void {
    this.spendResources(data.costs, data.reason);
  }
}