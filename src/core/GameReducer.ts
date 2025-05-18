/**
 * GameReducer - Root reducer for handling all state updates
 * 
 * Combines individual reducers for each state slice
 */

import { GameState } from './GameState';
import { GameAction } from './GameStateManager';
import { 
  GameMetaState, 
  ResourceState, 
  ResearchState, 
  ResearchStatus,
  DeploymentState, 
  EventState, 
  WorldState, 
  CompetitorState, 
  SettingsState,
  DeploymentHistoryEntry,
  ResolvedEvent,
  DataType
} from '../types/core/GameState';

/**
 * Root reducer that delegates to sub-reducers for each state slice
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  return {
    meta: metaReducer(state.meta, action),
    resources: resourceReducer(state.resources, action),
    research: researchReducer(state.research, action),
    deployments: deploymentReducer(state.deployments, action),
    events: eventReducer(state.events, action),
    world: worldReducer(state.world, action),
    competitors: competitorReducer(state.competitors, action),
    settings: settingsReducer(state.settings, action)
  };
}

/**
 * Meta reducer for game-wide metadata
 */
function metaReducer(state: GameMetaState, action: GameAction): GameMetaState {
  switch (action.type) {
    case 'META_UPDATE':
      return {
        ...state,
        ...action.payload
      };
      
    case 'ADVANCE_TURN':
      return {
        ...state,
        turn: state.turn + 1
      };
      
    case 'SET_PHASE':
      return {
        ...state,
        phase: action.payload.phase
      };
      
    case 'UPDATE_GAME_TIME':
      return {
        ...state,
        gameTime: {
          ...state.gameTime,
          ...action.payload.gameTime
        }
      };
      
    case 'UPDATE_TIME_COMPRESSION':
      return {
        ...state,
        gameTime: {
          ...state.gameTime,
          compressionFactor: action.payload.compressionFactor,
          timeScale: action.payload.timeScale
        }
      };
      
    case 'ADD_TURN_HISTORY':
      return {
        ...state,
        turnHistory: [
          ...(state.turnHistory || []).slice(-9), // Keep last 10 entries
          action.payload.historyEntry
        ]
      };
      
    default:
      return state;
  }
}

/**
 * Resource reducer for managing player resources
 */
function resourceReducer(state: ResourceState, action: GameAction): ResourceState {
  switch (action.type) {
    case 'ALLOCATE_COMPUTING':
      // Allocate computing to a target activity
      const targetAllocation = (state.computing.allocated[action.payload.target] || 0) + action.payload.amount;
      
      return {
        ...state,
        computing: {
          ...state.computing,
          allocated: {
            ...state.computing.allocated,
            [action.payload.target]: targetAllocation
          },
          // Add to allocation history
          allocationHistory: [
            ...(state.computing.allocationHistory || []).slice(-9), // Keep last 10 entries
            {
              turn: action.payload.turn || 0,
              target: action.payload.target,
              amount: action.payload.amount,
              timestamp: Date.now()
            }
          ]
        }
      };
    
    case 'DEALLOCATE_COMPUTING':
      // Remove computing allocation from a target
      const allocations = { ...state.computing.allocated };
      const currentAllocation = allocations[action.payload.target] || 0;
      const newAllocation = Math.max(0, currentAllocation - action.payload.amount);
      
      // Update or remove the allocation
      if (newAllocation > 0) {
        allocations[action.payload.target] = newAllocation;
      } else {
        delete allocations[action.payload.target];
      }
      
      return {
        ...state,
        computing: {
          ...state.computing,
          allocated: allocations,
          // Add to allocation history
          allocationHistory: [
            ...(state.computing.allocationHistory || []).slice(-9),
            {
              turn: action.payload.turn || 0,
              target: action.payload.target,
              amount: -action.payload.amount, // Negative to show deallocation
              timestamp: Date.now()
            }
          ]
        }
      };
      
    case 'GENERATE_RESOURCES':
      // Generate resources at the start of turn
      
      // Compute new funding with income and expenses
      const newFunding = {
        ...state.funding,
        current: state.funding.current + state.funding.income - state.funding.expenses,
        // Keep history of funding changes
        history: [
          ...(state.funding.history || []).slice(-9),
          {
            turn: action.payload.turn,
            previous: state.funding.current,
            income: state.funding.income,
            expenses: state.funding.expenses,
            change: state.funding.income - state.funding.expenses,
            timestamp: Date.now()
          }
        ]
      };
      
      // Compute new computing total with generation up to the cap
      const newComputingTotal = Math.min(
        state.computing.total + state.computing.generation,
        state.computing.cap
      );
      
      // Generate influence based on deployments and actions
      // (for now just a small increase to each area)
      const influenceGrowth = {
        academic: Math.min(100, state.influence.academic + (action.payload.influenceGrowth?.academic || 0)),
        industry: Math.min(100, state.influence.industry + (action.payload.influenceGrowth?.industry || 0)),
        government: Math.min(100, state.influence.government + (action.payload.influenceGrowth?.government || 0)),
        public: Math.min(100, state.influence.public + (action.payload.influenceGrowth?.public || 0)),
        openSource: Math.min(100, state.influence.openSource + (action.payload.influenceGrowth?.openSource || 0))
      };
      
      // Generate data for each data type and apply quality decay
      const updatedDataTypes = { ...state.data.types };
      const MIN_QUALITY = 0.1; // Data never becomes completely unusable
      
      Object.values(DataType).forEach(type => {
        const currentTypeData = updatedDataTypes[type];
        if (currentTypeData) {
          // Apply quality decay (if decayRate is defined)
          const decayRate = currentTypeData.decayRate || 0.01; // Default decay rate
          const newQuality = Math.max(MIN_QUALITY, currentTypeData.quality - decayRate);
          
          // Apply generation (if any)
          const newAmount = currentTypeData.generationRate > 0 
            ? currentTypeData.amount + currentTypeData.generationRate 
            : currentTypeData.amount;
          
          updatedDataTypes[type] = {
            ...currentTypeData,
            amount: newAmount,
            quality: newQuality,
            lastUpdated: action.payload.turn
          };
        }
      });
      
      return {
        ...state,
        computing: {
          ...state.computing,
          total: newComputingTotal,
          // Keep history of generation
          generationHistory: [
            ...(state.computing.generationHistory || []).slice(-9),
            {
              turn: action.payload.turn,
              previous: state.computing.total,
              generated: state.computing.generation,
              newTotal: newComputingTotal,
              timestamp: Date.now()
            }
          ]
        },
        funding: newFunding,
        influence: {
          ...state.influence,
          ...influenceGrowth,
          // Keep history of influence changes
          history: [
            ...(state.influence.history || []).slice(-9),
            {
              turn: action.payload.turn,
              previous: {
                academic: state.influence.academic,
                industry: state.influence.industry,
                government: state.influence.government,
                public: state.influence.public,
                openSource: state.influence.openSource
              },
              changes: {
                academic: (action.payload.influenceGrowth?.academic || 0),
                industry: (action.payload.influenceGrowth?.industry || 0),
                government: (action.payload.influenceGrowth?.government || 0),
                public: (action.payload.influenceGrowth?.public || 0),
                openSource: (action.payload.influenceGrowth?.openSource || 0)
              },
              timestamp: Date.now()
            }
          ]
        },
        data: {
          ...state.data,
          types: updatedDataTypes
          // Removed capacity tracking as data is a persistent asset now
        }
      };
      
    case 'UPDATE_RESOURCE':
      // Generic resource update for specific fields
      const { resourceType, field, amount } = action.payload;
      
      if (resourceType === 'computing') {
        return {
          ...state,
          computing: {
            ...state.computing,
            [field]: amount
          }
        };
      } else if (resourceType === 'influence') {
        return {
          ...state,
          influence: {
            ...state.influence,
            [field]: amount
          }
        };
      } else if (resourceType === 'funding') {
        return {
          ...state,
          funding: {
            ...state.funding,
            [field]: amount
          }
        };
      } else if (resourceType === 'data') {
        if (field === 'tiers' || field === 'specializedSets') {
          const { key, value } = action.payload;
          return {
            ...state,
            data: {
              ...state.data,
              [field]: {
                ...(state.data[field as keyof typeof state.data] as Record<string, boolean>),
                [key]: value
              }
            }
          };
        } else {
          return {
            ...state,
            data: {
              ...state.data,
              [field]: amount
            }
          };
        }
      }
      
      return state;
      
    case 'UPDATE_DATA_TYPE':
      // Update a specific data type's information
      const { dataType, ...updates } = action.payload;
      
      return {
        ...state,
        data: {
          ...state.data,
          types: {
            ...state.data.types,
            [dataType as DataType]: {
              ...state.data.types[dataType as DataType],
              ...updates
            }
          }
        }
      };
    
    case 'SPEND_RESOURCES':
      // Handle spending multiple resource types at once
      const { costs, reason } = action.payload;
      let updatedState = { ...state };
      
      // Handle computing allocation separately
      if (costs.computing) {
        // Computing is allocated, not spent directly
        updatedState = resourceReducer(updatedState, {
          type: 'ALLOCATE_COMPUTING',
          payload: {
            target: reason || 'general',
            amount: costs.computing,
            turn: action.payload.turn
          }
        });
      }
      
      // Handle funding costs
      if (costs.funding) {
        updatedState = {
          ...updatedState,
          funding: {
            ...updatedState.funding,
            current: updatedState.funding.current - costs.funding,
            // Track spending in history
            expenses: updatedState.funding.expenses + (costs.recurring ? costs.funding : 0),
            spendingHistory: [
              ...(updatedState.funding.spendingHistory || []).slice(-9),
              {
                turn: action.payload.turn,
                amount: costs.funding,
                reason: reason || 'general',
                recurring: !!costs.recurring,
                timestamp: Date.now()
              }
            ]
          }
        };
      }
      
      // Handle influence costs
      if (costs.influence) {
        const newInfluence = { ...updatedState.influence };
        const influenceChanges: Record<string, number> = {};
        
        // Apply each influence cost
        for (const [key, value] of Object.entries(costs.influence)) {
          if (key in newInfluence && key !== 'history') {
            const fieldKey = key as keyof typeof newInfluence;
            const oldValue = newInfluence[fieldKey];
            // Influence can't go below 0
            if (typeof oldValue === 'number' && fieldKey !== 'history') {
              newInfluence[fieldKey] = Math.max(0, oldValue - (value as number));
            }
            influenceChanges[key] = -(value as number);
          }
        }
        
        updatedState = {
          ...updatedState,
          influence: {
            ...newInfluence,
            // Track influence spending
            history: [
              ...(updatedState.influence.history || []).slice(-9),
              {
                turn: action.payload.turn,
                previous: {
                  academic: updatedState.influence.academic,
                  industry: updatedState.influence.industry,
                  government: updatedState.influence.government,
                  public: updatedState.influence.public,
                  openSource: updatedState.influence.openSource
                },
                changes: influenceChanges,
                reason: reason || 'general',
                timestamp: Date.now()
              }
            ]
          }
        };
      }
      
      // Handle data costs (setting tiers or specialized sets to false)
      if (costs.data) {
        const newData = { ...updatedState.data };
        
        // Handle tier changes
        if (costs.data.tiers) {
          for (const [key, value] of Object.entries(costs.data.tiers)) {
            if (value === false) {
              newData.tiers = {
                ...newData.tiers,
                [key]: false
              };
            }
          }
        }
        
        // Handle specialized set changes
        if (costs.data.specializedSets) {
          for (const [key, value] of Object.entries(costs.data.specializedSets)) {
            if (value === false) {
              newData.specializedSets = {
                ...newData.specializedSets,
                [key]: false
              };
            }
          }
        }
        
        updatedState = {
          ...updatedState,
          data: newData
        };
      }
      
      return updatedState;

    case 'UPDATE_RESOURCE_CAPS':
      // Update resource caps (like computing capacity)
      const { computing, funding } = action.payload;
      
      return {
        ...state,
        computing: {
          ...state.computing,
          cap: computing !== undefined ? computing : state.computing.cap
        },
        funding: {
          ...state.funding,
          // Other funding caps could be added here
          ...(funding !== undefined ? { maxReserves: funding } : {})
        }
      };
    
    default:
      return state;
  }
}

/**
 * Research reducer for managing research tree and progress
 */
function researchReducer(state: ResearchState, action: GameAction): ResearchState {
  switch (action.type) {
    case 'UPDATE_RESEARCH_STATE':
      // Complete replacement of research state (for initialization/loading)
      return {
        ...state,
        ...action.payload
      };
      
    case 'START_RESEARCH':
      const { nodeId, allocatedCompute, turn } = action.payload;
      
      // Update node status and add to active research
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [nodeId]: {
            ...state.nodes[nodeId],
            status: 'IN_PROGRESS',
            computeAllocated: allocatedCompute,
            startTurn: turn,
            progress: state.nodes[nodeId].progress || 0 // Keep existing progress if resuming
          }
        },
        activeResearch: state.activeResearch.includes(nodeId) 
          ? state.activeResearch 
          : [...state.activeResearch, nodeId],
        unlocked: state.unlocked.filter(id => id !== nodeId)
      };
      
    case 'CANCEL_RESEARCH':
      const cancelId = action.payload.nodeId;
      
      // Mark node as available again and remove from active research
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [cancelId]: {
            ...state.nodes[cancelId],
            status: 'UNLOCKED',  // Back to available
            computeAllocated: 0, // No compute allocated
            // Keep progress for resuming later
          }
        },
        activeResearch: state.activeResearch.filter(id => id !== cancelId),
        unlocked: state.unlocked.includes(cancelId) 
          ? state.unlocked 
          : [...state.unlocked, cancelId]
      };
      
    case 'ALLOCATE_RESEARCH_COMPUTE':
      const allocationId = action.payload.nodeId;
      const allocationAmount = action.payload.amount;
      
      // Add more compute to a research project
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [allocationId]: {
            ...state.nodes[allocationId],
            computeAllocated: (state.nodes[allocationId].computeAllocated || 0) + allocationAmount
          }
        }
      };
      
    case 'UPDATE_RESEARCH_PROGRESS':
      // Update progress for specific research nodes
      const progressUpdates = action.payload.progressUpdates || {};
      const updatedNodes = { ...state.nodes };
      
      // Apply all progress updates if they exist
      if (progressUpdates && typeof progressUpdates === 'object') {
        for (const [id, progress] of Object.entries(progressUpdates)) {
          if (updatedNodes[id]) {
            updatedNodes[id] = {
              ...updatedNodes[id],
              progress: progress as number
            };
          }
        }
      }
      
      return {
        ...state,
        nodes: updatedNodes
      };
      
    case 'COMPLETE_RESEARCH':
      const completeId = action.payload.nodeId;
      const completeTurn = action.payload.turn;
      
      // Mark research as complete
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [completeId]: {
            ...state.nodes[completeId],
            status: 'COMPLETED',
            progress: 1.0, // Fully complete
            computeAllocated: 0, // Free up compute
            completionTurn: completeTurn
          }
        },
        activeResearch: state.activeResearch.filter(id => id !== completeId),
        completed: state.completed.includes(completeId) 
          ? state.completed 
          : [...state.completed, completeId]
      };
      
    case 'UPDATE_RESEARCH_STATUSES':
      // Update multiple node statuses at once
      const statusUpdates = action.payload.statusUpdates;
      const nodesWithStatusUpdates = { ...state.nodes };
      
      // Apply all status updates
      for (const [id, status] of Object.entries(statusUpdates)) {
        if (nodesWithStatusUpdates[id]) {
          nodesWithStatusUpdates[id] = {
            ...nodesWithStatusUpdates[id],
            status: status as ResearchStatus
          };
        }
      }
      
      // Update unlocked list based on available nodes
      const newUnlocked = Object.entries(nodesWithStatusUpdates)
        .filter(([, node]) => 
          node.status === 'UNLOCKED' || 
          node.status === 'available')
        .map(([id]) => id);
      
      return {
        ...state,
        nodes: nodesWithStatusUpdates,
        unlocked: newUnlocked
      };
      
    case 'UPDATE_RESEARCH_NODE':
      // Update a specific field in a research node
      const updateId = action.payload.nodeId;
      const update = action.payload.update;
      
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [updateId]: {
            ...state.nodes[updateId],
            ...update
          }
        }
      };
      
    case 'ADD_DATA_TYPE':
      // Add a new data type to research state
      const dataType = action.payload.dataType;
      
      return {
        ...state,
        dataTypes: {
          ...state.dataTypes,
          [dataType.id]: dataType
        }
      };
      
    default:
      return state;
  }
}

/**
 * Deployment reducer for managing active deployments
 */
function deploymentReducer(state: DeploymentState, action: GameAction): DeploymentState {
  switch (action.type) {
    case 'DEPLOY_SYSTEM':
      const { id, type, computing, effects } = action.payload;
      
      return {
        ...state,
        active: {
          ...state.active,
          [id]: {
            id,
            type,
            computeAllocated: computing,
            turnDeployed: action.payload.turn,
            effects
          }
        }
      };
    
    case 'REMOVE_DEPLOYMENT':
      const { deploymentId, turn } = action.payload;
      const activeDeployments = { ...state.active };
      const deployment = activeDeployments[deploymentId];
      
      if (deployment) {
        delete activeDeployments[deploymentId];
        
        // Add to history
        const historyEntry: DeploymentHistoryEntry = {
          id: deployment.id,
          type: deployment.type,
          turnDeployed: deployment.turnDeployed,
          turnRemoved: turn,
          impact: { ...deployment.effects }
        };
        
        return {
          ...state,
          active: activeDeployments,
          history: [...state.history, historyEntry]
        };
      }
      
      return state;
      
    case 'UPDATE_DEPLOYMENT_SLOTS':
      return {
        ...state,
        slots: action.payload.slots
      };
      
    default:
      return state;
  }
}

/**
 * Event reducer for managing game events
 */
function eventReducer(state: EventState, action: GameAction): EventState {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        current: [...state.current, action.payload.event]
      };
      
    case 'RESOLVE_EVENT':
      const { eventId, choiceId, effects, turn } = action.payload;
      const event = state.current.find(e => e.id === eventId);
      
      if (event) {
        // Create resolved event record
        const resolvedEvent: ResolvedEvent = {
          eventId,
          choiceId,
          turnTriggered: event.turnTriggered,
          turnResolved: turn,
          effects
        };
        
        // Remove event from current and add to history
        return {
          ...state,
          current: state.current.filter(e => e.id !== eventId),
          history: [...state.history, resolvedEvent],
          triggered: {
            ...state.triggered,
            [eventId]: true
          }
        };
      }
      
      return state;
    
    default:
      return state;
  }
}

/**
 * World reducer for managing global map and regions
 */
function worldReducer(state: WorldState, action: GameAction): WorldState {
  switch (action.type) {
    case 'UPDATE_GLOBAL_VALUES':
      const { awareness, alignment, regulation } = action.payload;
      
      return {
        ...state,
        globalAwareness: awareness ?? state.globalAwareness,
        globalAlignment: alignment ?? state.globalAlignment,
        globalRegulation: regulation ?? state.globalRegulation
      };
      
    case 'UPDATE_REGION':
      const { regionId, field, value } = action.payload;
      
      if (state.regions[regionId]) {
        return {
          ...state,
          regions: {
            ...state.regions,
            [regionId]: {
              ...state.regions[regionId],
              [field]: value
            }
          }
        };
      }
      
      return state;
      
    default:
      return state;
  }
}

/**
 * Competitor reducer for managing AI competitors
 */
function competitorReducer(state: CompetitorState, action: GameAction): CompetitorState {
  switch (action.type) {
    case 'UPDATE_COMPETITOR':
      const { competitorId, fields } = action.payload;
      
      if (state.organizations[competitorId]) {
        return {
          ...state,
          organizations: {
            ...state.organizations,
            [competitorId]: {
              ...state.organizations[competitorId],
              ...fields
            }
          }
        };
      }
      
      return state;
      
    case 'UPDATE_PLAYER_RANKING':
      return {
        ...state,
        playerRanking: action.payload.ranking
      };
      
    default:
      return state;
  }
}

/**
 * Settings reducer for managing game settings
 */
function settingsReducer(state: SettingsState, action: GameAction): SettingsState {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      console.log(`GameReducer: Updating settings with`, action.payload);
      return {
        ...state,
        ...action.payload
      };
      
    default:
      return state;
  }
}