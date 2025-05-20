# Documentation Strategy

This document outlines our balanced approach to documentation, designed to maximize value while minimizing maintenance overhead.

## Core Principles

1. **Code as Primary Documentation**
   - Well-structured code is its own best documentation
   - TypeScript interfaces serve as contracts
   - Tests document expected behavior
   - JSDoc comments provide context

2. **Document Only What Adds Value**
   - Focus on "why" over "what" or "how"
   - Explain non-obvious design decisions
   - Document integration points between systems
   - Clarify complex algorithms or behaviors

3. **Keep Documentation Close to Code**
   - Prefer inline comments for implementation details
   - Use README.md files in directories for system overviews
   - Avoid separate documentation that can drift from implementation

## Documentation Hierarchy

1. **Project Root** (5 core documents)
   - CONCEPT.md - Vision and philosophy
   - PLAN.md - Game mechanics
   - ARCHITECTURE.md - Technical implementation
   - WORKFLOW.md - Development process
   - ROADMAP.md - Development priorities

2. **System-Level** (One README per system directory)
   - Brief system overview
   - Key concepts and terminology
   - Implementation approach
   - Usage examples
   - Integration points

3. **Code-Level** (In source files)
   - TypeScript interfaces with JSDoc
   - Implementation comments for complex logic
   - Decision comments explaining "why"

## System README Template

Each system directory should include a concise README.md (150-300 words):

```markdown
# System Name

## Purpose
Brief explanation of what this system does and why (2-3 sentences)

## Key Concepts
- **Term One**: Definition and purpose
- **Term Two**: Definition and purpose
- **Term Three**: Definition and purpose

## Implementation Approach
- Brief explanation of implementation strategy
- Key design decisions or patterns used
- Performance or scalability considerations

## Usage Examples
```typescript
// Simple example of using this system
gameEngine.dispatch({type: 'SYSTEM_ACTION', param: 'value'});
```

## Integration Points
- System A (description of integration)
- System B (description of integration)
```

## Interface Documentation

TypeScript interfaces should include comprehensive JSDoc comments:

```typescript
/**
 * Represents a research node in the technology tree.
 * 
 * Research nodes are the fundamental unit of progression in the research system,
 * representing technologies that can be researched to unlock new capabilities.
 */
interface ResearchNode {
  /** Unique identifier for the node */
  id: string;
  
  /** Human-readable name of the technology */
  name: string;
  
  /** Detailed description of the technology */
  description: string;
  
  /** Research category (e.g., Foundations, Scaling) */
  category: ResearchCategory;
  
  /** Array of node IDs that must be completed before this node is available */
  prerequisites: string[];
  
  /** 
   * Amount of computing resources required to complete research.
   * @see ResourceSystem.allocateComputing
   */
  computeCost: number;
  
  /** Current research progress (0 to computeCost) */
  progress: number;
  
  /**
   * Current status of the research node
   * - LOCKED: Prerequisites not met
   * - AVAILABLE: Can be started
   * - IN_PROGRESS: Currently being researched
   * - COMPLETED: Research finished
   */
  status: ResearchStatus;
  
  /** 
   * Visual position in the research tree UI
   * @see ResearchTreeView
   */
  position: {x: number, y: number};
}
```

## Implementation Comments

Use comments to explain complex logic or non-obvious decisions:

```typescript
// Calculate decay rate: 1% for first turn paused,
// increasing by 1% each additional turn (max 3%)
function calculateDecayRate(node: ResearchNode, currentTurn: number): number {
  // If not paused or paused this turn, no decay
  if (!node.pausedAtTurn || node.pausedAtTurn === currentTurn) {
    return 0;
  }
  
  // Calculate turns paused (max of 3 for decay purposes)
  // We cap at 3% decay to prevent complete loss of progress
  // on long-paused research, which was frustrating in playtests
  const turnsPaused = Math.min(currentTurn - node.pausedAtTurn, 3);
  return turnsPaused / 100; // 1%, 2%, or 3%
}
```

## Documentation Review

Documentation should be reviewed as part of code review:

1. **Accuracy** - Does it correctly describe the implementation?
2. **Completeness** - Are all non-obvious aspects documented?
3. **Clarity** - Is it understandable to someone unfamiliar with the code?
4. **Necessity** - Does each comment add value?

By following this balanced approach, we create documentation that enables development without becoming a burden, ensuring the codebase remains maintainable and comprehensible as it grows.