/**
 * LEGACY - Temporary file containing researchReducer only
 * 
 * This file will be removed once researchReducer is properly modularized.
 * All other reducers have been moved to the src/core/reducers/ directory.
 * 
 * TODO: Extract researchReducer into modular structure in Phase 3
 */

import { ResearchState, ResearchStatus, ResearchNode } from '../types/core/GameState';
import { GameAction } from './GameStateManager';
import Logger from '../utils/Logger';

/**
 * Research reducer for research tree state management
 * TODO: Split into sub-modules following resourceReducer pattern
 */
export function researchReducer(state: ResearchState, action: GameAction): ResearchState {
  switch (action.type) {
    case 'RESEARCH_START':
      const { nodeId, turn } = action.payload;
      
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [nodeId]: {
            ...state.nodes[nodeId],
            status: 'IN_PROGRESS' as ResearchStatus,
            startTurn: turn
          }
        },
        activeResearch: [...state.activeResearch, nodeId]
      };
      
    case 'RESEARCH_CANCEL':
      const { nodeId: cancelNodeId } = action.payload;
      
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [cancelNodeId]: {
            ...state.nodes[cancelNodeId],
            status: 'UNLOCKED' as ResearchStatus,
            progress: 0,
            computeAllocated: 0,
            startTurn: undefined
          }
        },
        activeResearch: state.activeResearch.filter(id => id !== cancelNodeId)
      };
      
    case 'UPDATE_RESEARCH_PROGRESS':
      const { progressUpdates } = action.payload;
      
      // Update progress for all nodes
      const updatedNodes = Object.entries(progressUpdates).reduce((acc, [nodeId, newProgress]) => {
        const node = state.nodes[nodeId];
        if (!node) {
          Logger.warn(`Trying to update progress for non-existent node: ${nodeId}`);
          return acc;
        }
        
        return {
          ...acc,
          [nodeId]: {
            ...node,
            progress: newProgress as number
          }
        };
      }, {} as Record<string, ResearchNode>);
      
      return {
        ...state,
        nodes: {
          ...state.nodes,
          ...updatedNodes
        }
      };
      
    case 'ALLOCATE_COMPUTING_TO_RESEARCH':
      // Since computingAllocations doesn't exist in ResearchState,
      // we'll store allocations in the researchBudget field as a percentage
      const { amount } = action.payload;
      
      return {
        ...state,
        researchBudget: (state.researchBudget || 0) + amount
      };
      
    case 'DEALLOCATE_COMPUTING_FROM_RESEARCH':
      const { amount: deallocAmount } = action.payload;
      const updatedBudget = Math.max(0, (state.researchBudget || 0) - deallocAmount);
      
      return {
        ...state,
        researchBudget: updatedBudget
      };
      
    case 'RESEARCH_COMPLETE':
      const { nodeId: completeNodeId, turn: completeTurn } = action.payload;
      
      // Remove from active research
      const newActiveResearch = state.activeResearch.filter(id => id !== completeNodeId);
      
      // Update node status
      const newNodes: Record<string, ResearchNode> = {
        ...state.nodes,
        [completeNodeId]: {
          ...state.nodes[completeNodeId],
          status: 'COMPLETED' as ResearchStatus,
          completionTurn: completeTurn,
          progress: 100
          // Note: effects are not stored in ResearchNode interface
        }
      };
      
      // Check for newly available nodes based on prerequisites
      for (const node of Object.values(newNodes)) {
        if (node.status === 'LOCKED') {
          // Prerequisites check would need to be handled elsewhere
          // as the interface doesn't include prerequisites
        }
      }
      
      return {
        ...state,
        nodes: newNodes,
        activeResearch: newActiveResearch,
        completed: [...state.completed, completeNodeId]
      };
      
    case 'UPDATE_RESEARCH_STATUS':
      const { nodeId: statusNodeId, status } = action.payload;
      
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [statusNodeId]: {
            ...state.nodes[statusNodeId],
            status
          }
        }
      };
      
    case 'SET_RESEARCH_FOCUS':
      // focusedNodeId doesn't exist in ResearchState
      // We could potentially use dataTypes field to store this
      return state;
      
    case 'UPDATE_CATEGORY_MULTIPLIERS':
      // categoryMultipliers doesn't exist in ResearchState
      // This functionality would need to be implemented differently
      return state;
      
    case 'ACTIVATE_RESEARCH_EFFECT':
      // activeEffects doesn't exist in ResearchState
      // This functionality would need to be implemented differently
      return state;
      
    default:
      return state;
  }
}