/**
 * Event reducer for handling in-game events
 */

import { EventState, ResolvedEvent } from '../../types/core/GameState';
import { GameAction } from '../GameStateManager';

export function eventReducer(state: EventState, action: GameAction): EventState {
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
