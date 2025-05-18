/**
 * DataManager - Handles data resource management
 */

import GameStateManager from '../../core/GameStateManager';
import EventBus from '../../core/EventBus';
import { DataType } from '../../types/core/GameState';

export class DataManager {
  private stateManager: GameStateManager;
  private eventBus: EventBus;

  constructor(stateManager: GameStateManager, eventBus: EventBus) {
    this.stateManager = stateManager;
    this.eventBus = eventBus;
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
   * Add data of a specific type (persistent asset model)
   */
  public addDataType(type: DataType, amount: number, source: string, quality?: number): boolean {
    const state = this.stateManager.getState();
    const turn = state.meta.turn;
    const currentData = state.resources.data;
    
    // No capacity check needed - acquisition is the constraint
    
    // Calculate new quality (weighted average if quality provided)
    const currentTypeData = currentData.types[type];
    let newQuality = currentTypeData.quality;
    
    if (quality !== undefined && currentTypeData.amount > 0) {
      // Weighted average of existing and new quality
      newQuality = (currentTypeData.amount * currentTypeData.quality + amount * quality) / 
                   (currentTypeData.amount + amount);
    } else if (quality !== undefined) {
      newQuality = quality;
    }
    
    // Quality refresh - new high-quality data improves overall quality
    if (quality && quality > currentTypeData.quality) {
      // Boost quality more aggressively if new data is significantly better
      const qualityBoost = (quality - currentTypeData.quality) * 0.5;
      newQuality = Math.min(1.0, newQuality + qualityBoost);
    }
    
    // Add the source if it's not already there
    const updatedSources = currentTypeData.sources.includes(source) 
      ? currentTypeData.sources 
      : [...currentTypeData.sources, source];
    
    // Dispatch action to update data type
    this.stateManager.dispatch({
      type: 'UPDATE_DATA_TYPE',
      payload: {
        dataType: type,
        amount: currentTypeData.amount + amount,
        quality: newQuality,
        sources: updatedSources,
        lastUpdated: turn
      }
    });
    
    // Add to acquisition history
    const acquisition = {
      turn,
      dataType: type,
      category: 'type',
      name: type,
      source,
      amount,
      quality: quality || newQuality,
      timestamp: Date.now()
    };
    
    const currentHistory = currentData.acquisitionHistory || [];
    this.stateManager.dispatch({
      type: 'UPDATE_RESOURCE',
      payload: {
        resourceType: 'data',
        field: 'acquisitionHistory',
        amount: [...currentHistory.slice(-9), acquisition]
      }
    });
    
    // Emit event for UI updates
    this.eventBus.emit('data:added', {
      type,
      amount,
      source,
      quality: newQuality,
      turn
    });
    
    return true;
  }

  /**
   * Set data generation rate for a specific type
   */
  public setDataGenerationRate(type: DataType, rate: number, source: string): void {
    const state = this.stateManager.getState();
    const turn = state.meta.turn;
    const currentTypeData = state.resources.data.types[type];
    
    // Update the generation rate
    this.stateManager.dispatch({
      type: 'UPDATE_DATA_TYPE',
      payload: {
        dataType: type,
        generationRate: rate,
        sources: currentTypeData.sources.includes(source) 
          ? currentTypeData.sources 
          : [...currentTypeData.sources, source],
        lastUpdated: turn
      }
    });
    
    // Emit event for UI updates
    this.eventBus.emit('data:generation:updated', {
      type,
      rate,
      source,
      turn
    });
  }

  /**
   * Check if data requirements are met (persistent asset model)
   */
  public checkDataAccess(type: DataType, requirement: { minAmount: number; minQuality: number }): boolean {
    const state = this.stateManager.getState();
    const typeData = state.resources.data.types[type];
    
    if (!typeData) {
      return false;
    }
    
    return typeData.amount >= requirement.minAmount && 
           typeData.quality >= requirement.minQuality;
  }

  /**
   * Mark data as being used by a system
   */
  public markDataInUse(type: DataType, userId: string): void {
    const state = this.stateManager.getState();
    const currentTypeData = state.resources.data.types[type];
    
    if (!currentTypeData.inUse) {
      currentTypeData.inUse = [];
    }
    
    if (!currentTypeData.inUse.includes(userId)) {
      this.stateManager.dispatch({
        type: 'UPDATE_DATA_TYPE',
        payload: {
          dataType: type,
          inUse: [...currentTypeData.inUse, userId]
        }
      });
      
      this.eventBus.emit('data:access:started', {
        type,
        userId,
        turn: state.meta.turn
      });
    }
  }

  /**
   * Release data usage by a system
   */
  public releaseDataUsage(type: DataType, userId: string): void {
    const state = this.stateManager.getState();
    const currentTypeData = state.resources.data.types[type];
    
    if (currentTypeData.inUse) {
      const newInUse = currentTypeData.inUse.filter(id => id !== userId);
      
      this.stateManager.dispatch({
        type: 'UPDATE_DATA_TYPE',
        payload: {
          dataType: type,
          inUse: newInUse
        }
      });
      
      this.eventBus.emit('data:access:ended', {
        type,
        userId,
        turn: state.meta.turn
      });
    }
  }
}