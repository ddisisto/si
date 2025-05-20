# SuperInt++ Test Plan

This document outlines the testing strategy for SuperInt++, based on lessons learned from the EventBus architecture refactor and save/load debugging.

## Testing Philosophy

Following the project's philosophical principles:
- **Simple > Complex**: Start with basic tests that catch common issues
- **Pragmatic > Perfect**: Focus on high-value tests that prevent real bugs
- **Continuous Improvement**: Add tests as we discover issues

## Test Categories

### 1. Type Safety (Currently Implemented ✅)
- TypeScript compilation with `npm run typecheck`
- Catches type mismatches and missing properties
- Zero runtime cost

### 2. Unit Tests (High Priority)
Focus on pure functions and isolated components:
- GameReducer actions
- Resource calculations
- Research tree logic
- Utility functions

### 3. Integration Tests (Critical)
Test interactions between systems:
- **Event Flow Tests**: Verify event chains work correctly
  - Example: `action:save` → `game:saved` → UI update
- **State Management**: Verify state updates propagate correctly
- **Save/Load Cycle**: Test full save → load → verify state

### 4. Component Tests
Test UI components in isolation:
- UIComponent lifecycle (mount, unmount, event cleanup)
- Event subscription/emission patterns
- State updates trigger re-renders

### 5. End-to-End Tests (Future)
Simulate real user workflows:
- Start new game → Research → Save → Load → Continue
- Turn progression with resource generation
- Research completion and unlocking

## Priority Test Areas

Based on recent debugging experience:

### 1. EventBus Tests (Critical)
```typescript
describe('EventBus Integration', () => {
  it('should handle save event flow correctly', () => {
    // Test: action:save → GameEngine → GameStateManager → game:saved
  });
  
  it('should update UI after save', () => {
    // Test: game:saved event triggers SaveLoadPanel refresh
  });
  
  it('should handle wildcard subscriptions', () => {
    // Test: action:* catches all action events
  });
});
```

### 2. Save/Load Tests (High)
```typescript
describe('Save/Load System', () => {
  it('should save game state to localStorage', () => {
    // Test: GameStateManager.saveState creates proper save
  });
  
  it('should emit events after save', () => {
    // Test: game:saved event is emitted
  });
  
  it('should restore state correctly', () => {
    // Test: Load restores all state properties
  });
});
```

### 3. State Management Tests (High)
```typescript
describe('State Management', () => {
  it('should notify listeners on state change', () => {
    // Test: State changes trigger subscriber callbacks
  });
  
  it('should handle concurrent actions', () => {
    // Test: Action queue processes correctly
  });
});
```

## Test Implementation Strategy

### Phase 1: Foundation (Immediate)
1. Set up Jest or Vitest test framework
2. Create test utilities for:
   - Mock EventBus
   - Mock GameState
   - Test data factories
3. Write critical integration tests for save/load

### Phase 2: Core Coverage (Next Sprint)
1. Unit tests for GameReducer
2. EventBus flow tests
3. Resource system calculations
4. Research unlock logic

### Phase 3: UI Testing (Future)
1. Component lifecycle tests
2. Event handling tests
3. DOM manipulation tests

## Testing Standards

### 1. Test Structure
```typescript
describe('SystemName', () => {
  describe('methodName', () => {
    it('should do expected behavior when given input', () => {
      // Arrange
      const input = createTestData();
      
      // Act
      const result = system.method(input);
      
      // Assert
      expect(result).toEqual(expected);
    });
  });
});
```

### 2. Event Testing Pattern
```typescript
it('should emit correct events', () => {
  const eventBus = new EventBus();
  const spy = jest.fn();
  
  eventBus.subscribe('event:name', spy);
  
  // Trigger action
  eventBus.emit('action:trigger', data);
  
  // Verify event chain
  expect(spy).toHaveBeenCalledWith(expectedData);
});
```

### 3. State Testing Pattern
```typescript
it('should update state correctly', () => {
  const initialState = createInitialState();
  const action = { type: 'ACTION_TYPE', payload: data };
  
  const newState = gameReducer(initialState, action);
  
  expect(newState).not.toBe(initialState); // Immutability
  expect(newState.property).toEqual(expected);
});
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run typecheck
      - run: npm test
      - run: npm run lint (when added)
```

## Test Coverage Goals

- **Phase 1**: 30% coverage focusing on critical paths
- **Phase 2**: 60% coverage including unit tests
- **Phase 3**: 80% coverage with UI tests

Focus on:
1. Event flow paths
2. State management
3. Save/load functionality
4. Resource calculations
5. Turn progression

## Anti-Patterns to Avoid

1. **Testing Implementation Details**: Test behavior, not internals
2. **Brittle DOM Tests**: Use data attributes for test selectors
3. **Over-Mocking**: Only mock external dependencies
4. **Slow Tests**: Keep unit tests under 10ms each

## Roadmap Items to Add

1. **Immediate Priority**
   - Set up Jest/Vitest test framework
   - Create test utilities and mocks
   - Write save/load integration tests
   
2. **Next Sprint**
   - EventBus flow tests
   - GameReducer unit tests
   - Resource system tests
   
3. **Future**
   - Component lifecycle tests
   - E2E test framework (Playwright/Cypress)
   - Performance benchmarks

## Success Metrics

- Catch bugs before production
- Reduce debugging time
- Increase confidence in refactoring
- Document expected behavior
- Enable safer rapid development

## Conclusion

Testing should enable, not hinder development. Start with high-value tests that catch real issues we've encountered (like the save/load event flow). Build testing habits gradually and focus on tests that give the most confidence for the least effort.