/**
 * GameState - Core state management for SuperInt++
 * 
 * Implements the immutable state tree design from state_management_design.md
 */

import { 
  GameMetaState, 
  ResourceState, 
  ResearchState, 
  DeploymentState, 
  EventState, 
  WorldState, 
  CompetitorState, 
  SettingsState,
  DataType,
  DataTypeInfo
} from '../types/core/GameState';

/**
 * Complete game state structure
 * Single source of truth for all game data
 */
export interface GameState {
  readonly meta: GameMetaState;
  readonly resources: ResourceState;
  readonly research: ResearchState;
  readonly deployments: DeploymentState;
  readonly events: EventState;
  readonly world: WorldState;
  readonly competitors: CompetitorState;
  readonly settings: SettingsState;
}

/**
 * Create the initial game state with default values
 */
export function createInitialState(): GameState {
  return {
    meta: createInitialMetaState(),
    resources: createInitialResourceState(),
    research: createInitialResearchState(),
    deployments: createInitialDeploymentState(),
    events: createInitialEventState(),
    world: createInitialWorldState(),
    competitors: createInitialCompetitorState(),
    settings: createInitialSettingsState()
  };
}

/**
 * Create initial meta state (game-wide information)
 */
function createInitialMetaState(): GameMetaState {
  return {
    turn: 1,
    phase: 'START',
    gameTime: {
      year: 2025,
      quarter: 1,
      month: 1,
      day: 1,
      timeScale: 90, // Start with quarterly turns (approximately 90 days)
      compressionFactor: 1.0, // No compression at start
      daysPassed: 0
    },
    organization: 'ACADEMIC',
    startDate: new Date(),
    lastSaved: null,
    turnHistory: []
  };
}

/**
 * Create initial resource state
 */
function createInitialResourceState(): ResourceState {
  return {
    computing: {
      total: 50,
      allocated: {},
      cap: 100,
      generation: 5,
      efficiency: 1.0,
      allocationHistory: [],
      generationHistory: []
    },
    data: {
      types: createInitialDataTypes(),
      tiers: { 'public': true },
      specializedSets: {},
      quality: 1.0,
      acquisitionHistory: []
    },
    influence: {
      academic: 20,
      industry: 5,
      government: 5,
      public: 10,
      openSource: 15,
      history: []
    },
    funding: {
      current: 1000,
      income: 100,
      expenses: 80,
      reserves: 0,
      maxReserves: 5000,
      history: [],
      spendingHistory: []
    }
  };
}

/**
 * Create initial data types structure
 */
function createInitialDataTypes(): Record<DataType, DataTypeInfo> {
  const initialTypes: Record<DataType, DataTypeInfo> = {} as Record<DataType, DataTypeInfo>;
  
  // Initialize all data types with base values
  Object.values(DataType).forEach(type => {
    initialTypes[type] = {
      amount: 0,
      quality: 0.5,
      decayRate: getDefaultDecayRate(type),
      sources: [],
      generationRate: 0,
      inUse: [],
      lastUpdated: 0
    };
  });
  
  // Academic organizations start with some text data
  initialTypes[DataType.TEXT] = {
    amount: 100,
    quality: 0.7,
    decayRate: 0.01,  // Slow decay for text data
    sources: ['academic_library', 'public_web'],
    generationRate: 10,
    inUse: [],
    lastUpdated: 0
  };
  
  // Everyone starts with some public image data
  initialTypes[DataType.IMAGE] = {
    amount: 50,
    quality: 0.5,
    decayRate: 0.02,  // Medium decay for image data
    sources: ['public_web'],
    generationRate: 5,
    inUse: [],
    lastUpdated: 0
  };
  
  return initialTypes;
}

/**
 * Get default decay rate for a data type
 */
function getDefaultDecayRate(type: DataType): number {
  const decayRates: Record<DataType, number> = {
    [DataType.TEXT]: 0.01,       // Text data decays slowly
    [DataType.IMAGE]: 0.02,      // Images decay at medium rate
    [DataType.VIDEO]: 0.03,      // Video data decays faster
    [DataType.SYNTHETIC]: 0.02,  // Synthetic data has medium decay
    [DataType.BEHAVIORAL]: 0.04, // Behavioral data becomes stale quickly
    [DataType.SCIENTIFIC]: 0.015 // Scientific data has slower decay
  };
  
  return decayRates[type] || 0.02; // Default to medium decay
}

/**
 * Create initial research state
 */
function createInitialResearchState(): ResearchState {
  return {
    nodes: {}, // Will be populated from research data
    activeResearch: [],
    completed: [],
    unlocked: []
  };
}

/**
 * Create initial deployment state
 */
function createInitialDeploymentState(): DeploymentState {
  return {
    slots: 1,
    active: {},
    history: []
  };
}

/**
 * Create initial event state
 */
function createInitialEventState(): EventState {
  return {
    current: [],
    history: [],
    triggered: {}
  };
}

/**
 * Create initial world state
 */
function createInitialWorldState(): WorldState {
  return {
    regions: {},
    globalAwareness: 0,
    globalAlignment: 0,
    globalRegulation: 0
  };
}

/**
 * Create initial competitor state
 */
function createInitialCompetitorState(): CompetitorState {
  return {
    organizations: {},
    playerRanking: 1
  };
}

/**
 * Create initial settings state
 */
function createInitialSettingsState(): SettingsState {
  return {
    difficulty: 'NORMAL',
    tutorialEnabled: true,
    autoSave: true,
    musicVolume: 0.7,
    soundVolume: 0.7
  };
}