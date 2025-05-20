# SuperInt++ Development Workflow

## Core Development Flow

The development workflow directly mirrors our documentation structure:

```
CONCEPT.md → PLAN.md → ARCHITECTURE.md → WORKFLOW.md → ROADMAP.md → Code
   |            |            |                |              |
  Why          What         How         Process         When        Result
  Vision      Design     Tech Design     Method       Priorities   Implementation
```

## Guiding Principles

1. **Design Flows Downward** - Changes at higher levels cascade to lower levels
2. **Implementation Validates Upward** - Discoveries during implementation may suggest improvements to design
3. **One Source of Truth** - Each concept has exactly one definitive location
4. **Contracts Before Code** - Interfaces and behaviors defined before implementation
5. **Test-Driven Development** - Tests document expected behavior and guide implementation

## Development Process

### 1. Feature Selection (ROADMAP)
- Start with a feature from ROADMAP.md
- Verify alignment with CONCEPT.md vision
- Ensure it fits within the PLAN.md game mechanics

### 2. System Design
- Check if the feature aligns with existing systems in ARCHITECTURE.md
- Define or update needed interfaces for the system
- Document:
  - State structure
  - System interfaces
  - Action/event flow
  - Expected behaviors
- Add TypeScript interfaces to relevant modules
- Ensure interfaces follow patterns in ARCHITECTURE.md

### 3. Test Framework
- Write integration tests first
- Focus on critical behaviors and interactions
- Create test fixtures representing real game states
- Verify tests fail appropriately before implementation

### 4. Implementation
- Build minimal implementation to pass tests
- Focus on correctness before optimization
- Preserve clear system boundaries
- Follow patterns from ARCHITECTURE.md
- Use pure functions for core logic

### 5. UI Development (if needed)
- Implement based on stable system interfaces
- Ensure UI is a pure function of state
- Add interactivity via system actions/events
- Test UI with various state conditions

### 6. Documentation Update
- Update inline documentation
- Note any implementation insights
- Document usage patterns with examples
- Propose any needed changes to core docs

### 7. Review & Merge
- Self-review against design documents
- Address any design/implementation misalignment
- Create pull request with:
  - Reference to ROADMAP item
  - Summary of changes
  - Testing approach
  - Screenshots if visual changes

## System Interface Pattern

All systems follow a consistent interface pattern:

```typescript
interface SystemInterface {
  // Query methods (pure functions with no side effects)
  getState(): ReadonlySystemState;
  getSomeCalculatedValue(): ValueType;
  
  // Command methods (may cause state changes)
  performAction(actionParams: ActionParams): void;
  processEvent(event: SystemEvent): void;
  
  // Lifecycle methods
  initialize(): void;
  update(deltaTime: number): void;
  cleanup(): void;
}
```

## Example System Design Process

### Research System Enhancement

**1. ROADMAP Verification**
- Feature: "Implement research progress decay when paused"
- Check ROADMAP.md priority and dependencies
- Verify alignment with research mechanics in PLAN.md

**2. Interface Definition**
```typescript
// Add to existing ResearchSystem interface
interface ResearchSystem {
  // Existing methods...
  
  // New functionality
  pauseResearch(nodeId: string): void;
  resumeResearch(nodeId: string): void;
  calculateDecayRate(nodeId: string): number; // 1-3% based on turns paused
}

// State structure enhancement
interface ResearchNode {
  // Existing properties...
  pausedAtTurn?: number; // When research was paused
  decayRate?: number;    // Current decay rate
}
```

**3. Test Development**
```typescript
describe('Research Decay', () => {
  test('Research progress decays at 1% after first turn paused', () => {
    // Arrange: Setup research with progress
    gameEngine.dispatch({type: 'START_RESEARCH', nodeId: 'node1'});
    gameEngine.dispatch({type: 'ALLOCATE_COMPUTING', nodeId: 'node1', amount: 10});
    gameEngine.endTurn(); // Make some progress
    const initialProgress = gameEngine.getState().research.nodes.node1.progress;
    
    // Act: Pause research and advance turn
    gameEngine.dispatch({type: 'PAUSE_RESEARCH', nodeId: 'node1'});
    gameEngine.endTurn();
    
    // Assert: Progress decayed by 1%
    const newProgress = gameEngine.getState().research.nodes.node1.progress;
    const expectedProgress = initialProgress * 0.99;
    expect(newProgress).toBeCloseTo(expectedProgress);
  });
  
  // Additional tests for 2% and 3% decay rates...
});
```

**4. Implementation**
- Update ResearchSystem class with new methods
- Modify research reducer to handle pause/resume actions
- Implement turn processing logic for decay calculation
- Ensure all tests pass

**5. UI Updates**
- Add pause/resume buttons to research node UI
- Show decay warning when research is paused
- Display paused status in research tree

**6. Documentation**
- Add JSDoc comments to new methods
- Update any affected documentation
- Note design considerations for decay rate balance

This workflow ensures consistent, high-quality implementation that aligns perfectly with the game design while maintaining clear system boundaries and thorough testing.

## Communication Patterns

### Event Flow

```
User Action → UI Event → System Command → State Change → UI Update
```

### Action Naming Conventions

- `ui:{component}:{action}` - UI-originated events
- `action:{system}:{command}` - Commands to systems
- `game:{entity}:{event}` - Game state notifications
- `system:{name}:{event}` - System-to-system communication

## Regular Process Checkpoints

1. **Start of Feature**
   - Verify ROADMAP priority
   - Check design document alignment
   - Define interfaces and tests

2. **Mid-Implementation**
   - Ensure tests are passing
   - Verify adherence to architecture patterns
   - Address any design questions

3. **Before Pull Request**
   - Complete documentation
   - Run full test suite
   - Self-review code against design