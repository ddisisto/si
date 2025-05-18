# Data Model Implementation Checklist

Quick reference for transitioning from consumption to persistent asset model.

## Immediate Changes (Priority Order)

### 1. Remove Consumption Mechanics
- [ ] Delete `consumeDataType()` method from ResourceSystem
- [ ] Remove data consumption from `spendResources()` method
- [ ] Update `canAfford()` to check requirements, not costs

### 2. Update Type Definitions
- [ ] Add `decayRate` field to DataTypeInfo interface
- [ ] Add `storageSize` field to DataTypeInfo interface  
- [ ] Add `inUse` array to track active users of data
- [ ] Create DataRequirement interface for threshold checking

### 3. Implement Quality Decay
- [ ] Add decay logic to GENERATE_RESOURCES action
- [ ] Define MIN_QUALITY constant (suggest 0.1)
- [ ] Set default decay rates for each data type

### 4. Update Resource System Methods
- [ ] Create `checkDataAccess()` method to replace consumption
- [ ] Create `markDataInUse()` method for tracking usage
- [ ] Create `releaseDataUsage()` method for cleanup
- [ ] Update `addDataType()` to handle quality refresh

### 5. Fix GameReducer Actions
- [ ] Update SPEND_RESOURCES to not reduce data amounts
- [ ] Add quality decay to GENERATE_RESOURCES
- [ ] Handle storage capacity without consumption

### 6. Update UI Components
- [ ] Change "cost" language to "requires" in ResourcePanel
- [ ] Add quality decay indicators
- [ ] Show storage pressure visually
- [ ] Update tooltips to explain persistent model

### 7. Update Documentation
- [ ] Update resource_system_design.md
- [ ] Update resource_system_implementation_plan.md
- [ ] Add notes to CLAUDE.md about data model
- [ ] Update any research node descriptions

## Testing Checklist

- [ ] Verify data persists after research starts
- [ ] Confirm quality decays each turn
- [ ] Test concurrent research using same data
- [ ] Verify storage limits work correctly
- [ ] Check UI correctly shows requirements

## Code Snippets for Quick Reference

### New DataRequirement Interface
```typescript
export interface DataRequirement {
  minAmount: number;
  minQuality: number;
  description?: string;
}
```

### Updated canAfford Check
```typescript
// Old (consumption)
if (costs.data?.types) {
  for (const [type, amount] of Object.entries(costs.data.types)) {
    if (resources.data.types[type].amount < amount) {
      return false;
    }
  }
}

// New (requirements)
if (costs.data?.requirements) {
  for (const [type, req] of Object.entries(costs.data.requirements)) {
    const typeData = resources.data.types[type];
    if (typeData.amount < req.minAmount || typeData.quality < req.minQuality) {
      return false;
    }
  }
}
```

### Quality Decay in Generate Resources
```typescript
const MIN_QUALITY = 0.1;
const newQuality = Math.max(
  MIN_QUALITY,
  currentTypeData.quality - (currentTypeData.decayRate || 0.01)
);
```

## Remember
- Data is now an **asset**, not a **consumable**
- Focus on **access requirements**, not costs
- Quality management becomes a key gameplay element
- Storage is the limiting factor, not data availability