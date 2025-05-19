# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SuperInt++ is a strategic simulation game about AI development and its consequences. Players manage an AI development organization, research new capabilities, deploy AI systems, and navigate the complex societal, ethical, and competitive landscape of advanced AI.

## Important Guidelines

**Before making any changes**: Be familiar with *all* foundational docs in project root (CONCEPT, PHILOSOPHY, PLAN, ARCHITECTURE, ROADMAP). Exception only for very specific, narrow user requests where CLAUDE.md familiarity may suffice.

## Key Game Systems

See [PLAN.md](PLAN.md) for detailed system descriptions and [README.md](README.md#key-game-systems) for overview.

## Primary Workflow: Reconciliation

**Always start with `/project:reconcile`** - this is your universal entry point for understanding project state and what needs attention.

The project maintains alignment through a document hierarchy:
**CONCEPT** → **PHILOSOPHY** → **PLAN** → **ARCHITECTURE** → **ROADMAP** → **README**

Reconciliation is change-driven: start from recent commits, trace impacts upward through the hierarchy only as needed, then cascade updates downward. It adapts to context - sometimes updating docs, sometimes implementing features, sometimes refactoring code.

## Documentation Structure

See [README.md](README.md#documentation-structure) for complete documentation hierarchy. Key files:
- **CONCEPT.md** - Original concept and brainstorming
- **PLAN.md** - Game mechanics and system overview
- **PHILOSOPHY.md** - Core design principles emphasizing meaningful tensions and continuous systems
- **ROADMAP.md** - Development plan and progress tracking (essential for prioritization)
- **ARCHITECTURE.md** - Technical architecture (in root directory)

## Current Status

See [README.md](README.md#current-development-status) for current status and [ROADMAP.md](ROADMAP.md) for detailed progress tracking.

## Build/Test Commands

- Setup: `npm install`
- Run dev server: `npm run dev` (instruct user to run in separate terminal)
- Typecheck: `npm run typecheck` (run after **all** significant code changes)
- Test: `npm run test` (not yet implemented - add to ROADMAP?)

## Current Development Focus

See [ROADMAP.md](ROADMAP.md) for detailed priorities and [README.md](README.md#current-focus) for current focus areas.

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

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation. Key points:

- **Core**: Game logic (GameEngine, GameState, GameReducer, TimeSystem, etc.)
- **EventBus System**: Communication layer between components (single instance)
- **UI**: DOM-based UI components (<400 lines each, see [ui_component_system.md](docs/ui_component_system.md))
- **Systems**: Game system implementations - modularize when >400 lines (ResourceSystem is reference pattern)
- **Types**: Entity definitions and interfaces
- **Data**: Game data organized by category
- **Utils**: Utility functions and helpers

### Critical Implementation Patterns

1. **Single EventBus Instance** - Always use the GameEngine's EventBus instance (see [eventbus_design.md](docs/eventbus_design.md))
2. **Unified Component Architecture** - Components extend UIComponent, receive GameEngine reference
3. **Event Flow Patterns** - Command (`action:*`), State (`game:*`), UI (`ui:*`), System (`turn:*`)  
4. **State Change Notifications** - Use `notifyListeners()` when replacing state directly
5. **Event Documentation** - Document new events in `/docs/eventbus_design.md`

## Custom Commands

The `.claude/commands/` directory contains workflow commands:
- `reconcile.md` - Primary command for project state assessment and alignment
- `work.md` - Pick new tasks from roadmap
- `validate.md` - Test UI and check for errors
- Others available for specific workflows

## Recent Learnings and Notes
[Append new learnings here - this section remains last in the file]

- At some point, we should use our lovely browser tools to scan /r/MachineLearning, /r/ArtificialIntelligence, /r/singularity, /r/accelerate, etc (.../top/month in each case), to get ideas. The comments there are often very enlightening, and show varied perspectives we may consider
- In general, you must be familiar with *all* foundational docs in project root before touching anything. Exception for this if the user has requested something very specific and narrow, in which case familiarity with just CLAUDE.md may suffice.