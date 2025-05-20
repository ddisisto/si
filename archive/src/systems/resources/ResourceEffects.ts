/**
 * ResourceEffects - Manages resource effects from deployments and research
 */

import GameStateManager from '../../core/GameStateManager';
import EventBus from '../../core/EventBus';
import { InfluenceFields } from '../../types/core/GameState';

/**
 * Interface for resource effects
 */
export interface ResourceEffects {
  computingEfficiency?: number;
  fundingMultiplier?: number;
  influenceMultiplier?: InfluenceFields;
  dataQualityBonus?: number;
  generationBonus?: {
    computing?: number;
    funding?: number;
  };
}

export class ResourceEffectsManager {
  private stateManager: GameStateManager;
  private eventBus: EventBus;
  private resourceEffects: ResourceEffects;

  constructor(stateManager: GameStateManager, eventBus: EventBus) {
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

  /**
   * Update resource effects based on deployments, research, etc.
   */
  public updateResourceEffects(_data: any): void {
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
   * Get the current resource effects
   */
  public getResourceEffects(): ResourceEffects {
    return { ...this.resourceEffects };
  }
}