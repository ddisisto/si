# SuperInt++

A strategic simulation game about AI development and its consequences. Players manage resources, research new AI capabilities, and navigate the complex landscape of AI development from early foundation models to potentially transformative AGI.

## Concept

SuperInt++ is a simulation game inspired by global strategy games, but focused on artificial intelligence development rather than traditional scenarios. Players start with a basic AI institute and develop increasingly capable AI systems while managing resources, competitors, and global events.

The game is designed around the principle of **abstraction without dilution** - compressing complexity while preserving meaningful consequences. It serves as a lens focused on the essential dynamics of AI development rather than attempting to perfectly simulate reality.

## Current Development Status

The game is in the initial implementation phase. We have completed:

- High-level game concept and mechanics (CONCEPT.md, PLAN.md)
- Philosophical approach to game design (PHILOSOPHY.md)
- Detailed system design documents (in /docs)
- Technical architecture plan (in /docs/technical_architecture.md)
- State management design (in /docs/state_management_design.md)
- Implementation roadmap (ROADMAP.md)
- Project setup with TypeScript and build tools
- Core game engine with event bus and state management
- Resource system infrastructure
- Turn-based progression system
- Basic UI component architecture

The next phase focuses on implementing the research tree visualization system, followed by expanded resource management and deployment systems.

## Key Game Systems

SuperInt++ consists of several interconnected systems:

- **Research System** - Tree-based tech progression with dependencies and strategic choices
- **Resource System** - Management of Computing, Data, Influence, and Funding
- **Deployment System** - Application of AI capabilities in various domains
- **Game Events** - Random and triggered in-game occurrences that impact gameplay
- **Alignment System** - Tracking relationships and value adherence
- **EventBus System** - Core infrastructure for inter-component communication

## Documentation Structure

- **CONCEPT.md** - Original concept and brainstorming
- **PLAN.md** - Game mechanics and system overview
- **PHILOSOPHY.md** - Core design philosophy and principles
- **ROADMAP.md** - Development plan and progress tracking
- **CLAUDE.md** - Implementation guidelines and project context
- **docs/** - Detailed system design documents:
  - technical_architecture.md - Technical architecture overview
  - state_management_design.md - State management approach
  - resource_system_design.md - Resource system mechanics
  - research_tree_design.md - Research progression system
  - game_events_design.md - Game events system design
  - deployment_system_design.md - Deployment system mechanics
  - alignment_system_design.md - Alignment system design

## Getting Started (Future)

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ddisisto/si.git
cd si

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at http://localhost:8080

## Project Structure

```
/src
  /core          # Core game logic (GameEngine, EventBus, GameState, GameStateManager)
  /ui            # UI components and managers (UIManager, UIComponent)
  /systems       # Game systems (ResourceSystem, TurnSystem, TimeSystem)
  /utils         # Utility functions and helpers (Logger)
  /types         # TypeScript types and interfaces
  /data          # Game data (ResearchData, ResourceData)
  index.ts       # Entry point
/public
  /styles        # CSS styles for UI components
  index.html     # HTML template
/docs            # Detailed design documents
```

## Architecture

SuperInt++ uses a modular architecture with unidirectional data flow:

- **Game Engine** - Central system that manages the game loop and updates
- **EventBus System** - Facilitates communication between components
- **Game State** - Immutable state tree tracking all game data
- **State Manager** - Controls state updates via actions and reducers
- **Systems** - Process game logic (research, resources, events, time)
- **UI Components** - DOM-based interface elements organized hierarchically
- **UI Manager** - Coordinates UI components and updates based on state changes
- **Input Handlers** - Process user interactions and dispatch corresponding actions

## Development Roadmap

See [ROADMAP.md](ROADMAP.md) for detailed development plans.

### Current Focus
- Custom positioning system for research tree nodes
- Deployment system implementation
- Enhanced resource management UI
- Event system implementation

### Recently Completed
- Core state management system
- Resource tracking fundamentals
- Turn-based progression mechanics
- Basic UI component architecture
- Comprehensive save/load functionality
- EventBus communication system
- Research tree visualization with category and status filters
- Node interaction system with selection and status indicators
- Smooth zoom and pan controls for research tree navigation
- Modular research data organization and validation

## Contributing

This project is in early planning stages. If you're interested in contributing, please reach out to the project maintainers.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.