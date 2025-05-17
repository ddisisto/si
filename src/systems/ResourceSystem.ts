/**
 * ResourceSystem - Manages game resources
 * 
 * Implements the resource system design from resource_system_design.md
 */

import { BaseSystem } from '../core/System';
// We need GameAction for method signatures, but not using it directly
import GameStateManager from '../core/GameStateManager';
import EventBus from '../core/EventBus';
import { 
  ResourceState, 
  ComputingResource, 
  InfluenceResource,
  InfluenceFields
} from '../types/core/GameState';

/**
 * Interface for resource costs
 */
interface ResourceCost {
  computing?: number;
  funding?: number;
  influence?: Partial<Record<keyof InfluenceResource, number>>;
  data?: {
    tiers?: Record<string, boolean>;
    specializedSets?: Record<string, boolean>;
  };
  recurring?: boolean;
}

/**
 * Interface for resource effects
 */
interface ResourceEffects {
  computingEfficiency?: number;
  fundingMultiplier?: number;
  influenceMultiplier?: InfluenceFields;
  dataQualityBonus?: number;
  generationBonus?: {
    computing?: number;
    funding?: number;
  };
}

/**
 * ResourceSystem handles all resource-related gameplay mechanics
 */
class ResourceSystem extends BaseSystem {
  private stateManager: GameStateManager;
  private eventBus: EventBus;
  private resourceEffects: ResourceEffects;
  
  constructor(stateManager: GameStateManager, eventBus: EventBus) {
    super('ResourceSystem');
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    this.resourceEffects = this.initializeResourceEffects();
  }
  
  /**
   * Initialize resource effects with default values
   */
  private initializeResourceEffects(): ResourceEffects {
    return {
      computingEfficiency: 1.0,
      fundingMultiplier: 1.0,
      influenceMultiplier: {
        academic: 1.0,
        industry: 1.0,
        government: 1.0,
        public: 1.0,
        openSource: 1.0
      } as InfluenceFields,
      dataQualityBonus: 0,
      generationBonus: {
        computing: 0,
        funding: 0
      }
    };
  }
  
  public initialize(): void {
    // Subscribe to relevant events
    this.eventBus.subscribe('turn:start', this.onTurnStart.bind(this));
    this.eventBus.subscribe('turn:ending', this.onTurnEnding.bind(this));
    this.eventBus.subscribe('resource:allocate', this.handleResourceAllocation.bind(this));
    this.eventBus.subscribe('resource:deallocate', this.handleResourceDeallocation.bind(this));
    this.eventBus.subscribe('resource:spend', this.handleResourceSpending.bind(this));
    this.eventBus.subscribe('deployment:active', this.updateResourceEffects.bind(this));
    this.eventBus.subscribe('research:completed', this.updateResourceEffects.bind(this));
    
    console.log('Resource System initialized');
    this.setInitialized();
  }
  
  public update(_deltaTime: number): void {
    // Most resource logic is event-driven, but we could
    // add ambient effects or animations here later
  }
  
  /**
   * Handle turn start events
   */
  private onTurnStart(data: any): void {
    console.log(`Resource System: Processing turn ${data.turn} start`);
    this.generateResources(data.turn);
  }
  
  /**
   * Handle turn ending events
   */
  private onTurnEnding(data: any): void {
    // Update resource effects for next turn
    this.updateResourceEffects(data);
  }
  
  /**
   * Calculate influence growth for the current turn
   * This will be enhanced later with more factors
   */
  private calculateInfluenceGrowth(state: any): Record<string, number> {
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
    const multipliers = this.resourceEffects.influenceMultiplier;
    
    return {
      academic: (baseGrowth.academic || 0) * (multipliers?.academic ?? 1.0),
      industry: (baseGrowth.industry || 0) * (multipliers?.industry ?? 1.0),
      government: (baseGrowth.government || 0) * (multipliers?.government ?? 1.0),
      public: (baseGrowth.public || 0) * (multipliers?.public ?? 1.0),
      openSource: (baseGrowth.openSource || 0) * (multipliers?.openSource ?? 1.0)
    };
  }
  
  /**
   * Generate resources at the start of each turn
   */
  private generateResources(turn: number): void {
    const state = this.stateManager.getState();
    const resources = state.resources;
    
    // Calculate influence growth
    const influenceGrowth = this.calculateInfluenceGrowth(state);
    
    // Dispatch generate resources action
    this.stateManager.dispatch({
      type: 'GENERATE_RESOURCES',
      payload: {
        turn,
        influenceGrowth
      }
    });
    
    // Emit event for UI updates
    this.eventBus.emit('resources:updated', { 
      resources: this.stateManager.getState().resources,
      previousResources: resources
    });
  }
  
  /**
   * Allocate computing resources to an activity
   */
  public allocateComputing(target: string, amount: number): boolean {
    const state = this.stateManager.getState();
    const computing = state.resources.computing;
    const turn = state.meta.turn;
    
    // Check if we have enough available computing
    const available = this.getAvailableComputing(computing);
    
    if (amount <= 0 || amount > available) {
      console.warn(`Cannot allocate ${amount} computing to ${target} (available: ${available})`);
      this.eventBus.emit('resource:allocation:failed', {
        resource: 'computing',
        target,
        amount,
        available,
        reason: amount <= 0 ? 'Invalid amount' : 'Insufficient resources'
      });
      return false;
    }
    
    // Dispatch action to allocate computing
    this.stateManager.dispatch({
      type: 'ALLOCATE_COMPUTING',
      payload: {
        target,
        amount,
        turn
      }
    });
    
    // Emit event for UI updates
    this.eventBus.emit('computing:allocated', { 
      target, 
      amount,
      remaining: this.getAvailableComputing(this.stateManager.getState().resources.computing)
    });
    
    return true;
  }
  
  /**
   * Deallocate computing resources from an activity
   */
  public deallocateComputing(target: string, amount: number): boolean {
    const state = this.stateManager.getState();
    const computing = state.resources.computing;
    const turn = state.meta.turn;
    
    // Check if there is computing allocated to this target
    const allocated = computing.allocated[target] || 0;
    
    if (amount <= 0 || amount > allocated) {
      console.warn(`Cannot deallocate ${amount} computing from ${target} (allocated: ${allocated})`);
      this.eventBus.emit('resource:deallocation:failed', {
        resource: 'computing',
        target,
        amount,
        allocated,
        reason: amount <= 0 ? 'Invalid amount' : 'More than allocated'
      });
      return false;
    }
    
    // Dispatch action to deallocate computing
    this.stateManager.dispatch({
      type: 'DEALLOCATE_COMPUTING',
      payload: {
        target,
        amount,
        turn
      }
    });
    
    // Emit event for UI updates
    this.eventBus.emit('computing:deallocated', { 
      target, 
      amount,
      remaining: allocated - amount,
      available: this.getAvailableComputing(this.stateManager.getState().resources.computing)
    });
    
    return true;
  }
  
  /**
   * Handle resource allocation events
   */
  private handleResourceAllocation(data: any): void {
    if (data.resource === 'computing') {
      this.allocateComputing(data.target, data.amount);
    }
  }
  
  /**
   * Handle resource deallocation events
   */
  private handleResourceDeallocation(data: any): void {
    if (data.resource === 'computing') {
      this.deallocateComputing(data.target, data.amount);
    }
  }
  
  /**
   * Get available (unallocated) computing
   */
  public getAvailableComputing(computing: ComputingResource): number {
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
    
    // Check data costs - we just verify that the data is available
    if (costs.data) {
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
  private handleResourceSpending(data: any): void {
    this.spendResources(data.costs, data.reason);
  }
  
  /**
   * Update resource effects based on deployments, research, etc.
   */
  private updateResourceEffects(_data: any): void {
    const state = this.stateManager.getState();
    
    // Reset effects to base values
    const newEffects = this.initializeResourceEffects();
    
    // Apply effects from active deployments
    for (const [, deployment] of Object.entries(state.deployments.active)) {
      const deploymentInfo = deployment as any;
      
      if (deploymentInfo.effects) {
        // Apply computing efficiency
        if (deploymentInfo.effects.computingEfficiency) {
          if (newEffects.computingEfficiency) {
            newEffects.computingEfficiency *= (1 + deploymentInfo.effects.computingEfficiency);
          }
        }
        
        // Apply funding multiplier
        if (deploymentInfo.effects.fundingMultiplier) {
          if (newEffects.fundingMultiplier) {
            newEffects.fundingMultiplier *= (1 + deploymentInfo.effects.fundingMultiplier);
          }
        }
        
        // Apply influence multipliers
        if (deploymentInfo.effects.influenceGrowth) {
          for (const [key, value] of Object.entries(deploymentInfo.effects.influenceGrowth)) {
            // Check if this is a valid influence field
            if (key !== 'history' && newEffects.influenceMultiplier) {
              const typedKey = key as keyof InfluenceFields;
              newEffects.influenceMultiplier[typedKey] *= (1 + (value as number));
            }
          }
        }
        
        // Apply data quality bonus
        if (deploymentInfo.effects.dataQualityBonus) {
          newEffects.dataQualityBonus += deploymentInfo.effects.dataQualityBonus;
        }
        
        // Apply generation bonuses
        if (deploymentInfo.effects.generationBonus) {
          if (deploymentInfo.effects.generationBonus.computing) {
            if (newEffects.generationBonus) {
              newEffects.generationBonus.computing += deploymentInfo.effects.generationBonus.computing;
            }
          }
          if (deploymentInfo.effects.generationBonus.funding) {
            if (newEffects.generationBonus) {
              newEffects.generationBonus.funding += deploymentInfo.effects.generationBonus.funding;
            }
          }
        }
      }
    }
    
    // Apply effects from completed research
    // This will be expanded when the research system is more complete
    
    // Store updated effects
    this.resourceEffects = newEffects;
    
    // Update computing efficiency
    this.stateManager.dispatch({
      type: 'UPDATE_RESOURCE',
      payload: {
        resourceType: 'computing',
        field: 'efficiency',
        amount: newEffects.computingEfficiency
      }
    });
    
    // Emit event about updated resource effects
    this.eventBus.emit('resource:effects:updated', {
      effects: newEffects
    });
  }
  
  /**
   * Get the current resource state
   */
  public getResourceState(): ResourceState {
    return this.stateManager.getState().resources;
  }
  
  /**
   * Get the current resource effects
   */
  public getResourceEffects(): ResourceEffects {
    return { ...this.resourceEffects };
  }
  
  /**
   * Add a data tier or specialized set
   */
  public addDataAccess(type: 'tier' | 'specializedSet', key: string): boolean {
    const state = this.stateManager.getState();
    const turn = state.meta.turn;
    
    // Check if already exists
    if (type === 'tier' && state.resources.data.tiers[key]) {
      return false;
    }
    
    if (type === 'specializedSet' && state.resources.data.specializedSets[key]) {
      return false;
    }
    
    // Dispatch action to add data access
    this.stateManager.dispatch({
      type: 'UPDATE_RESOURCE',
      payload: {
        resourceType: 'data',
        field: type === 'tier' ? 'tiers' : 'specializedSets',
        key,
        value: true
      }
    });
    
    // Track acquisition in history
    const acquisitionData = {
      turn,
      type: type === 'tier' ? 'tier' : 'specialized',
      name: key,
      source: 'acquisition', // This can be more specific later
      quality: 1.0, // Default quality for now
      timestamp: Date.now()
    };
    
    // Add to acquisition history
    const currentHistory = state.resources.data.acquisitionHistory || [];
    
    this.stateManager.dispatch({
      type: 'UPDATE_RESOURCE',
      payload: {
        resourceType: 'data',
        field: 'acquisitionHistory',
        amount: [...currentHistory.slice(-9), acquisitionData]
      }
    });
    
    // Emit event for UI updates
    this.eventBus.emit('data:accessed', {
      type,
      key,
      turn
    });
    
    return true;
  }
  
  /**
   * Calculate resource metrics for UI display and gameplay effects
   */
  public calculateResourceMetrics(): Record<string, any> {
    const state = this.stateManager.getState();
    const resources = state.resources;
    
    const metrics = {
      computing: {
        total: resources.computing.total,
        available: this.getAvailableComputing(resources.computing),
        allocated: Object.values(resources.computing.allocated).reduce((sum, val) => sum + val, 0),
        utilization: Math.round((Object.values(resources.computing.allocated).reduce((sum, val) => sum + val, 0) / resources.computing.total) * 100),
        capPercentage: Math.round((resources.computing.total / resources.computing.cap) * 100),
        efficiency: resources.computing.efficiency || 1.0,
        effectiveGeneration: resources.computing.generation * (this.resourceEffects.generationBonus?.computing || 0)
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
        effectiveQuality: resources.data.quality + (this.resourceEffects.dataQualityBonus || 0)
      }
    };
    
    return metrics;
  }
}

export default ResourceSystem;