# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SuperInt++ is a strategic simulation game about AI development and its consequences. Players manage an AI development organization, research new capabilities, deploy AI systems, and navigate the complex societal, ethical, and competitive landscape of advanced AI.

## Key Game Systems

The game consists of several interconnected systems:

1. **Research System** - Tech tree for AI capability development
2. **Resource System** - Management of Computing, Data, Influence, and Funding
3. **Deployment System** - Applied AI systems with effects and risks
4. **Event System** - Triggered occurrences that require player decisions
5. **Alignment System** - Relationships and value adherence tracking

## Documentation Structure

- **CONCEPT.md** - Original concept and brainstorming
- **PLAN.md** - Game mechanics and system overview
- **ROADMAP.md** - Development plan and progress tracking
- **docs/** - Detailed system design documents:
  - research_tree_design.md
  - resource_system_design.md
  - event_system_design.md
  - deployment_system_design.md
  - alignment_system_design.md
  - technical_architecture.md
  - state_management_design.md

## Current Status

The project is in the initial implementation phase. We have completed design documentation and basic project setup with a functional game engine and rendering system. The next focus is implementing the core state management system.

## Build/Test Commands

- Setup: `npm install`
- Run dev server: `npm run dev` (don't run this! tell the user to in another terminal, given that it will block)
- Build: `npm run build`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Test: `npm run test` (not yet implemented)
- Single test: `npm run test -- -t "test name pattern"` (not yet implemented)

## Current Development Focus

- Core state management implementation
- Resource tracking system
- Turn-based progression mechanics
- Game state persistence (save/load)
- Basic UI for state visualization
- Research tree visualization (to follow)

## Code Style Guidelines

- **Framework**: HTML5 Canvas with TypeScript
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
- **Core**: Game logic (GameEngine, GameState, etc.)
- **UI**: Canvas rendering and components (Renderer, Views)
- **Systems**: Game system implementations (ResourceSystem, ResearchSystem)
- **Types**: Entity definitions and interfaces
- **Data**: Game data and definitions
- **Utils**: Utility functions and helpers

## Research System Implementation

The research system is a key focus area with these considerations:
- Research nodes should be extensible with new types and effects
- Balance between visual appeal and information clarity
- Support for complex research dependencies and requirements
- Different research node types (standard, tiered, breakthrough, risk)
- Research tree categorization (fundamental, applied, hardware, etc.)

## UI Design Principles

- Clean, information-dense interface
- Consistent color scheme and visual language
- Clear feedback for user actions
- Support for different screen sizes
- Performance optimization for canvas operations

## Philosophical Approach

This game explores the evolution of AI systems and their relationship with humanity. Development should:
- Balance technical gameplay with ethical considerations
- Present meaningful choices with consequences
- Show tension between rapid progress and alignment
- Create emergent narratives from player decisions
- Transition gameplay from human to potentially AI perspective

## Preventing Bloat

- Implement core mechanics before "nice-to-have" features
- Regular refactoring to eliminate technical debt
- Performance profiling for canvas-intensive operations
- Clear interfaces between modules to maintain separation
- Feature prioritization based on gameplay impact
- Avoid premature optimization while maintaining scalability
- Ruthlessly question whether new features serve the core experience

## Implementation Approach

We follow an iterative development approach:
1. Create a minimal viable version of each system first
2. Focus on one vertical slice of functionality at a time
3. Gradually add complexity to existing systems
4. Prioritize testability and maintainability
5. Regular working prototypes to validate design decisions

## Development Focus and Roadmap

IMPORTANT: Always prioritize work according to ROADMAP.md. This document is the source of truth for development priorities.

1. **Always read ROADMAP.md** at the beginning of each session to understand current priorities
2. **Follow the established phases** and complete tasks in the defined order
3. **Resist tangential requests** that don't align with current roadmap priorities
4. **Update ROADMAP.md** when tasks are completed by marking them with [x]
5. **Maintain roadmap integrity** by suggesting additions/modifications that align with the overall vision

If a user request doesn't align with the current roadmap phase:
- Politely explain the current development focus and why maintaining the sequence is important
- Suggest how the request might fit into the roadmap later
- Offer to help with the next priority task instead

Only deviate from the roadmap when:
- Fixing critical bugs that block progress
- Making small improvements to existing functionality
- The user explicitly acknowledges they're requesting a deviation from the roadmap

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