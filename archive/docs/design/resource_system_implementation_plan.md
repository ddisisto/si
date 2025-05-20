# Resource System Implementation Plan

This document outlines the detailed implementation plan for refining the resource system in SuperInt++, focusing on data types integration, resource generation, and allocation UI.

## Current Implementation Status

### ✅ Already Implemented:
1. **Core Resource Types**: Computing, Funding, Influence, Data
2. **Basic Resource Tracking**: State structure and GameReducer actions
3. **Resource System Class**: Basic allocation, deallocation, and spending
4. **Resource Panel UI**: Display of resource values with detailed/simple views
5. **Computing Allocation**: Basic allocation and deallocation mechanics
6. **Influence Generation**: Basic growth based on organization type
7. **Turn-based Resource Updates**: Resources generated at turn start

### ⚠️ Partially Implemented:
1. **Data Types as a Resource**: Structure exists but no generation/acquisition mechanics
2. **Resource Effects**: Framework exists but not fully integrated with deployments/research
3. **Resource Generation**: Only basic implementation, missing sources from deployments

### ❌ Missing Implementation:
1. **Resource Generation Sources**: Infrastructure, deployments, partnerships
2. **Resource Allocation UI**: No interactive controls for allocation
3. **Resource Interactions**: No synergy bonuses or conversion mechanics
4. **Resource Balancing**: No implemented balance values or scaling

## Implementation Phases

### Phase 1: Resource Generation System (3-4 days)

#### 1.1 Expand Generation Sources
- Implement infrastructure-based computing generation
- Add deployment revenue generation
- Create partnership resource bonuses
- Add research-based generation improvements

#### 1.2 Create Generation Rate Balancing
- Define base rates per organization type
- Implement scaling formulas
- Add efficiency multipliers

#### 1.3 Update Turn Processing
- Expand GENERATE_RESOURCES to handle all sources
- Add generation breakdown UI
- Create income/expense statements

### Phase 2: Resource Allocation UI (3-4 days)

#### 2.1 Create Allocation Controls
- Build computing allocation sliders
- Add drag-and-drop allocation interface
- Create preset allocation templates

#### 2.2 Implement Resource Trading
- Add influence conversion mechanics
- Create funding allocation options
- Build resource exchange UI

#### 2.3 Add Visual Feedback
- Create allocation flow diagrams
- Add real-time effect previews
- Implement allocation warnings/suggestions

### Phase 3: Resource Caps and Scaling (2-3 days)

#### 3.1 Implement Cap System
- Add progressive cap increases
- Create soft cap diminishing returns
- Implement cap upgrade mechanics

#### 3.2 Add Scaling Mechanics
- Create exponential scaling for late game
- Add resource overflow handling
- Implement efficiency bonuses

#### 3.3 Balance Pass
- Define resource values for all game phases
- Test progression curves
- Add difficulty modifiers

### Phase 4: Integration and Polish (2-3 days)

#### 4.1 Resource Event Integration
- Connect to event system for resource modifications
- Add resource-based event triggers
- Create resource shortage events

#### 4.2 Performance Optimization
- Optimize resource calculations
- Add caching for expensive operations
- Implement efficient state updates

#### 4.3 Documentation and Testing
- Document resource formulas
- Create resource system tests
- Update game documentation

## Technical Implementation Details

### Data Types Structure (Already Implemented)
The persistent data model has been implemented. See `src/types/systems/ResourceCost.ts` and `src/types/core/GameState.ts` for current interfaces.

### Resource Generation Formula
```typescript
generation = baseRate * organizationMultiplier * efficiencyMultiplier * researchBonus * infrastructureLevel
```

### Data Quality Decay Formula
```typescript
newQuality = Math.max(MIN_QUALITY, currentQuality - decayRate)
// MIN_QUALITY = 0.1 (data never becomes completely unusable)
// decayRate varies by data type (0.01-0.05 per turn)
```

### Quality Refresh Mechanics
- Adding new data of same type increases quality (weighted average)
- Active curation can slow decay rate
- Research output may generate high-quality synthetic data
- Minimum quality threshold ensures data remains somewhat useful

### Allocation System
- Computing: Percentage-based allocation to activities
- Funding: Budget allocation to categories
- Influence: Action-based spending
- Data: Persistent asset, accessed by reference not allocation

## References

- [Resource System Design](./resource_system_design.md)
- [Technical Architecture](./technical_architecture.md)
- [State Management Design](./state_management_design.md)