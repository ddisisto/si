# Technical Architecture

This document outlines the technical architecture for SuperInt++, defining the structure, components, and design patterns for implementation.

## Overview

SuperInt++ is built using TypeScript and HTML5 Canvas for rendering, with a focus on modular design, clean separation of concerns, and maintainable code. The architecture follows the Entity-Component-System pattern where appropriate, combined with a state management approach for game data.

## Architecture Principles

1. **Separation of Concerns** - Clear boundaries between systems
2. **Single Responsibility** - Each component has one primary purpose
3. **Immutable Game State** - State changes through controlled actions
4. **Event-Driven Communication** - Systems communicate via events
5. **Testable Design** - Components designed for unit testing
6. **Progressive Enhancement** - Core game works first, polish added later

## Technology Stack

- **Language**: TypeScript
- **Rendering**: HTML5 Canvas
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
  private renderer: Renderer;
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

Centralized state storage for all game data:

```typescript
interface GameState {
  readonly meta: {
    turn: number;
    phase: GamePhase;
    organization: Organization;
    difficulty: Difficulty;
  };
  readonly resources: ResourceState;
  readonly research: ResearchState;
  readonly deployments: DeploymentState;
  readonly events: EventState;
  readonly world: WorldState;
  readonly competitors: CompetitorState;
  readonly settings: SettingsState;
}
```

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
  initialize(gameState: GameState): void;
  update(gameState: GameState, deltaTime: number): GameAction[];
  handleAction(action: GameAction): void;
  getName(): string;
}
```

### Renderer

Handles all drawing to the canvas:

```typescript
class Renderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private views: Map<string, View>;
  private activeView: string;
  
  public initialize(canvas: HTMLCanvasElement): void;
  public render(gameState: GameState): void;
  public setActiveView(viewName: string): void;
  public registerView(name: string, view: View): void;
  public getViewDimensions(): Dimensions;
  public clear(): void;
}
```

### UI Manager

Coordinates UI components and user interaction:

```typescript
class UIManager {
  private components: UIComponent[];
  private inputHandler: InputHandler;
  private eventBus: EventBus;
  
  public initialize(): void;
  public registerComponent(component: UIComponent): void;
  public processInput(input: UserInput): void;
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

1. **Input** - User interactions captured by InputHandler
2. **Actions** - Inputs translated to GameActions
3. **State Changes** - Actions processed to produce new GameState
4. **System Updates** - Systems react to state changes
5. **Rendering** - UI and canvas updated to reflect current state

```
User Input → InputHandler → Actions → GameState → Systems → Renderer
                                 ↑                   |
                                 └-------------------┘
                                 (System-generated actions)
```

## Game Loop

The game runs on a fixed-time-step loop:

1. Handle user input
2. Process game actions
3. Update game state
4. Update systems
5. Render current state
6. Repeat

```typescript
function gameLoop(timestamp: number) {
  const deltaTime = timestamp - lastTimestamp;
  
  inputHandler.processInput();
  const actions = actionQueue.getActions();
  
  actions.forEach(action => {
    gameState = reducer(gameState, action);
  });
  
  systems.forEach(system => {
    const systemActions = system.update(gameState, deltaTime);
    actionQueue.addActions(systemActions);
  });
  
  renderer.render(gameState);
  
  lastTimestamp = timestamp;
  requestAnimationFrame(gameLoop);
}
```

## View System

The game has multiple views that represent different aspects:

1. **ResearchView** - Research tree visualization and interaction
2. **DeploymentView** - Deployment management and global map
3. **DashboardView** - Resource overview and allocation
4. **EventView** - Event notifications and resolution
5. **SettingsView** - Game configuration

Each view has:
- Rendering logic
- Interaction handling
- Layout management

## File Structure

```
/src
  /core
    GameEngine.ts
    GameState.ts
    System.ts
    EventBus.ts
    InputHandler.ts
    ActionTypes.ts
    GameReducer.ts
  
  /systems
    ResourceSystem.ts
    ResearchSystem.ts
    DeploymentSystem.ts
    EventSystem.ts
    WorldSystem.ts
    CompetitorSystem.ts
    TimeSystem.ts
  
  /ui
    Renderer.ts
    UIManager.ts
    View.ts
    Component.ts
    /views
      ResearchView.ts
      DeploymentView.ts
      DashboardView.ts
      EventView.ts
      SettingsView.ts
    /components
      Button.ts
      Panel.ts
      Slider.ts
      Tooltip.ts
      
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

The game uses a unidirectional data flow pattern:

1. **State** - Single source of truth for game data
2. **Actions** - Describe changes to be made
3. **Reducer** - Produces new state from old state and action
4. **Selectors** - Extract specific data for components

```typescript
// Action
interface GameAction {
  type: string;
  payload: any;
}

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'RESEARCH_START':
      return {
        ...state,
        research: researchReducer(state.research, action)
      };
    // Other cases...
    default:
      return state;
  }
}

// Selector
function getAvailableResearch(state: GameState): Research[] {
  return state.research.nodes.filter(node => 
    node.visible && !node.completed && canAfford(state.resources, node.cost)
  );
}
```

## Canvas Rendering Strategy

The rendering system uses layers for efficiency:

1. **Background Layer** - Static elements, rarely redrawn
2. **Game Layer** - Main game elements, redrawn each frame
3. **UI Layer** - Interface elements, drawn on top
4. **Tooltip Layer** - Overlay information, highest z-index

Each layer can be cleared and redrawn independently to optimize performance.

## Saving and Loading

Game state will be serialized to JSON and stored:

1. **Automatic Saving** - Periodic state snapshots
2. **Manual Saving** - User-triggered save points
3. **Loading** - Initialize game from saved state
4. **Migration** - Handle loading from older versions

## Optimization Strategies

1. **Partial Rendering** - Only redraw changed elements
2. **Object Pooling** - Reuse objects to reduce garbage collection
3. **Off-screen Rendering** - Prepare complex visuals off-screen
4. **DOM for Text** - Use HTML for text-heavy interface elements
5. **Debounced Events** - Throttle high-frequency events

## Next Steps

1. Set up project structure and build system
2. Implement core GameEngine and GameState
3. Create basic rendering pipeline
4. Implement resource system as first gameplay component
5. Build research visualization prototype