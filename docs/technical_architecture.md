# Technical Architecture

This document outlines the technical architecture for SuperInt++, defining the structure, components, and design patterns for implementation.

## Overview

SuperInt++ is built using TypeScript with a DOM-based UI for all game elements. The architecture follows modular design principles with clear separation of concerns, immutable state management, and event-driven communication between systems.

## Architecture Principles

1. **Separation of Concerns** - Clear boundaries between systems
2. **Single Responsibility** - Each component has one primary purpose
3. **Immutable Game State** - State changes through controlled actions
4. **Event-Driven Communication** - Systems communicate via events
5. **Testable Design** - Components designed for unit testing
6. **Progressive Enhancement** - Core game works first, polish added later
7. **Continuous Over Categorical** - Favor gradients and spectrums over binary states, reflecting the philosophical approach of the project

## Technology Stack

- **Language**: TypeScript
- **Rendering**: DOM-based UI with HTML/CSS
- **Build Tools**: Webpack, npm
- **Testing**: Jest
- **Linting/Formatting**: ESLint, Prettier

## Core Architecture Components

### Game Engine

Central coordinator for the game, managing:
- Game loop
- System updates
- State management
- Event coordination

```typescript
class GameEngine {
  private gameState: GameState;
  private systems: System[];
  private uiManager: UIManager;
  private eventBus: EventBus;
  
  public initialize(): void;
  public start(): void;
  public pause(): void;
  public resume(): void;
  public update(deltaTime: number): void;
  public getState(): Readonly<GameState>;
  public dispatch(action: GameAction): void;
  private applyAction(action: GameAction): void;
}
```

### Game State

Centralized state storage for all game data, structured as a hierarchical tree of immutable objects:

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

For detailed information about the state structure and management approach, see [State Management Design](./state_management_design.md).

### Systems

Modular components that handle specific aspects of gameplay:

1. **ResourceSystem** - Manages resources and their allocation
2. **ResearchSystem** - Handles research tree and progression
3. **DeploymentSystem** - Manages deployments and their effects
4. **EventSystem** - Controls events and their resolution
5. **WorldSystem** - Manages global map and influence
6. **CompetitorSystem** - Handles AI competitors
7. **TimeSystem** - Controls game time progression

System base interface:
```typescript
interface System {
  initialize(): void;
  update(deltaTime: number): void;
  handleAction(action: GameAction): void;
  getName(): string;
  isInitialized(): boolean;
}
```

### UI Architecture (DOM-based)

The UI layer uses DOM elements exclusively, providing a responsive and accessible interface:

#### UI Component Base Class

```typescript
class UIComponent {
  protected element: HTMLElement;
  protected gameState: Readonly<GameState>;
  
  constructor(elementType: string, className?: string);
  public mount(parent: HTMLElement): void;
  public unmount(): void;
  public update(gameState: Readonly<GameState>): void;
  public render(): void;
  protected createTemplate(): string;
}
```

#### UI Manager

Coordinates UI components and user interaction:

```typescript
class UIManager {
  private components: Map<string, UIComponent>;
  private rootElement: HTMLElement;
  private eventBus: EventBus;
  
  public initialize(rootElement: HTMLElement): void;
  public registerComponent(id: string, component: UIComponent): void;
  public update(gameState: GameState): void;
}
```

### Event Bus

Facilitates communication between systems:

```typescript
class EventBus {
  private listeners: Map<string, EventListener[]>;
  
  public subscribe(eventType: string, listener: EventListener): void;
  public unsubscribe(eventType: string, listener: EventListener): void;
  public emit(eventType: string, data: any): void;
}
```

## Data Flow

1. **Input** - User interactions captured by DOM events
2. **Actions** - Inputs translated to GameActions
3. **State Changes** - Actions processed to produce new GameState
4. **System Updates** - Systems react to state changes
5. **UI Update** - DOM elements updated to reflect current state

```
User Input → DOM Events → Actions → GameState → Systems → UI Update
                                        ↑                 |
                                        └-----------------┘
                                        (System-generated actions)
```

## Game Loop

The game runs on a fixed-time-step loop:

1. Handle user input via DOM events
2. Process game actions
3. Update game state
4. Update systems
5. Update UI components
6. Repeat

```typescript
function gameLoop(timestamp: number) {
  const deltaTime = timestamp - lastTimestamp;
  
  // Process any queued actions
  const actions = actionQueue.getActions();
  actions.forEach(action => {
    gameState = reducer(gameState, action);
  });
  
  // Update game systems
  systems.forEach(system => {
    const systemActions = system.update(deltaTime);
    actionQueue.addActions(systemActions);
  });
  
  // Update UI
  uiManager.update(gameState);
  
  lastTimestamp = timestamp;
  requestAnimationFrame(gameLoop);
}
```

## UI Components

The game uses various UI components to represent different aspects of gameplay:

1. **ResourcePanel** - Displays and manages resources
2. **TurnControls** - Controls for turn progression
3. **ResearchTreeView** - Research tree visualization and interaction
4. **DeploymentView** - Deployment management and global map
5. **EventPanel** - Event notifications and resolution
6. **WorldMapView** - Map visualization and regional influence
7. **SettingsPanel** - Game configuration options

Each component has:
- A root DOM element
- Event handlers for user interaction
- Update method to reflect state changes
- Template rendering logic

## File Structure

```
/src
  /core
    GameEngine.ts
    GameState.ts
    System.ts
    EventBus.ts
    ActionTypes.ts
    GameReducer.ts
    GameStateManager.ts
    TurnSystem.ts
  
  /systems
    ResourceSystem.ts
    ResearchSystem.ts
    DeploymentSystem.ts
    EventSystem.ts
    WorldSystem.ts
    CompetitorSystem.ts
    TimeSystem.ts
  
  /ui
    /components
      UIComponent.ts
      Panel.ts
      Button.ts
      ResourcePanel.ts
      TurnControls.ts
      ResearchTreeView.ts
      DeploymentView.ts
      EventPanel.ts
      WorldMapView.ts
      SettingsPanel.ts
    UIManager.ts
      
  /types
    Resource.ts
    Research.ts
    Deployment.ts
    Event.ts
    World.ts
    Competitor.ts
    
  /data
    ResourceData.ts
    ResearchData.ts
    DeploymentData.ts
    EventData.ts
    WorldData.ts
    CompetitorData.ts
  
  /utils
    Math.ts
    Random.ts
    Logger.ts
    Storage.ts
    
  index.ts
  index.html
```

## State Management

The game uses an immutable state management approach with unidirectional data flow:

1. **GameState** - Centralized, immutable state tree as single source of truth
2. **Actions** - Plain objects describing intended state changes
3. **Reducers** - Pure functions that compute new state from previous state and actions
4. **GameStateManager** - Coordinates state updates and notifies systems of changes
5. **TurnSystem** - Handles progression of game turns and phases
6. **Selectors** - Extract and derive data from state for components

For detailed information about the state management implementation, see [State Management Design](./state_management_design.md).

```typescript
// Core state manager
class GameStateManager {
  private state: GameState;
  
  public getState(): Readonly<GameState>;
  public dispatch(action: GameAction): void;
  public subscribe(listener: StateChangeListener): () => void;
}

// Simplified reducer example
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
```

## DOM Rendering Strategy

The rendering system uses a component-based approach:

1. **Components** - Self-contained UI elements with HTML templates
2. **Virtual DOM-like Updates** - Components only update when state changes
3. **Event Delegation** - Events bubble up to parent components
4. **CSS Styling** - Responsive design with CSS Grid and Flexbox

Key advantages:
- **Accessibility** - Native DOM provides better accessibility
- **Responsive Design** - Natural responsiveness without custom scaling
- **Easier Development** - Standard HTML/CSS development patterns
- **Better Interactivity** - Native event handling and form controls
- **Testability** - Components can be tested in isolation

## Saving and Loading

Game state will be serialized to JSON and stored:

1. **Automatic Saving** - Periodic state snapshots
2. **Manual Saving** - User-triggered save points
3. **Loading** - Initialize game from saved state
4. **Migration** - Handle loading from older versions

## Optimization Strategies

1. **Selective Rendering** - Only update components when their data changes
2. **Event Delegation** - Reduce number of event listeners
3. **CSS Transitions** - Use CSS for animations where possible
4. **Lazy Loading** - Load components as needed
5. **Efficient DOM Updates** - Minimize DOM manipulation

This approach follows our "Anti-maximization design" philosophy from PHILOSOPHY.md - we create multiple optimization strategies rather than over-optimizing a single approach, enhancing system resiliency.

## Next Steps for UI Implementation

1. Create base UIComponent class (completed)
2. Develop core UI components (ResourcePanel, TurnControls) (in progress)
3. Create UIManager to coordinate components (completed)
4. Implement DOM event handling (completed)
5. Add styling with CSS (in progress)
6. Develop research tree visualization components

For implementation details, see [Implementation Plan](./implementation_plan.md).