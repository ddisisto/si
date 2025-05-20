# State Management Design

This document details the approach, architecture, and implementation plan for the core state management system in SuperInt++, with a focus on flexibility, maintainability, and performance.

## Overview

The state management system is the foundational layer of the game architecture, responsible for:

1. Maintaining a single source of truth for game data
2. Providing controlled ways to update that data
3. Notifying systems of relevant changes
4. Supporting serialization for save/load functionality
5. Facilitating undo/redo capabilities where appropriate

## Design Principles

1. **Immutability** - State is not directly modified but updated through a controlled process
2. **Unidirectional Data Flow** - Changes follow a predictable path: Action → Reducer → New State
3. **Single Source of Truth** - All game data originates from the central state
4. **Separation of Concerns** - State management is distinct from rendering and input handling
5. **Type Safety** - Strong TypeScript typing for all state interfaces

## State Architecture

### Core State Structure

The game state is organized as a hierarchical tree of immutable objects:

```typescript
interface GameState {
  readonly meta: GameMetaState;           // Game-wide metadata
  readonly resources: ResourceState;      // Resource tracking 
  readonly research: ResearchState;       // Research tree state
  readonly deployments: DeploymentState;  // Deployed AI systems
  readonly events: EventState;            // Event queue and history
  readonly world: WorldState;             // World map and regions
  readonly competitors: CompetitorState;  // AI competitors
  readonly settings: SettingsState;       // Game settings
}
```

Each major subsystem has its own state slice, clearly separating concerns and allowing systems to focus on their specific data.

### State Initialization

Initial state will be created with a factory function that ensures all required properties are set:

```typescript
function createInitialState(): GameState {
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
```

### Detailed State Sections

#### Game Meta State

Contains game-wide information like turn count, phase, and player organization.

```typescript
interface GameMetaState {
  turn: number;                   // Current game turn
  phase: GamePhase;               // Current game phase
  organization: OrganizationType; // Player's organization
  startDate: Date;                // When the game was started
  lastSaved: Date | null;         // Last save timestamp
}
```

#### Resource State

Tracks all resources managed by the player, following the design from resource_system_design.md:

```typescript
interface ResourceState {
  computing: ComputingResource;
  data: DataResource;
  influence: InfluenceResource;
  funding: FundingResource;
}

interface ComputingResource {
  total: number;
  allocated: Record<string, number>; // activity ID -> amount
  cap: number;
  generation: number;
}

interface InfluenceResource {
  academic: number;
  industry: number;
  government: number;
  public: number;
  openSource: number;
}
```

#### Research State

Maintains the research tree state based on research_tree_design.md:

```typescript
interface ResearchState {
  nodes: Record<string, ResearchNode>;
  activeResearch: string[];
  completed: string[];
  unlocked: string[];
}

interface ResearchNode {
  id: string;
  status: ResearchStatus;
  progress: number;
  computeAllocated: number;
  discoveredCapabilities: string[];
}
```

#### Turn Management

Tracks turn progression and turn-based events:

```typescript
interface TurnState {
  current: number;
  events: TurnEvent[];
  history: TurnHistory[];
}

interface TurnEvent {
  id: string;
  type: TurnEventType;
  data: any;
  processed: boolean;
}
```

## State Update Mechanism

### Actions

Actions are plain objects that describe an intention to change state:

```typescript
interface GameAction {
  type: string;
  payload: any;
}
```

Specific action types will be defined for different operations:

```typescript
// Resource allocation action
interface AllocateComputingAction {
  type: 'ALLOCATE_COMPUTING';
  payload: {
    source: string;
    target: string;
    amount: number;
  };
}

// Research action
interface StartResearchAction {
  type: 'START_RESEARCH';
  payload: {
    nodeId: string;
    computeAmount: number;
  };
}
```

### Reducers

Reducers are pure functions that take the current state and an action, and return a new state:

```typescript
type Reducer<S> = (state: S, action: GameAction) => S;

// Example resource reducer
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
    default:
      return state;
  }
}

// Root reducer combines all sub-reducers
function gameReducer(state: GameState, action: GameAction): GameState {
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
```

### State Manager

A central class will manage the state and provide dispatch capabilities:

```typescript
class GameStateManager {
  private state: GameState;
  private reducer: Reducer<GameState>;
  private listeners: StateChangeListener[] = [];
  
  constructor(initialState: GameState, reducer: Reducer<GameState>) {
    this.state = initialState;
    this.reducer = reducer;
  }
  
  getState(): Readonly<GameState> {
    return this.state;
  }
  
  dispatch(action: GameAction): void {
    const prevState = this.state;
    this.state = this.reducer(this.state, action);
    
    if (prevState !== this.state) {
      this.notifyListeners(prevState, this.state, action);
    }
  }
  
  subscribe(listener: StateChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  private notifyListeners(prevState: GameState, nextState: GameState, action: GameAction): void {
    this.listeners.forEach(listener => {
      listener(prevState, nextState, action);
    });
  }
}
```

## Turn-Based Progression

The game uses a turn-based system for progression. Each turn consists of:

1. **Start Phase**
   - Process start-of-turn effects
   - Update resource generation
   - Check for events

2. **Action Phase**
   - Player allocates resources
   - Makes decisions
   - Performs actions

3. **Resolution Phase**
   - Apply effects of actions
   - Process research progress
   - Apply deployments impact

4. **End Phase**
   - Check for turn-end events
   - Update competitors
   - Save turn history

This is implemented with a dedicated TurnSystem:

```typescript
class TurnSystem {
  private stateManager: GameStateManager;
  
  constructor(stateManager: GameStateManager) {
    this.stateManager = stateManager;
  }
  
  startTurn(): void {
    this.stateManager.dispatch({ type: 'TURN_START', payload: {} });
    this.processTurnStart();
  }
  
  endTurn(): void {
    this.resolveTurnActions();
    this.processTurnEnd();
    this.stateManager.dispatch({ type: 'TURN_END', payload: {} });
    this.advanceToNextTurn();
  }
  
  private processTurnStart(): void {
    // Generate resources
    this.stateManager.dispatch({ type: 'GENERATE_RESOURCES', payload: {} });
    
    // Check for events
    this.checkForEvents();
  }
  
  private resolveTurnActions(): void {
    // Process research progress
    this.stateManager.dispatch({ type: 'UPDATE_RESEARCH_PROGRESS', payload: {} });
    
    // Apply deployment effects
    this.stateManager.dispatch({ type: 'APPLY_DEPLOYMENT_EFFECTS', payload: {} });
  }
  
  private processTurnEnd(): void {
    // Update competitor actions
    this.stateManager.dispatch({ type: 'UPDATE_COMPETITORS', payload: {} });
    
    // Save turn history
    this.stateManager.dispatch({ 
      type: 'SAVE_TURN_HISTORY', 
      payload: { turn: this.stateManager.getState().meta.turn } 
    });
  }
  
  private advanceToNextTurn(): void {
    this.stateManager.dispatch({ type: 'ADVANCE_TURN', payload: {} });
  }
  
  private checkForEvents(): void {
    // Check event triggers and dispatch relevant events
  }
}
```

## Selectors

Selectors are pure functions that extract specific data from the state, potentially performing derived calculations:

```typescript
// Get available research nodes
function getAvailableResearch(state: GameState): string[] {
  return Object.keys(state.research.nodes).filter(nodeId => {
    const node = state.research.nodes[nodeId];
    return node.status === 'UNLOCKED' && !state.research.activeResearch.includes(nodeId);
  });
}

// Get total allocated computing
function getTotalAllocatedComputing(state: GameState): number {
  return Object.values(state.resources.computing.allocated).reduce((sum, amount) => sum + amount, 0);
}

// Get remaining available computing
function getAvailableComputing(state: GameState): number {
  return state.resources.computing.total - getTotalAllocatedComputing(state);
}
```

## Persistence and Serialization

The state system supports saving and loading game state through the GameStateManager. See [EventBus System Design](./eventbus_design.md) for comprehensive documentation on the save/load system and its integration with the event architecture.

Key responsibilities of the state management system for persistence:

1. **State Serialization** - Converting state tree to JSON
2. **State Deserialization** - Rebuilding state from saved data
3. **Version Management** - Supporting migration between versions
4. **Metadata Tracking** - Including relevant metadata with saves

The GameStateManager provides these core methods:

```typescript
// Save current state to storage
public saveState(name: string = 'default'): void;

// Load state from storage
public loadState(name: string = 'default'): boolean;
```

## State Debugging

During development, we'll add debugging tools for state inspection:

1. **State Logger** - Logs state changes to console
2. **Action History** - Records all dispatched actions
3. **State Diff Viewer** - Shows what changed between states
4. **Time Travel Debugging** - Ability to jump to previous states during development

```typescript
// Debug middleware example
function createDebugMiddleware() {
  return (prevState: GameState, nextState: GameState, action: GameAction) => {
    console.group(`Action: ${action.type}`);
    console.log('Prev State:', prevState);
    console.log('Action:', action);
    console.log('Next State:', nextState);
    console.groupEnd();
  };
}
```

## Integration with Systems

Each game system will interact with the state management in a consistent way:

1. **Reading State** - Systems use selectors to read current state
2. **Updating State** - Systems dispatch actions to request changes
3. **Reacting to Changes** - Systems subscribe to relevant state changes

```typescript
class ResearchSystem {
  private stateManager: GameStateManager;
  private unsubscribe: () => void;
  
  constructor(stateManager: GameStateManager) {
    this.stateManager = stateManager;
    
    // Subscribe to state changes
    this.unsubscribe = stateManager.subscribe(this.handleStateChange.bind(this));
  }
  
  startResearch(nodeId: string, computeAmount: number): void {
    this.stateManager.dispatch({
      type: 'START_RESEARCH',
      payload: { nodeId, computeAmount }
    });
  }
  
  private handleStateChange(prevState: GameState, nextState: GameState, action: GameAction): void {
    // Only process relevant state changes
    if (action.type === 'START_RESEARCH' || action.type === 'COMPLETE_RESEARCH') {
      this.updateResearchDisplay();
    }
  }
  
  private updateResearchDisplay(): void {
    // Update UI based on current research state
    const state = this.stateManager.getState();
    // ...update UI...
  }
  
  dispose(): void {
    // Cleanup when system is destroyed
    this.unsubscribe();
  }
}
```

## Implementation Plan

1. **Phase 1: Core State Interfaces**
   - Define all state interfaces
   - Create initial state factories
   - Implement basic action types

2. **Phase 2: State Manager**
   - Build GameStateManager class
   - Implement reducer pattern
   - Add subscription mechanism

3. **Phase 3: Turn System**
   - Implement turn progression logic
   - Create turn phases
   - Build event triggering

4. **Phase 4: Resource System Integration**
   - Connect resource system to state
   - Implement resource allocations
   - Create resource selectors

5. **Phase 5: Serialization**
   - Add save/load functionality
   - Implement state persistence
   - Create serialization helpers

## Next Steps

1. Create detailed TypeScript interfaces for all state components
2. Implement the GameStateManager class
3. Build core reducers for each state slice
4. Create the turn management system
5. Integrate with the existing game loop