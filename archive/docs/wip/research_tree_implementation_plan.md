# Research Tree Implementation Plan

This document outlines the detailed implementation plan for the research tree visualization system in SuperInt++, expanding on the high-level design in [Research Tree Design](./research_tree_design.md).

## Overview

The research tree visualization is a core gameplay mechanic that allows players to view, interact with, and manage their AI research progress. This implementation will focus on creating a visually appealing, intuitive, and functionally rich interface for the research tree.

## Philosophical Alignment

Following the principles in PHILOSOPHY.md:

1. **Continuous > Categorical** - Research progress will be visualized as continuous percentages rather than discrete states, with smooth transitions between states.

2. **Progressive Revelation** - The interface will reveal complexity gradually, starting with basic nodes and connections, then revealing deeper mechanics as players progress.

3. **Anti-maximization Design** - Multiple valid research paths will be visually reinforced, avoiding "obvious best choices" through layout and design.

4. **Meaningful Causality Chains** - Visual connections between nodes will clearly illustrate dependencies and effects.

5. **Metaphor-mechanic Coherence** - The research visualization will reflect real AI development processes through its structure and progression patterns.

## Implementation Phases

### Phase 1: Data Structure and Foundation (1 week)

1. **Research Node Data Models**
   - [x] Define TypeScript interfaces for research nodes
   - [x] Implement data structures for tracking node status
   - [x] Create node category and relationship models
   - [x] Define positioning coordinates system
   - [x] Add data requirements and deployment integration interfaces

2. **Sample Data Creation**
   - [x] Develop initial set of research nodes for testing
   - [x] Create connections and prerequisites
   - [x] Set up realistic research progression paths
   - [x] Implement cost structures and dependencies
   - [ ] Add sample node positions and layout

3. **Research State Integration**
   - [x] Connect research data to game state
   - [x] Implement state update patterns for research
   - [x] Create selectors for accessing research data

### Phase 2: Basic Rendering System (1 week)

1. **Research Panel Component**
   - [x] Create base container for research visualization
   - [x] Implement layout grid system
   - [x] Add zoom and pan controls

2. **Node Rendering**
   - [x] Create basic node component
   - [x] Implement node type styling
   - [x] Add status indicators (locked, available, in-progress, completed)
   - [x] Implement basic node template system

3. **Connection Visualization**
   - [x] Create connection rendering between nodes
   - [x] Implement different connection types (prerequisite, exclusion)
   - [x] Add directional indicators
   - [x] Handle connection routing to avoid overlaps

### Phase 3: Interaction System (1 week)

1. **Node Selection and Highlighting**
   - [x] Implement hover effects for nodes
   - [x] Create selection mechanism
   - [x] Add highlight for related nodes (prerequisites, unlocks)
   - [x] Implement focus animations

2. **Node Information Display**
   - [x] Create detailed node information panel
   - [ ] Implement tooltips for quick information
   - [x] Add progress indicators for in-progress research
   - [x] Show resource requirements and effects

3. **Research Actions**
   - [x] Implement start research action
   - [x] Create compute allocation interface
   - [x] Add cancel research functionality
   - [x] Implement research completion events

4. **Event Handling Improvements**
   - [x] Fix event binding to ensure nodes are clickable
   - [x] Implement proper event cleanup
   - [x] Ensure consistent event handling across renders
   - [x] Add navigation between main view and research tree

### Phase 4: Advanced Visualization Features (1 week)

1. **Zoom and Pan Controls**
   - [x] Implement smooth zooming
   - [x] Add panning with drag and edge scrolling
   - [ ] Create mini-map for navigation
   - [ ] Add focus controls for different tree sections

2. **Category Visualization**
   - [x] Implement color coding for categories
   - [x] Create category filters/toggles
   - [x] Add visual separation between categories
   - [x] Implement category headers and labels

3. **Node Status Visualization**
   - [x] Create progress bars for research in progress
   - [x] Implement visual effects for completed research
   - [x] Add animations for status transitions
   - [x] Create special indicators for breakthrough nodes

### Phase 5: Custom Positioning and Polish (2 weeks)

1. **Positioning Mode**
   - [ ] Implement edit mode toggle
   - [ ] Create drag-and-drop node positioning
   - [ ] Add grid snapping functionality
   - [ ] Implement position saving and loading

2. **Visual Polish**
   - [ ] Refine node appearance and styling
   - [ ] Improve connection rendering
   - [ ] Add transitions and animations
   - [ ] Implement special effects for key nodes

3. **Performance Optimization**
   - [ ] Implement virtual rendering for large trees
   - [ ] Optimize rendering for different zoom levels
   - [ ] Add level-of-detail control
   - [ ] Test and optimize for different tree sizes

## Technical Approach

### Component Structure

```
/src
  /ui
    /components
      /research
        ResearchTreeView.ts     - Main container component with integrated rendering
        index.ts                - Component exports
  /systems
    ResearchSystem.ts           - Research progression logic
  /types
    Research.ts                 - Research data types
  /data
    ResearchData.ts             - Initial research tree data
    /research                   - Modular research data organization
```

> **Note:** The component structure has been simplified from the original plan. Instead of separate components for nodes, connections and controls, these have been integrated into the ResearchTreeView component for better performance and simpler state management. This approach reduces DOM complexity and improves rendering efficiency.

### State Management

The research tree will follow the application's overall state management pattern:

1. **State Structure**
   - Research nodes in a normalized structure
   - Active research tracking
   - Completion status
   - Node positioning data

2. **Actions**
   - `START_RESEARCH` - Begin researching a node
   - `ALLOCATE_COMPUTE` - Assign computing to research
   - `COMPLETE_RESEARCH` - Mark research as complete
   - `UPDATE_RESEARCH_PROGRESS` - Track progress updates
   - `SET_NODE_POSITION` - Update visual positioning

3. **Events**
   - `action:start_research` - UI request to start research
   - `game:research_started` - Notification that research began
   - `game:research_progress` - Progress update
   - `game:research_completed` - Research completion
   - `ui:research_view_focus` - Focus the view on specific node

### Rendering Approach

The research tree uses DOM-based rendering with:

1. **Positioned Elements** - Absolute positioning for precise node placement
2. **SVG Connections** - SVG paths for connections between nodes with bezier curves
3. **HTML Components** - Nodes as interactive DOM elements with event delegation
4. **CSS Transitions** - Smooth state changes and animations
5. **Optimized DOM** - Flattened DOM structure for better performance
6. **Z-Index Management** - Careful stacking context management for UI elements like dropdowns
7. **Transform-based Zoom/Pan** - CSS transforms for efficient zooming and panning

## Integration Points

1. **Resource System** - Computing allocation and requirements
2. **Event System** - Research-triggered events
3. **Turn System** - Progress updates during turns
4. **UI Manager** - Component registration and updates
5. **Game State** - Research state storage and updates

## Research Data Organization

To improve maintainability and scalability, the research data should be reorganized into a more modular structure. This will allow for easier management of the growing research tree and better support for adding new nodes.

### Proposed Structure

```
/src
  /data
    /research
      index.ts               - Main export for all research data
      categories.ts          - Category and subcategory definitions
      nodeTypes.ts           - Node type definitions and common properties
      /categories
        foundations.ts       - Basic nodes for Foundations category
        scaling.ts           - Basic nodes for Scaling category
        capabilities.ts      - Basic nodes for Capabilities category
        infrastructure.ts    - Basic nodes for Infrastructure category
        agency.ts            - Basic nodes for Agency category
        alignment.ts         - Basic nodes for Alignment category
      /nodes
        transformerArchitecture.ts  - Individual significant nodes
        mixtureOfExperts.ts
        billionParameterModels.ts
        recursiveSelfImprovement.ts
        // More individual node files
```

### Implementation Plan

1. **Data Structure Refactoring**
   - Create category-specific files with basic nodes
   - Extract significant nodes into individual files
   - Implement a consistent export pattern for all nodes
   - Ensure backward compatibility during transition

2. **Schema Validation**
   - Add runtime validation for node data
   - Create TypeScript utility types for node validation
   - Implement warning system for invalid node data

3. **Documentation**
   - Create examples for adding new node types
   - Document the organization structure
   - Add README for research data management

4. **Data Management Tools**
   - Consider creating dev tools for node visualization and editing
   - Add node dependency validation scripts
   - Implement test cases for node data integrity

## Next Steps

1. Complete the research tree visualization implementation
2. Implement the research data reorganization
3. Update the ROADMAP.md with detailed implementation tasks
4. Create the custom positioning system for research nodes

## References

- [Research Tree Design](./research_tree_design.md)
- [Technical Architecture](./technical_architecture.md)
- [Resource System Design](./resource_system_design.md)
- [State Management Design](./state_management_design.md)