/**
 * ResourceSystem - Manages game resources
 * 
 * Implements the resource system design from resource_system_design.md
 */

import { BaseSystem } from '../core/System';
// We need GameAction for method signatures, but not using it directly
import GameStateManager from '../core/GameStateManager';
import EventBus from '../core/EventBus';
import { ResourceState, ComputingResource } from '../types/core/GameState';

/**
 * ResourceSystem handles all resource-related gameplay mechanics
 */
class ResourceSystem extends BaseSystem {
  private stateManager: GameStateManager;
  private eventBus: EventBus;
  
  constructor(stateManager: GameStateManager, eventBus: EventBus) {
    super('ResourceSystem');
    this.stateManager = stateManager;
    this.eventBus = eventBus;
  }
  
  public initialize(): void {
    // Subscribe to relevant events
    this.eventBus.subscribe('turn:start', this.onTurnStart.bind(this));
    this.eventBus.subscribe('resource:allocate', this.handleResourceAllocation.bind(this));
    
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
    this.generateResources();
  }
  
  /**
   * Generate resources at the start of each turn
   */
  private generateResources(): void {
    const state = this.stateManager.getState();
    const resources = state.resources;
    
    // Calculate new computing (direct generation for now)
    const newComputing = Math.min(
      resources.computing.total + resources.computing.generation,
      resources.computing.cap
    );
    
    // Calculate new funding (income - expenses)
    const newFunding = resources.funding.current + 
      resources.funding.income - resources.funding.expenses;
    
    // Dispatch resource updates
    this.stateManager.dispatch({
      type: 'UPDATE_RESOURCE',
      payload: {
        resourceType: 'computing',
        field: 'total',
        amount: newComputing
      }
    });
    
    this.stateManager.dispatch({
      type: 'UPDATE_RESOURCE',
      payload: {
        resourceType: 'funding',
        field: 'current',
        amount: newFunding
      }
    });
    
    // Emit event for UI updates
    this.eventBus.emit('resources:updated', { resources: this.stateManager.getState().resources });
  }
  
  /**
   * Allocate computing resources to an activity
   */
  public allocateComputing(target: string, amount: number): boolean {
    const state = this.stateManager.getState();
    const computing = state.resources.computing;
    
    // Check if we have enough available computing
    const available = this.getAvailableComputing(computing);
    
    if (amount <= 0 || amount > available) {
      console.warn(`Cannot allocate ${amount} computing to ${target} (available: ${available})`);
      return false;
    }
    
    // Dispatch action to allocate computing
    this.stateManager.dispatch({
      type: 'ALLOCATE_COMPUTING',
      payload: {
        target,
        amount
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
   * Handle resource allocation events
   */
  private handleResourceAllocation(data: any): void {
    if (data.resource === 'computing') {
      this.allocateComputing(data.target, data.amount);
    }
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
  public canAfford(costs: Record<string, number>): boolean {
    const state = this.stateManager.getState();
    const resources = state.resources;
    
    // Check each resource type
    if (costs.computing && this.getAvailableComputing(resources.computing) < costs.computing) {
      return false;
    }
    
    if (costs.funding && resources.funding.current < costs.funding) {
      return false;
    }
    
    // Add checks for other resource types as needed
    
    return true;
  }
  
  /**
   * Spend resources (for one-time costs)
   */
  public spendResources(costs: Record<string, number>): boolean {
    if (!this.canAfford(costs)) {
      return false;
    }
    
    const state = this.stateManager.getState();
    
    // Handle funding costs
    if (costs.funding) {
      const newFunding = state.resources.funding.current - costs.funding;
      
      this.stateManager.dispatch({
        type: 'UPDATE_RESOURCE',
        payload: {
          resourceType: 'funding',
          field: 'current',
          amount: newFunding
        }
      });
    }
    
    // Handle other resource types as needed
    
    // Emit event for UI updates
    this.eventBus.emit('resources:spent', { costs });
    
    return true;
  }
  
  /**
   * Get the current resource state
   */
  public getResourceState(): ResourceState {
    return this.stateManager.getState().resources;
  }
}

export default ResourceSystem;