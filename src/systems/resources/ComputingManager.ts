/**
 * ComputingManager - Handles computing resource allocation and management
 */

import GameStateManager from '../../core/GameStateManager';
import EventBus from '../../core/EventBus';
import { ComputingResource } from '../../types/core/GameState';

export class ComputingManager {
  private stateManager: GameStateManager;
  private eventBus: EventBus;

  constructor(stateManager: GameStateManager, eventBus: EventBus) {
    this.stateManager = stateManager;
    this.eventBus = eventBus;
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
  public handleAllocation(data: any): void {
    if (data.resource === 'computing') {
      this.allocateComputing(data.target, data.amount);
    }
  }

  /**
   * Handle resource deallocation events
   */
  public handleDeallocation(data: any): void {
    if (data.resource === 'computing') {
      this.deallocateComputing(data.target, data.amount);
    }
  }
}