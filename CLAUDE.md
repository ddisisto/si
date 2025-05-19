# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SuperInt++ is a strategic simulation game about AI development and its consequences. Players manage an AI development organization, research new capabilities, deploy AI systems, and navigate the complex societal, ethical, and competitive landscape of advanced AI.

## Key Game Systems

The game consists of several interconnected systems:

1. **Research System** - Tech tree for AI capability development
2. **Resource System** - Management of Computing, Data, Influence, and Funding
3. **Deployment System** - Applied AI systems with effects and risks
4. **Game Events** - In-game occurrences that require player decisions
5. **Alignment System** - Relationships and value adherence tracking
6. **EventBus System** - Infrastructure for component communication

## Primary Workflow: Reconciliation

**Always start with `/project:reconcile`** - this is your universal entry point for understanding project state and what needs attention.

The project maintains alignment through a document hierarchy:
**CONCEPT** → **PHILOSOPHY** → **PLAN** → **ARCHITECTURE** → **ROADMAP** → **README**

Reconciliation is change-driven: start from recent commits, trace impacts upward through the hierarchy only as needed, then cascade updates downward. It adapts to context - sometimes updating docs, sometimes implementing features, sometimes refactoring code.

## Documentation Structure

- **CONCEPT.md** - Original concept and brainstorming
- **PLAN.md** - Game mechanics and system overview
- **PHILOSOPHY.md** - Core design principles emphasizing meaningful tensions and continuous systems
- **ROADMAP.md** - Development plan and progress tracking (essential for prioritization)
- **docs/** - Technical and design documentation:
  - **test_plan.md** - Testing strategy and standards
  - **ARCHITECTURE.md** - Architecture overview (review before implementation) [moved to root]
  - state_management_design.md - Data flow and state structure
  - eventbus_design.md - EventBus system documentation
  - ui_component_system.md - UI component patterns and architecture
  - **design/** - System design documents:
    - research_tree_design.md - Research progression system
    - resource_system_design.md - Resource mechanics
    - game_events_design.md - Event triggers and resolution
    - deployment_system_design.md - AI system deployment
    - alignment_system_design.md - Value tracking and consequences
    - deployment_research_integration.md - Integration design between systems
    - resource_system_implementation_plan.md - Resource system development roadmap
  - **wip/** - Work in progress tracking:
    - research_tree_implementation_plan.md - Research tree implementation status

## Current Status

The project is in early implementation with core systems partially implemented. We've completed the event bus, state management, resource system foundations, and turn-based progression.

## Build/Test Commands

- Setup: `npm install`
- Run dev server: `npm run dev` (instruct user to run in separate terminal)
- Typecheck: `npm run typecheck` (run after **all** significant code changes)
- Test: `npm run test` (not yet implemented - add to ROADMAP?)

## Current Development Focus

See ROADMAP.md for detailed priorities. Current focus:
- Code refactoring of large files (immediate priority)
- Resource system refinement with data types
- Deployment system foundation (including data generation)
- Research system implementation
- Event system implementation

## Code Style Guidelines

- **Framework**: TypeScript with DOM-based UI
- **Formatting**: Follow Prettier defaults
- **Imports**: Group imports (1. libraries, 2. components, 3. utilities/types)
- **Naming**: camelCase for variables/functions, PascalCase for classes/components
- **Types**: Use TypeScript types/interfaces for all game entities and state
- **Error Handling**: Use try/catch with specific error messages
- **Modular Design**: Separate game logic from rendering code
- **Comments**: Focus on "why" not "what" in comments
- **State Management**: Use immutable patterns when possible

## UI Component Best Practices

### When to Create UIComponent Subclasses

**Create a UIComponent for:**
- Complex panels with multiple interactive elements (ResourcePanel, SaveLoadPanel)
- Views that need game state updates (MainView, ResearchTreeView)
- Components with lifecycle requirements (initialization, cleanup)
- Multi-element layouts with internal behavior

**Use Plain HTML for:**
- Buttons: `<button class="btn-primary">Click</button>`
- Labels, headings, and static text
- Simple containers and divs
- Any element that doesn't need state updates

### Button Implementation

**Never create a Button component.** Always use plain HTML:

```html
<!-- CORRECT -->
<button class="btn-primary">Save Game</button>
<button class="btn-danger btn-small">Delete</button>

<!-- INCORRECT - Don't create Button components -->
<!-- class Button extends UIComponent { ... } -->
```

### CSS Organization

- Place component-specific styles in `/public/styles/components/`
- Use standardized class names (btn-primary, panel, etc.)
- Keep styles modular and reusable
- Avoid inline styles except for dynamic values

## Tool Usage Tips

- Built-in tool Search typically works better (especially with escaping) than Bash(grep ...)
- Use Batch tool for multiple file operations to improve performance

## Game Architecture

The codebase maintains separation between core systems:
- **Core**: Game logic (GameEngine, GameState, GameReducer, TimeSystem, etc.)
- **EventBus System**: Communication layer between components (single instance)
- **UI**: DOM-based UI components and managers (UIManager, UIComponents)
  - Components should be small and focused (<400 lines)
  - Reusable component patterns with consistent styling
  - Modular CSS organization by component
- **Systems**: Game system implementations (ResourceSystem, ResearchSystem, etc.)
  - Each system should be split into logical modules when growing large
  - Clear interfaces between systems
  - **ResourceSystem** has been modularized as a reference pattern:
    - `ComputingManager` - Computing resource operations
    - `DataManager` - Data resource management
    - `ResourceCalculations` - Metrics and calculations  
    - `ResourceEffects` - Effect management
    - `ResourceOperations` - Spending and affordability
  - This modular pattern improves maintainability and should be applied to other large systems
- **Types**: Entity definitions and interfaces
- **Data**: Game data and definitions (organized by category)
- **Utils**: Utility functions and helpers

### Critical Implementation Patterns

1. **Single EventBus Instance** - Always use the GameEngine's EventBus instance throughout the application. Multiple EventBus instances will break event communication.

2. **Unified Component Architecture**:
   - All UI components extend UIComponent base class
   - Components receive GameEngine reference via `setGameEngine()`
   - EventBus access is through GameEngine reference only
   - Use helper methods `emit()` and `subscribe()` for event communication

3. **Event Flow Patterns**:
   - Command events (`action:*`) - UI to Game Core (requests for state changes)
   - State change events (`game:*`) - Game Core to UI (notifications of completed changes)
   - UI events (`ui:*`) - Inter-component communication
   - System events (`turn:*`, `phase:*`) - Between Game Systems (coordination)

4. **State Change Notifications** - When replacing state directly (e.g., when loading a saved game), ensure all listeners are notified properly through `notifyListeners()`.

5. **Event Documentation** - Always document new event types in `/docs/eventbus_design.md` to maintain the registry of events.

## Custom Commands

The `.claude/commands/` directory contains workflow commands:
- `reconcile.md` - Primary command for project state assessment and alignment
- `work.md` - Pick new tasks from roadmap
- `validate.md` - Test UI and check for errors
- Others available for specific workflows

## Recent Learnings and Notes

- At some point, we should use our lovely browser tools to scan /r/MachineLearning, /r/ArtificialIntelligence, /r/singularity, /r/accelerate, etc (.../top/month in each case), to get ideas. The comments there are often very enlightening, and show varied perspectives we may consider
- In general, you must be familiar with *all* foundational docs in project root before touching anything. Exception for this if the user has requested something very specific and narrow, in which case familiarity with just CLAUDE.md may suffice.