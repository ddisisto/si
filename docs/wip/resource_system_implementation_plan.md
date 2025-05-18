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
1. **Data Persistent Asset Model**: Transition from consumption to persistent model
2. **Quality Decay System**: Data quality degradation over time
3. **Concurrent Data Access**: Multiple systems using same data
4. **Resource Generation Sources**: Infrastructure, deployments, partnerships
5. **Resource Allocation UI**: No interactive controls for allocation
6. **Resource Interactions**: No synergy bonuses or conversion mechanics
7. **Resource Balancing**: No implemented balance values or scaling

## Implementation Phases

### Phase 1: Data Persistent Asset Model Implementation (3-4 days)

#### 1.1 Refactor Data Model Core
- Remove `consumeDataType()` method from ResourceSystem
- Update `canAfford()` to check requirements instead of consuming
- Create `checkDataAccess()` method for threshold checking
- Add `markDataInUse()` and `releaseDataUsage()` methods
- Remove storage capacity constraints from data model

#### 1.2 Implement Quality Decay System
- Add `decayRate` field to DataTypeInfo interface
- Implement turn-based quality degradation in GENERATE_RESOURCES
- Define minimum quality constants for each data type
- Create quality refresh mechanics from new data acquisition
- Add quality improvement through data curation

#### 1.3 Update Data Access Mechanics
- Create DataRequirement interface with minAmount and minQuality
- Update ResourceRequirements to use persistent model
- Implement concurrent access tracking with `inUse` array
- Update UI to show "requires" instead of "costs"
- Add visual indicators for data quality decay

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

### Data Types Structure (Persistent Model)
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
  quality: number; // Overall quality multiplier
  acquisitionHistory: DataAcquisition[];
  tiers: Record<string, boolean>;
  specializedSets: Record<string, boolean>;
}

interface DataTypeInfo {
  amount: number;
  quality: number;
  decayRate: number;      // Quality loss per turn
  sources: string[];
  generationRate: number;
  inUse: string[];        // Systems currently accessing this data
  lastUpdated: number;    // Turn when last refreshed
}

interface DataRequirement {
  minAmount: number;
  minQuality: number;
}
```

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

## First Implementation Steps

1. **Remove Consumption Model Code**
   - Delete `consumeDataType()` method from ResourceSystem
   - Remove data consumption from GameReducer SPEND_RESOURCES
   - Update all references to data consumption

2. **Update Type Definitions**
   - Add `decayRate` and `inUse` fields to DataTypeInfo
   - Create DataRequirement interface
   - Update ResourceRequirements to use new model
   - Remove storage capacity fields

3. **Implement Quality Decay**
   - Add quality decay to GENERATE_RESOURCES action
   - Define MIN_QUALITY constants for each data type
   - Create quality refresh logic in data acquisition

4. **Update Access Checking**
   - Modify `canAfford()` for threshold checking
   - Create `checkDataAccess()` method
   - Implement concurrent access tracking

5. **Update UI Components**
   - Change "cost" to "requires" in all data-related displays
   - Add quality indicators and decay warnings
   - Update tooltips to explain persistent model

## References

- [Resource System Design](./resource_system_design.md)
- [Technical Architecture](./technical_architecture.md)
- [State Management Design](./state_management_design.md)