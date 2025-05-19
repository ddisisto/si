# Technical Architecture

This document outlines the technical architecture for SuperInt++, defining core structure, components, and design patterns.

## Overview

SuperInt++ is built using TypeScript with a DOM-based UI. The architecture follows modular design principles with clear separation of concerns, immutable state management, and event-driven communication between systems.

## Architecture Principles

1. **Separation of Concerns** - Clear boundaries between systems
2. **Single Responsibility** - Each component has one primary purpose  
3. **Immutable Game State** - State changes through controlled actions
4. **Event-Driven Communication** - Systems communicate via events
5. **Testable Design** - Components designed for unit testing
6. **Progressive Enhancement** - Core game works first, polish added later
7. **Continuous Over Categorical** - Favor gradients and spectrums over binary states

## Technology Stack

- **Language**: TypeScript
- **Rendering**: DOM-based UI with HTML/CSS
- **Build Tools**: Webpack, npm
- **Testing**: Jest
- **Linting/Formatting**: ESLint, Prettier

## Data Flow

```
User Input → DOM Events → Actions → GameState → Systems → UI Update
                                        ↑                 |
                                        └-----------------┘
                                        (System-generated actions)
```

## Core Components

### Game Engine

Central coordinator managing:
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
  public update(deltaTime: number): void;
  public getState(): Readonly<GameState>;
  public dispatch(action: GameAction): void;
}
```

### Game State & Reducers

- **State**: Centralized storage as hierarchical tree of immutable objects
- **Reducers**: Modular functions handling state updates
- See [State Management Design](docs/state_management_design.md) and [Reducer Organization](docs/reducer_organization.md)

### Systems

Modular components handling specific gameplay aspects:

1. **ResourceSystem** - Manages resources and allocation (modularized)
2. **ResearchSystem** - Handles research tree and progression
3. **DeploymentSystem** - Manages deployments and effects
4. **EventSystem** - Controls events and resolution
5. **WorldSystem** - Manages global map and influence
6. **CompetitorSystem** - Handles AI competitors  
7. **TimeSystem** - Controls game time progression

Systems over ~400 lines should be refactored into focused subsystems. See ResourceSystem implementation in `src/systems/resources/` for reference pattern.

### Event Bus

Central communication hub with enhanced debugging and error handling.
- **Critical**: Single shared EventBus instance throughout application
- See [EventBus System Design](docs/eventbus_design.md) for detailed documentation

### UI Architecture

DOM-based UI with component hierarchy:
- Complex panels/views use UIComponent base class
- Simple elements use plain HTML with CSS classes
- See [UI Component System](docs/ui_component_system.md) for guidelines

## File Structure

```
/src
  /core
    GameEngine.ts
    GameState.ts
    System.ts
    EventBus.ts
    /reducers         # Modular reducer structure
  
  /systems
    ResourceSystem.ts
    /resources        # Modularized resource subsystems
    ResearchSystem.ts
    # ... other systems
  
  /ui
    /components
      UIComponent.ts  # Base class for complex components
      # ... component implementations
    UIManager.ts
    
  /types
  /data  
  /utils
  
  index.ts
```

## Key Patterns

### Logging Strategy

EventBus-centric logging approach:
1. Most activity logged through event emissions
2. Direct Logger usage only for system init/shutdown, errors, performance metrics
3. See [EventBus System Design](docs/eventbus_design.md) for complete strategy

### State Persistence

Save/load system using JSON serialization to localStorage, following event-driven patterns detailed in [EventBus System Design](docs/eventbus_design.md).

### Modularization Pattern

Large modules split into focused subsystems when exceeding ~400 lines. Reference implementation: ResourceSystem → resources/ subsystems.

## Future Improvements

### Code Organization
- Refactor files >300 lines into focused modules
- Apply ResourceSystem pattern to other large systems
- Maintain clear separation between logic and UI

### CSS Architecture
- Remove redundant styles and unused CSS
- Ensure component-specific CSS is properly scoped
- Maintain consistent naming conventions