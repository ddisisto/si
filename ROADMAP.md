# SuperInt++ Development Roadmap

This document outlines the development plan for SuperInt++, tracking both planning and implementation phases.

## Roadmap Usage

This roadmap is the authoritative source for development priorities. All development work should:

1. Focus on completing the current (usually the deepest nested) phase before moving to the next
2. Complete sections, or shift remaining items down to a more appropriate place if not urgent
3. Complete tasks in the order they are listed within each phase, reorder with explicit approval
4. Mark tasks as completed by changing `[ ]` to `[x]` when they are done, or [-] for deferred / won't do (with comment)
5. Add new subtasks as needed, maintaining the overall structure
6. Document implementation details and decisions in code and documentation
7. Whether designing or coding, documenting or testing, try to embrace the philosophy of the project. The project's success rides on this more than you know.

The roadmap will be updated as development progresses to reflect new priorities, insights, and completed work.

## Phase 0: Pre-Implementation Planning

### Game Design Documentation
- [x] Initial concept development (CONCEPT.md)
- [x] Basic game mechanics planning (PLAN.md)
- [x] Complete research tree design (docs/design/research_tree_design.md)
  - [x] Design all research categories
  - [x] Create node structure
  - [x] Define dependency framework
- [x] Resource system design (docs/design/resource_system_design.md)
  - [x] Define resource types and mechanics
- [x] Game events design (docs/design/game_events_design.md)
  - [x] Create event categories and types
  - [x] Design event triggers and conditions
- [x] Deployment system design (docs/design/deployment_system_design.md)
  - [x] Define deployment types
  - [x] Design deployment mechanics
- [x] Alignment system design (docs/design/alignment_system_design.md)
  - [x] Define alignment dimensions
  - [x] Design alignment mechanics

### Technical Planning
- [x] Technical architecture design (ARCHITECTURE.md)
- [x] Finalize project structure
- [x] Define core data structures and interfaces
- [x] Design state management approach (docs/state_management_design.md)
- [x] Establish coding standards and patterns
- [x] Plan testing approach and framework # Implementation tracked in Phase 5

## Phase 1: Core Engine Implementation

### Project Setup (2 weeks)
- [x] Initialize project with TypeScript and build tools
- [x] Set up development environment
- [x] Create basic HTML/CSS structure
- [x] Implement canvas initialization
- [x] Create game loop architecture

### Game State Management (3 weeks)
- [x] Implement core state management
- [x] Create resource tracking system
- [x] Implement turn-based progression
- [x] Design and implement saving/loading
  - [x] Manual save/load functionality
  - [x] Auto-save system
  - [x] Save data management
  - [x] EventBus communication architecture
- [x] Add basic UI for state display

### Research Tree Visualization (4 weeks)
- [x] Create research tree foundation
  - [x] Define research node data structures
  - [x] Create sample research data
  - [x] Implement state integration for research
  - [x] Create research action types
- [x] Implement node rendering system
  - [x] Create ResearchTreeView component
  - [x] Implement ResearchNode component
  - [x] Design basic node styling
  - [x] Create node status indicators
- [x] Create connection visualization
  - [x] Implement SVG connection lines
  - [x] Create directional arrows
  - [x] Handle different connection types
  - [x] Add connection styling based on status
- [x] Add interaction handling
  - [x] Implement hover effects
  - [x] Create click selection
  - [x] Build node information panel
  - [x] Add research action UI
  - [x] Fix event binding for research nodes
  - [x] Implement navigation between main view and research tree
- [x] Implement visualization controls
  - [x] Add zooming functionality
  - [x] Create panning controls
  - [x] Implement category filters with compact dropdowns
  - [x] Add status filters for research nodes
  - [x] Create focus/navigation controls

### Research Data Organization (2 weeks)
- [x] Refactor research data structure
  - [x] Create category-based data files
  - [x] Extract significant nodes to individual files
  - [x] Implement consistent export pattern
  - [x] Ensure backward compatibility
- [x] Implement data validation
  - [x] Add runtime schema validation
  - [x] Create TypeScript validation types
  - [x] Add warning system for invalid data
- [x] Create documentation
  - [x] Document node creation process
  - [x] Add examples for different node types
  - [x] Create README for data organization

## Phase 2: Core Gameplay Systems

### ✅ COMPLETED: EventBus & Logging Improvements
**Completed in 1 week**
- [x] Improve EventBus error handling and debugging
  - [x] Add comprehensive error context to event dispatches
  - [x] Implement event chain tracing for debugging  
  - [x] Add development mode with verbose event logging
  - [x] Create EventBus health check tools
- [x] Consolidate logging approach
  - [x] Replace `console.log` with Logger consistently
  - [x] Add log levels to filter noise in production
  - [x] Create log configuration system
  - [x] Add performance timing to key operations
  - [x] Implement log persistence for debugging
- [x] Document event flows  
  - [x] Document all existing events in eventbus_design.md
  - [x] Add inline documentation to event emitters/listeners
  - [x] Create debugging guide for event-related issues
  - [x] Add EventBus-centric logging strategy to ARCHITECTURE.md

### ✅ FIXED: Turn End Research Processing Error
**Fixed in:** [PR #19](https://github.com/ddisisto/si/pull/19)  
**Error:** "Cannot read properties of undefined (reading 'computeAllocated')"  
**Impact:** Turn processing fails when research nodes have undefined computed values
**Resolution:** 
- [x] Debug research node state on turn:end event
- [x] Fix undefined computeAllocated reference  
- [x] Add defensive checks for node properties
- [x] Test turn processing with active research

### Resource System Refinement (1 week)
**Dependencies:** EventBus improvements (for better event handling)  
**Implementation Plan:** See [Resource System Implementation Plan](docs/design/resource_system_implementation_plan.md) for detailed phases and tasks  
- [ ] Create comprehensive resource generation system
- [ ] Build resource allocation UI
- [ ] Add influence and funding mechanics
- [ ] Integrate with event and deployment systems
- [ ] Add compute resource sub-types (training, inference)
- [ ] Implement base system level upgrades

### Deployment System - Foundation (3 weeks)
**Dependencies:** Resource System (needs data type tracking)
- [ ] Create deployment slot management
- [ ] Implement basic deployment data structures
- [ ] Add deployment effects on resources
- [ ] Create deployment management UI
- [ ] Implement data generation from deployments (refiner mechanic)
  - [ ] Computing + data deployments produce better quality data
  - [ ] May increase decay rate of source data
  - [ ] Different deployment types generate different data
- [ ] Build deployment-resource feedback loops

### Research System Implementation (3 weeks)
**Dependencies:** Resource System (complete), Deployment System (foundation)
- [ ] Implement research progress tracking
- [ ] Create research completion effects
- [ ] Add prerequisites checking
- [ ] Implement resource costs (including data requirements)
- [ ] Create research notifications
- [ ] Add data type requirements for research nodes
- [ ] Implement research boost mechanics from deployments

### Deployment System - Advanced (1 week)
**Dependencies:** Research System
- [ ] Add research category boost effects from deployments
- [ ] Create deployment-research feedback visualization
- [ ] Implement deployment unlocking via research
- [ ] Add deployment visualization on world map

### Basic Event System (3 weeks)
**Dependencies:** Resource System, Research System, Deployment System
- [ ] Implement event triggering framework
- [ ] Create event resolution UI
- [ ] Add basic event pool
- [ ] Implement event effects on game state
- [ ] Create deployment-triggered events
- [ ] Add research-triggered events

## Phase 3: Expanded Gameplay Features

### Competitor AI (3 weeks)
- [ ] Implement AI organization tracking
- [ ] Create competitor decision-making
- [ ] Add competitor progress visualization
- [ ] Implement organization interactions

### Global Influence Map (3 weeks)
- [ ] Create world map visualization
- [ ] Implement influence tracking by region
- [ ] Add deployment influence visualization
- [ ] Create regional events and effects

### Alignment System (4 weeks)
- [ ] Implement multi-dimensional alignment tracking
- [ ] Create alignment effects on gameplay
- [ ] Add alignment visualization
- [ ] Implement alignment-related events

### Game Progression Phases (3 weeks)
- [ ] Implement phase transition mechanics
- [ ] Create phase-specific gameplay elements
- [ ] Add UI changes for different phases
- [ ] Implement win/loss conditions

## Phase 4: Polish and Refinement

### UI Enhancement (3 weeks)
- [ ] Refine visual design
- [ ] Improve interaction feedback
- [ ] Add transitions and animations
- [ ] Implement responsive design
- [x] Refactor UI controls for consistency
  - [x] Create reusable button component system with HTML + CSS approach
  - [x] Modularize CSS into component-specific files
  - [x] Standardize control styling across the application
  - [x] Create UI component documentation
  - [x] Review element classes for alignment with styling
- [ ] Custom research node positioning

### Audio Implementation (2 weeks)
- [ ] Add sound effects
- [ ] Implement background music
- [ ] Create audio management system

### Tutorial and Help (2 weeks)
- [ ] Create tutorial system
- [ ] Write help documentation
- [ ] Implement tooltips and hints
- [ ] Add onboarding experience

## Phase 5: Launch and Post-Launch

### Code Quality and Refactoring (1 week)
- [x] Refactor large files into smaller, modular components
  - [x] Refactor ResearchTreeView.ts (1064 lines) into smaller components
  - [x] Split ResourceSystem.ts (802 lines) into smaller modules
  - [x] Break down GameReducer.ts (850 lines) into category-specific reducers
- [ ] Identify and break down files likely to grow over time
- [ ] Improve architectural clarity (e.g., proper UIComponent usage)
- [ ] Remove unused code and redundant CSS
- [ ] Ensure consistent component patterns across the codebase

### Testing Infrastructure (2 weeks)
- [ ] Set up Jest or Vitest test framework
- [ ] Create test utilities for mocking (EventBus, GameState)
- [ ] Write critical save/load integration tests
- [ ] Add EventBus flow tests
- [ ] Create GameReducer unit tests
- [ ] Set up GitHub Actions for automated testing
- [ ] Document testing patterns and best practices

### Release Preparation (2 weeks)
- [ ] Final testing and bug fixing
- [ ] Performance optimization
- [ ] Browser compatibility testing
- [ ] Create deployment pipeline

### Initial Release
- [ ] Deploy to hosting platform
- [ ] Monitor performance and issues
- [ ] Gather user feedback

### Post-Launch Support
- [ ] Address critical bugs
- [ ] Implement small enhancements based on feedback
- [ ] Plan for feature expansion

## Deferred Balancing

These tasks require functioning systems to balance properly and will be addressed after core systems are implemented:

### Research Balancing
- [ ] Balance research costs and effects
- [ ] Test concurrent data access functionality
- [ ] Add research integration with data requirements

### Resource Balancing
- [ ] Define resource generation rates
- [ ] Balance resource costs for research/deployment
- [ ] Define resource caps and scaling

### Event Balancing
- [ ] Write event text and choices
- [ ] Balance event probability and impact

### Deployment Balancing
- [ ] Balance deployment costs and effects

### Alignment Balancing
- [ ] Balance alignment costs and effects

### General Balancing (Phase 4)
- [ ] Playtest and gather feedback
- [ ] Adjust game difficulty
- [ ] Balance research progression
- [ ] Fine-tune resource economy

## Next Steps
1. ✅ COMPLETED: EventBus improvements and logging consolidation
2. ✅ FIXED: Critical turn end research processing error
3. ✅ FIXED: Research nodes not loading into game state (visual display issue remains)
4. Move to Resource System refinement implementation
5. Build Deployment System foundation on improved resource system
6. Implement Research System with full data type support