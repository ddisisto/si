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
3. **Resource Caps and Scaling**: Basic structure but no progression mechanics
4. **Data Type Categories**: No implementation of specific data types (text, image, synthetic)
5. **Resource Interactions**: No synergy bonuses or conversion mechanics
6. **Resource Balancing**: No implemented balance values or scaling

## Implementation Phases

### Phase 1: Data Types as Tracked Resource (3-4 days)

#### 1.1 Define Data Type Categories
- Create enum for data types (text, image, video, synthetic, behavioral, scientific)
- Add data generation rates and quality metrics
- Implement data storage capacity and management

#### 1.2 Data Acquisition Mechanics
- Create data acquisition events and sources
- Implement deployment-based data generation
- Add data quality progression and degradation

#### 1.3 Update Resource UI
- Expand data section to show types and quality
- Add data type icons and tooltips
- Create data acquisition history view

### Phase 2: Resource Generation System (3-4 days)

#### 2.1 Expand Generation Sources
- Implement infrastructure-based computing generation
- Add deployment revenue generation
- Create partnership resource bonuses
- Add research-based generation improvements

#### 2.2 Create Generation Rate Balancing
- Define base rates per organization type
- Implement scaling formulas
- Add efficiency multipliers

#### 2.3 Update Turn Processing
- Expand GENERATE_RESOURCES to handle all sources
- Add generation breakdown UI
- Create income/expense statements

### Phase 3: Resource Allocation UI (3-4 days)

#### 3.1 Create Allocation Controls
- Build computing allocation sliders
- Add drag-and-drop allocation interface
- Create preset allocation templates

#### 3.2 Implement Resource Trading
- Add influence conversion mechanics
- Create funding allocation options
- Build resource exchange UI

#### 3.3 Add Visual Feedback
- Create allocation flow diagrams
- Add real-time effect previews
- Implement allocation warnings/suggestions

### Phase 4: Resource Caps and Scaling (2-3 days)

#### 4.1 Implement Cap System
- Add progressive cap increases
- Create soft cap diminishing returns
- Implement cap upgrade mechanics

#### 4.2 Add Scaling Mechanics
- Create exponential scaling for late game
- Add resource overflow handling
- Implement efficiency bonuses

#### 4.3 Balance Pass
- Define resource values for all game phases
- Test progression curves
- Add difficulty modifiers

### Phase 5: Integration and Polish (2-3 days)

#### 5.1 Resource Event Integration
- Connect to event system for resource modifications
- Add resource-based event triggers
- Create resource shortage events

#### 5.2 Performance Optimization
- Optimize resource calculations
- Add caching for expensive operations
- Implement efficient state updates

#### 5.3 Documentation and Testing
- Document resource formulas
- Create resource system tests
- Update game documentation

## Technical Implementation Details

### Data Types Structure
```typescript
enum DataType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  SYNTHETIC = 'synthetic',
  BEHAVIORAL = 'behavioral',
  SCIENTIFIC = 'scientific'
}

interface DataResource {
  types: Record<DataType, DataTypeInfo>;
  totalCapacity: number;
  usedCapacity: number;
  quality: number;
  acquisitionHistory: DataAcquisition[];
}

interface DataTypeInfo {
  amount: number;
  quality: number;
  sources: string[];
  generationRate: number;
}
```

### Resource Generation Formula
```typescript
generation = baseRate * organizationMultiplier * efficiencyMultiplier * researchBonus * infrastructureLevel
```

### Allocation System
- Computing: Percentage-based allocation to activities
- Funding: Budget allocation to categories
- Influence: Action-based spending
- Data: Assignment to research/deployment slots

## First Implementation Steps

1. **Update GameState Types**
   - Add DataType enum and related interfaces
   - Expand ResourceState with new properties
   - Update ResourceCost interface

2. **Implement Data Type System**
   - Create data type generation mechanics
   - Add data acquisition actions
   - Update ResourceSystem to handle data types

3. **Update Resource Panel UI**
   - Expand data section for type display
   - Add allocation controls foundation
   - Create generation breakdown view

4. **Implement Basic Generation**
   - Add multiple generation sources
   - Create generation rate calculations
   - Update turn processing

## References

- [Resource System Design](./resource_system_design.md)
- [Technical Architecture](./technical_architecture.md)
- [State Management Design](./state_management_design.md)