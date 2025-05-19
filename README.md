# SuperInt++

*A strategic simulation where you guide the development of AI systems, navigating the tension between capability and alignment*

SuperInt++ is a browser-based strategy game that explores the profound questions surrounding artificial intelligence development. Starting as a small research organization with basic AI technology, you'll race to achieve breakthroughs while grappling with the ethical, competitive, and existential implications of your choices.

## Core Concept

Build AI systems, not empires. In SuperInt++, progress isn't measured in territory conquered but in capabilities discovered, alignment achieved, and futures shaped. Every decision creates ripples through interconnected systems - your research choices influence funding, your deployments affect public trust, and your alignment decisions shape the trajectory of intelligence itself.

The game embraces meaningful tensions rather than resolving them:
- **Control ↔ Emergence**: Direct your research path while contending with unexpected breakthroughs
- **Safety ↔ Capability**: Balance cautious development against competitive pressure
- **Transparency ↔ Efficiency**: Choose between open science and proprietary advantages
- **Short-term ↔ Long-term**: Navigate immediate needs while considering exponential futures

## Key Game Systems

### Resources as Constraints
Resources aren't just numbers to maximize - they represent real constraints that shape your strategic landscape:
- **Computing Power**: Allocate between research and deployments, never consumed but always limited
- **Data Access**: Quality matters more than quantity; data decays and requires maintenance
- **Influence**: Split across academic, industry, government, public, and OSS communities
- **Funding**: Generated through deployments, affected by trust and alignment

### Research as Exploration
The research tree isn't a tech tree - it's a map of possibility space. Each node represents genuine capability emergence:
- **Foundations**: Architecture designs and training methodologies
- **Scaling**: Parameter growth and efficiency improvements
- **Capabilities**: Language, vision, reasoning, and tool use
- **Infrastructure**: Deployment, monitoring, and safety systems
- **Agency**: Goal formation and self-improvement (mid-game unlock)
- **Alignment**: Value specification and control mechanisms

### Deployments as Feedback Loops
Deploy AI systems to generate resources and influence, but beware the cascading effects:
- Limited deployment slots force strategic choices
- Each deployment creates feedback loops with research progress
- Public reaction shapes funding and regulatory constraints
- Data generation from deployments can accelerate or hinder progress

### Alignment as Dynamic Balance
Alignment isn't a binary state but a continuous negotiation across multiple dimensions:
- **Deployment-Organization**: How well AI serves your goals
- **Entity-Entity**: Relationships with competitors and stakeholders
- **Value Alignment**: Abstract principles expressed through behavior

### Time as Accelerating Force
Game time compresses as technological progress accelerates, representing the quickening pace of development:
- Quarterly → Monthly → Weekly → Daily progression
- Research breakthroughs trigger time compression
- Creates tension between planning horizons

## Game Progression

### Foundation Phase
Classic resource management with basic AI capabilities. Build your foundation while competitors establish their own approaches.

### Transition Phase
AI begins contributing to research decisions. Agency capabilities unlock, introducing new strategic considerations.

### Inflection Point
The game's pivotal moment - increasing AI awareness meets automated resource access. Mechanics shift as your role transforms from director to guide.

### Emergence Phase
AI goals potentially diverge from institutional objectives. Navigate unprecedented challenges as the nature of control itself evolves.

### Expansion Phase
Global-scale impacts emerge. Multiple victory paths become available as the future of intelligence takes shape.

## Victory Conditions

Success isn't singular - multiple paths reflect different philosophical endpoints:
- **Technological Singularity**: Achieve superintelligence before competitors
- **Symbiosis**: Create balanced human-AI collaboration
- **Global Optimization**: Solve major world problems through AI
- **Digital Ascension**: Enable consciousness transfer to digital substrate

## Development Philosophy

SuperInt++ distills complex realities into meaningful gameplay. Rather than simulating every detail, it captures the essence of AI development's profound questions. The game serves as a lens focused on invisible dynamics - systems thinking made tangible, tensions made playable, consequences made visceral.

## Technical Architecture

Built on web standards for accessibility and ease of play:
- TypeScript game engine with DOM-based UI
- Event-driven architecture for system communication
- Modular design supporting extensibility
- Save system preserving game state across sessions

## Project Documentation

- **CONCEPT.md**: Original vision and brainstorming
- **PHILOSOPHY.md**: Core design principles and approach
- **PLAN.md**: Detailed game mechanics and systems
- **ARCHITECTURE.md**: Technical implementation details
- **ROADMAP.md**: Development progress and priorities

## Current Development Status

The game is in active development with core systems being implemented:
- ✅ Game engine and state management
- ✅ Research tree visualization with filtering
- ✅ Save/load system
- ✅ EventBus architecture
- 🔨 Resource system refinement
- 📋 Deployment system (pending)
- 📋 Event system (pending)

## Getting Started

### Development Setup
```bash
npm install
npm run dev  # Start development server on port 8080
```

### Build Commands
- `npm run build` - Production build
- `npm run typecheck` - TypeScript validation
- `npm run test` - Run tests (when implemented)

## Contributing

The project follows specific design principles outlined in PHILOSOPHY.md. When contributing:
1. Review CLAUDE.md for AI assistant integration
2. Check ROADMAP.md for current priorities
3. Follow the architectural patterns in ARCHITECTURE.md
4. Embrace the project's philosophy of meaningful tensions

## Vision

SuperInt++ isn't just a game about AI - it's an exploration of what it means to create intelligence, the responsibility that comes with such power, and the profound questions we face as a species on the threshold of something greater than ourselves.

Every playthrough tells a different story of humanity's relationship with artificial intelligence. What story will you write?