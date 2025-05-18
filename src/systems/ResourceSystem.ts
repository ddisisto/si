/**
 * ResourceSystem - Manages game resources
 * 
 * Implements the resource system design from resource_system_design.md
 */

import { BaseSystem } from '../core/System';
import GameStateManager from '../core/GameStateManager';
import EventBus from '../core/EventBus';
import { ResourceState, DataType } from '../types/core/GameState';

// Import resource subsystem modules
import {
  ComputingManager,
  DataManager,
  ResourceCalculations,
  ResourceEffectsManager,
  ResourceOperations
} from './resources';

/**
 * ResourceSystem handles all resource-related gameplay mechanics
 */
class ResourceSystem extends BaseSystem {
  private stateManager: GameStateManager;
  private eventBus: EventBus;
  
  // Subsystem managers
  private computingManager: ComputingManager;
  private dataManager: DataManager;
  private effectsManager: ResourceEffectsManager;
  private operations: ResourceOperations;
  
  constructor(stateManager: GameStateManager, eventBus: EventBus) {
    super('ResourceSystem');
    this.stateManager = stateManager;
    this.eventBus = eventBus;
    
    // Initialize subsystem managers
    this.computingManager = new ComputingManager(stateManager, eventBus);
    this.dataManager = new DataManager(stateManager, eventBus);
    this.effectsManager = new ResourceEffectsManager(stateManager, eventBus);
    this.operations = new ResourceOperations(stateManager, eventBus);
  }
  
  public initialize(): void {
    // Subscribe to relevant events
    this.eventBus.subscribe('turn:start', this.onTurnStart.bind(this));
    this.eventBus.subscribe('turn:ending', this.onTurnEnding.bind(this));
    this.eventBus.subscribe('resource:allocate', this.computingManager.handleAllocation.bind(this.computingManager));
    this.eventBus.subscribe('resource:deallocate', this.computingManager.handleDeallocation.bind(this.computingManager));
    this.eventBus.subscribe('resource:spend', this.operations.handleResourceSpending.bind(this.operations));
    this.eventBus.subscribe('deployment:active', this.effectsManager.updateResourceEffects.bind(this.effectsManager));
    this.eventBus.subscribe('research:completed', this.effectsManager.updateResourceEffects.bind(this.effectsManager));
    
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
    this.effectsManager.updateResourceEffects(data);
  }
  
  /**
   * Generate resources at the start of each turn
   */
  private generateResources(turn: number): void {
    const state = this.stateManager.getState();
    const resources = state.resources;
    
    // Calculate influence growth
    const influenceGrowth = ResourceCalculations.calculateInfluenceGrowth(
      state, 
      this.effectsManager.getResourceEffects()
    );
    
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
   * Delegated methods to subsystems
   */
  
  // Computing manager methods
  public allocateComputing(target: string, amount: number): boolean {
    return this.computingManager.allocateComputing(target, amount);
  }
  
  public deallocateComputing(target: string, amount: number): boolean {
    return this.computingManager.deallocateComputing(target, amount);
  }
  
  public getAvailableComputing(): number {
    const resources = this.stateManager.getState().resources;
    return this.computingManager.getAvailableComputing(resources.computing);
  }
  
  // Data manager methods
  public addDataAccess(type: 'tier' | 'specializedSet', key: string): boolean {
    return this.dataManager.addDataAccess(type, key);
  }
  
  public addDataType(type: DataType, amount: number, source: string, quality?: number): boolean {
    return this.dataManager.addDataType(type, amount, source, quality);
  }
  
  public setDataGenerationRate(type: DataType, rate: number, source: string): void {
    this.dataManager.setDataGenerationRate(type, rate, source);
  }
  
  public checkDataAccess(type: DataType, requirement: { minAmount: number; minQuality: number }): boolean {
    return this.dataManager.checkDataAccess(type, requirement);
  }
  
  public markDataInUse(type: DataType, userId: string): void {
    this.dataManager.markDataInUse(type, userId);
  }
  
  public releaseDataUsage(type: DataType, userId: string): void {
    this.dataManager.releaseDataUsage(type, userId);
  }
  
  // Resource operations methods
  public canAfford(costs: any): boolean {
    return this.operations.canAfford(costs);
  }
  
  public spendResources(costs: any, reason: string = 'general'): boolean {
    return this.operations.spendResources(costs, reason);
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
  public getResourceEffects(): any {
    return this.effectsManager.getResourceEffects();
  }
  
  /**
   * Calculate resource metrics for UI display and gameplay effects
   */
  public calculateResourceMetrics(): Record<string, any> {
    const resources = this.stateManager.getState().resources;
    return ResourceCalculations.calculateResourceMetrics(
      resources,
      this.effectsManager.getResourceEffects()
    );
  }
}

export default ResourceSystem;