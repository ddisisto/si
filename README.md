# SuperInt++

A strategic simulation game about AI development and its consequences. Players manage resources, research new AI capabilities, and navigate the complex landscape of AI development from early foundation models to potentially transformative AGI.

## Concept

SuperInt++ is a simulation game inspired by global strategy games, but focused on artificial intelligence development rather than traditional scenarios. Players start with a basic AI institute and develop increasingly capable AI systems while managing resources, competitors, and global events.

## Current Development Status

The game is in pre-implementation planning phase. We have completed the following:

- High-level game concept and mechanics (CONCEPT.md, PLAN.md)
- Detailed system design documents (in /docs)
- Technical architecture plan (in /docs/technical_architecture.md)
- Implementation roadmap (ROADMAP.md)

The next phase will involve setting up the development environment and implementing the core engine.

## Key Game Systems

SuperInt++ consists of several interconnected systems:

- **Research System** - Tree-based tech progression with dependencies and strategic choices
- **Resource System** - Management of Computing, Data, Influence, and Funding
- **Deployment System** - Application of AI capabilities in various domains
- **Event System** - Random and triggered events that impact gameplay
- **Alignment System** - Tracking relationships and value adherence

## Documentation Structure

- **CONCEPT.md** - Original concept and brainstorming
- **PLAN.md** - Game mechanics and system overview
- **ROADMAP.md** - Development plan and progress tracking
- **CLAUDE.md** - Implementation guidelines and project context
- **docs/** - Detailed system design documents

## Getting Started (Future)

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/superint.git
cd superint

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at http://localhost:9000

## Planned Project Structure

```
/src
  /core          # Core game logic (GameEngine, GameState)
  /ui            # UI rendering and components (Renderer, Views)
  /systems       # Game systems (ResourceSystem, ResearchSystem)
  /utils         # Utility functions (InputHandler)
  /types         # TypeScript types and interfaces
  /data          # Game data (ResearchTree, ResourceData)
  index.ts       # Entry point
  index.html     # HTML template
```

## Planned Architecture

SuperInt++ will use a modular architecture:

- **Game Engine** - Central system that manages the game loop and updates
- **Game State** - Tracks all game data (resources, research, turn)
- **Systems** - Process game logic (research, resources, events)
- **Renderer** - Handles all drawing to the HTML5 canvas
- **UI Manager** - Organizes UI components and layout
- **Research Tree** - Force-directed graph visualization for tech progression

## Development Roadmap

See [ROADMAP.md](ROADMAP.md) for detailed development plans.

### Current Focus
- Complete pre-implementation planning
- Research tree design and balancing
- Core engine architecture implementation

## Contributing

This project is in early planning stages. If you're interested in contributing, please reach out to the project maintainers.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.