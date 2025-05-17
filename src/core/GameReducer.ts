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
  DeploymentState, 
  EventState, 
  WorldState, 
  CompetitorState, 
  SettingsState,
  DeploymentHistoryEntry,
  ResolvedEvent
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
      return {
        ...state,
        computing: {
          ...state.computing,
          allocated: {
            ...state.computing.allocated,
            [action.payload.target]: (state.computing.allocated[action.payload.target] || 0) + action.payload.amount
          }
        }
      };
      
    case 'GENERATE_RESOURCES':
      // Generate resources at the start of turn
      const newFunding = {
        ...state.funding,
        current: state.funding.current + state.funding.income - state.funding.expenses
      };
      
      return {
        ...state,
        funding: newFunding
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
    
    default:
      return state;
  }
}

/**
 * Research reducer for managing research tree and progress
 */
function researchReducer(state: ResearchState, action: GameAction): ResearchState {
  switch (action.type) {
    case 'START_RESEARCH':
      const { nodeId, computeAmount } = action.payload;
      
      // Update node status and add to active research
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [nodeId]: {
            ...state.nodes[nodeId],
            status: 'IN_PROGRESS',
            computeAllocated: computeAmount
          }
        },
        activeResearch: [...state.activeResearch, nodeId],
        unlocked: state.unlocked.filter(id => id !== nodeId)
      };
      
    case 'UPDATE_RESEARCH_PROGRESS':
      const updatedNodes = { ...state.nodes };
      let completedResearch = [...state.completed];
      let activeResearch = [...state.activeResearch];
      
      // Update progress for all active research based on allocated computing
      for (const nodeId of state.activeResearch) {
        const node = state.nodes[nodeId];
        if (node) {
          // Simple progress calculation - will be refined later
          const newProgress = node.progress + node.computeAllocated * 0.1;
          
          // Check if research is complete
          if (newProgress >= 100) {
            updatedNodes[nodeId] = {
              ...node,
              progress: 100,
              status: 'COMPLETED'
            };
            
            // Move from active to completed
            completedResearch.push(nodeId);
            activeResearch = activeResearch.filter(id => id !== nodeId);
          } else {
            updatedNodes[nodeId] = {
              ...node,
              progress: newProgress
            };
          }
        }
      }
      
      return {
        ...state,
        nodes: updatedNodes,
        completed: completedResearch,
        activeResearch
      };
      
    case 'UNLOCK_RESEARCH':
      const unlockIds = action.payload.nodeIds;
      const newUnlocked = [...state.unlocked];
      const nodesUpdate = { ...state.nodes };
      
      for (const id of unlockIds) {
        if (!state.unlocked.includes(id) && !state.completed.includes(id) && !state.activeResearch.includes(id)) {
          newUnlocked.push(id);
          
          // Update node status to unlocked
          nodesUpdate[id] = {
            ...state.nodes[id],
            status: 'UNLOCKED'
          };
        }
      }
      
      return {
        ...state,
        nodes: nodesUpdate,
        unlocked: newUnlocked
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
      return {
        ...state,
        ...action.payload
      };
      
    default:
      return state;
  }
}