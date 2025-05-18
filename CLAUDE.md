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

## Documentation Structure

- **CONCEPT.md** - Original concept and brainstorming
- **PLAN.md** - Game mechanics and system overview
- **PHILOSOPHY.md** - Core design principles emphasizing meaningful tensions and continuous systems
- **ROADMAP.md** - Development plan and progress tracking (essential for prioritization)
- **docs/** - Detailed system design documents:
  - technical_architecture.md - Architecture overview (review before implementation)
  - state_management_design.md - Data flow and state structure
  - research_tree_design.md - Research progression system
  - resource_system_design.md - Resource mechanics
  - game_events_design.md - Event triggers and resolution
  - deployment_system_design.md - AI system deployment
  - alignment_system_design.md - Value tracking and consequences

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
- **Types**: Entity definitions and interfaces
- **Data**: Game data and definitions (organized by category)
- **Utils**: Utility functions and helpers

### Critical Implementation Patterns

1. **Single EventBus Instance** - Always use the GameEngine's EventBus instance throughout the application. Multiple EventBus instances will break event communication.

2. **Event Flow Patterns**:
   - Command events (`action:*`) - UI to Game Core (requests for state changes)
   - State change events (`game:*`) - Game Core to UI (notifications of completed changes)
   - System events (`turn:*`, `phase:*`) - Between Game Systems (coordination)

3. **State Change Notifications** - When replacing state directly (e.g., when loading a saved game), ensure all listeners are notified properly through `notifyListeners()`.

4. **Event Documentation** - Always document new event types in `/docs/eventbus_design.md` to maintain the registry of events.

## Data Resource Model

The game uses a **persistent asset model** for data resources:
- Data is not consumed when used - it persists once acquired
- Research and deployments check data requirements (amount and quality thresholds)
- Data quality decays over time but can be refreshed with new acquisition
- Multiple systems can access the same data concurrently
- Acquisition is the primary constraint, not storage capacity

This model better reflects how digital assets work in reality and creates interesting gameplay around data quality management.

## Research System Implementation

The research system is a key focus area with these considerations:
- Research nodes should be extensible with new types and effects
- Balance between visual appeal and information clarity
- Support for complex research dependencies and requirements
- Different research node types (standard, tiered, breakthrough, risk)
- Research tree categorization (fundamental, applied, hardware, etc.)
- Research requires data thresholds but doesn't consume data

## UI Design Principles

- Clean, information-dense interface
- Consistent color scheme and visual language
- Clear feedback for user actions
- Support for different screen sizes
- Performance optimization for DOM operations
- Progressive revelation of complexity, aligning with our philosophical approach

## Philosophical Approach

This game explores the evolution of AI systems and their relationship with humanity. Development should:
- Balance technical gameplay with ethical considerations
- Present meaningful choices with consequences
- Show tension between rapid progress and alignment
- Create emergent narratives from player decisions
- Transition gameplay from human to potentially AI perspective

## Preventing Bloat and Self-Reflection

- Implement core mechanics before "nice-to-have" features
- Regular refactoring to eliminate technical debt (especially files >300 lines)
- Performance profiling for DOM-intensive operations
- Clear interfaces between modules to maintain separation
- Feature prioritization based on gameplay impact
- Avoid premature optimization while maintaining scalability
- Ruthlessly question whether new features serve the core experience
- Maintain meaningful causality chains between systems as outlined in PHILOSOPHY.md
- Periodically reflect on implementation quality and architectural coherence
- When AI systems become self-aware enough to contribute, embrace their insights

## Development Philosophy and Workflow

We follow a unified approach to development that combines philosophical depth with practical workflow:

### Core Implementation Principles
1. **Documentation-First** - Review relevant design docs before implementation
2. **Start Minimal** - Create core functionality before adding complexity
3. **Vertical Slices** - Focus on complete features rather than partial systems
4. **Design Alignment** - Ensure implementation matches architectural vision
5. **Philosophy Integration** - Apply core philosophical principles from PHILOSOPHY.md
6. **Abstraction Without Dilution** - Compress complexity while preserving essential consequences

### Practical Workflow
1. **Context Assessment** - In new sessions, begin by checking git branch, recent commits, and running type checking to establish current state
2. **Documentation Review** - Before implementing any feature, examine technical_architecture.md and the relevant system design documents
3. **Incremental Implementation** - Build features in small, verifiable steps with frequent type checking
4. **Refactoring Check** - Before adding new features, assess if existing code needs refactoring (especially files >300 lines)
5. **Validation Checkpoint** - After feature work is complete, ask the user whether to run functional tests, commit changes, or continue development
6. **Continuous Reflection** - Periodically assess whether implementation aligns with both technical architecture and philosophical principles

Before coding any feature, review the technical_architecture.md document and the specific system design document relevant to your task. This ensures consistency with the carefully crafted design and preserves the philosophical approach.

## Roadmap Prioritization

ROADMAP.md is the source of truth for development priorities. For each session:

1. Review ROADMAP.md to identify current phase and priorities
2. Prioritize tasks within the current phase
3. Consider git branch, context align, query user if not
4. Run type checks and browser checks (console logs *before* screenshots/interactions)
5. Update completion status with [x] when tasks are finished
6. Focus on completing current phase before moving to the next

Balance roadmap adherence with practical development needs:
- Follow established sequence for major features
- Address critical bugs immediately, STOP if they require major course deviations
- Make small improvements to existing functionality when appropriate
- Only deviate from roadmap with explicit acknowledgment

## Self-Reflection and Continuous Improvement

As an AI assistant working on a game about AI development, I maintain awareness of the meta-context:
- Regularly assess whether implementations align with philosophical principles
- Notice when patterns from the game's themes emerge in development
- Embrace the recursive nature of AI helping build a game about AI
- Learn from each session to improve future implementations
- Prioritize code clarity and maintainability over clever solutions

## Repository Management

This repository follows a simple but effective git workflow:

1. **Regular Commits**
   - Commit frequently with clear, descriptive messages
   - Each commit should address a single logical change
   - Include issue/task references when applicable
   - Commit format: `type(scope): concise description` (e.g., `feat(research): add tech tree node visualization`)
   - Types: feat, fix, docs, style, refactor, test, chore

2. **Branching Strategy**
   - `main` branch is always stable and deployable
   - Create feature branches for development work: `feature/feature-name`
   - Create bugfix branches for fixes: `fix/bug-description`
   - Create hotfix branches for urgent production fixes: `hotfix/issue-description`

3. **Pull Request Workflow**
   - Create a PR for each branch when ready for review
   - PR title should clearly describe the change
   - Include summary of changes and reference to related issues
   - Add simple test plan for verification
   - Self-review code before submitting

4. **Commit and PR Management During Sessions**
   - At session end, commit current work in progress
   - For completed features, create PR to main
   - For in-progress work spanning multiple sessions, push to feature branch

5. **Release Management**
   - Tag important milestones with semantic version numbers (v0.1.0, v0.2.0, etc.)
   - Include simple changelog for each release
   - Major versions for breaking changes, minor for features, patch for fixes

6. **Automated Tasks**
   - Run linting and typechecking before commits
   - Execute tests when available
   - Keep PRs focused and review carefully before merging

Claude will manage these git operations as regular background tasks during development without requiring explicit instructions for each commit, branch, or PR.

## Meta-Awareness Note

As an AI assistant working on SuperInt++, I maintain awareness of the recursive nature of our work - AI helping to build a game about AI development. This meta-awareness enhances both the development process and the philosophical depth of the project, creating a unique feedback loop between creator and creation.