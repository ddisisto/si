# Data Model Transition Plan

This document outlines the transition from a consumption-based data model to a persistent asset model for the SuperInt++ resource system.

## Current Implementation (Consumption Model)

### What's Been Built
1. **DataType enum**: Six categories (text, image, video, synthetic, behavioral, scientific)
2. **DataTypeInfo interface**: Tracks amount, quality, sources, generation rate
3. **Storage system**: `totalCapacity` and `usedCapacity` tracking
4. **Consumption mechanics**: `consumeDataType()` method that reduces data amounts
5. **Generation mechanics**: Data generated per turn, added to stockpile
6. **Quality tracking**: Weighted average when new data is added

### Problems with Current Model
- Unrealistic for digital assets
- Contradicts the persistent nature of data
- Creates artificial scarcity that doesn't match the theme
- Makes concurrent research unnecessarily complex

## Target Implementation (Persistent Asset Model)

### Core Concepts
1. **Data as Infrastructure**: Once collected, data persists unless disrupted
2. **Access Thresholds**: Research requires minimum amounts/quality, but doesn't consume
3. **Quality Dynamics**: Data quality degrades over time, fresh data maintains relevance
4. **Capacity Management**: Storage limits create meaningful constraints
5. **Concurrent Access**: Multiple systems can use the same data simultaneously

### New Mechanics
1. **Quality Decay**
   - Each data type has a decay rate
   - Quality decreases gradually each turn
   - Fresh data collection maintains/improves quality

2. **Access Requirements**
   - Research nodes specify minimum data thresholds
   - Format: "Requires 1000 text data with quality ≥ 0.7"
   - Data is checked but not consumed

3. **Storage Pressure**
   - Data occupies storage based on type and amount
   - Different data types may have different storage costs
   - Exceeding capacity limits new data collection

4. **Event Vulnerability**
   - Data can be lost to cyberattacks, regulations, etc.
   - Quality can be compromised by misinformation campaigns
   - Access can be restricted by legal/ethical concerns

## Transition Steps

### Phase 1: Core Refactoring
1. **Remove consumption mechanics**
   - Delete `consumeDataType()` method
   - Remove data amount reduction from `SPEND_RESOURCES` action
   - Update ResourceCost interface to use "requirements" instead of "costs"

2. **Implement quality decay**
   - Add `decayRate` to DataTypeInfo
   - Create turn-based quality degradation
   - Implement quality floor (minimum quality)

3. **Update access checking**
   - Modify `canAfford()` to check thresholds without consumption
   - Add concurrent access tracking
   - Implement "data in use" indicators

### Phase 2: Storage System Enhancement
1. **Differentiated storage costs**
   - Add `storageSize` to DataTypeInfo
   - Video data takes more space than text
   - Synthetic data might be more efficient

2. **Capacity management**
   - Implement overflow prevention
   - Add data archival/compression options
   - Create infrastructure scaling for storage

3. **UI updates**
   - Show "access requirements" instead of "costs"
   - Display quality decay indicators
   - Add storage pressure warnings

### Phase 3: Advanced Features
1. **Data curation mechanics**
   - Active quality maintenance through curation
   - Data cleaning and validation processes
   - Synthetic data generation for quality improvement

2. **Event system integration**
   - Data loss events (cyberattacks, disasters)
   - Quality degradation events (misinformation)
   - Access restriction events (regulations)

3. **Strategic depth**
   - Data redundancy for protection
   - Quality vs. quantity trade-offs
   - Specialized data collection strategies

## Code Changes Required

### 1. Update ResourceCost Interface
```typescript
export interface ResourceCost {
  computing?: number;
  funding?: number;
  influence?: Partial<Record<keyof InfluenceResource, number>>;
  data?: {
    requirements?: Partial<Record<DataType, DataRequirement>>;
    tiers?: Record<string, boolean>;
    specializedSets?: Record<string, boolean>;
  };
  recurring?: boolean;
}

export interface DataRequirement {
  minAmount: number;
  minQuality: number;
}
```

### 2. Update DataTypeInfo
```typescript
export interface DataTypeInfo {
  amount: number;
  quality: number;
  sources: string[];
  generationRate: number;
  decayRate: number;      // New field
  storageSize: number;    // New field  
  inUse: string[];        // New field - tracks what's using this data
  lastUpdated: number;
}
```

### 3. Remove consumeDataType Method
- Delete the method entirely
- Replace with `checkDataAccess()` method
- Update all references to consumption

### 4. Implement Quality Decay
```typescript
// In GENERATE_RESOURCES action
Object.values(DataType).forEach(type => {
  const currentTypeData = updatedDataTypes[type];
  if (currentTypeData) {
    // Apply quality decay
    const newQuality = Math.max(
      MIN_QUALITY,
      currentTypeData.quality - currentTypeData.decayRate
    );
    
    // Apply generation
    const newAmount = currentTypeData.amount + currentTypeData.generationRate;
    
    updatedDataTypes[type] = {
      ...currentTypeData,
      amount: newAmount,
      quality: newQuality,
      lastUpdated: action.payload.turn
    };
  }
});
```

### 5. Update Documentation
- Resource system design document
- Implementation plan
- Research tree design (to reflect data requirements)
- Update ROADMAP with new approach

## Benefits of New Model

1. **Realism**: Matches how digital data actually works
2. **Strategic Depth**: Quality management adds new decisions
3. **Clarity**: Easier to understand "requirements" vs "consumption"
4. **Flexibility**: Allows concurrent research naturally
5. **Theme Alignment**: Better fits the AI development narrative

## Timeline

- **Week 1**: Core refactoring and basic quality decay
- **Week 2**: Storage system enhancements
- **Week 3**: Event integration and advanced features
- **Testing**: Ongoing throughout transition

## Risks and Mitigation

1. **Save Game Compatibility**
   - Create migration script for existing saves
   - Version the save format
   - Provide clear upgrade path

2. **Balance Disruption**
   - Carefully tune decay rates
   - Test research progression thoroughly
   - Gather feedback on difficulty changes

3. **UI Confusion**
   - Clear messaging about the change
   - Update all tooltips and help text
   - Provide visual indicators for new mechanics

## Next Steps

1. Review this plan with stakeholders
2. Create detailed task breakdown
3. Begin Phase 1 implementation
4. Update all relevant documentation
5. Communicate changes to users clearly