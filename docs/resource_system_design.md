# Resource System Design

This document outlines the resource system for SuperInt++, defining resource types, mechanics, balancing, and implementation details.

## Resource System Overview

The resource system is a fundamental game mechanic that drives player decision-making, creates strategic constraints, and measures progress. Resources represent the various assets and capabilities required to develop and deploy AI systems.

### Design Goals

1. **Meaningful Tradeoffs** - Force players to make strategic allocation decisions
2. **Clear Progression** - Show advancement through increasing resource capacity
3. **Balanced Economy** - Create a stable system that scales throughout gameplay
4. **Strategic Depth** - Support various valid strategies through resource management
5. **Intuitive Design** - Easy to understand but with depth for mastery

## Resource Types

### 1. Computing Power

Represents raw computational capacity available to the player.

**Key Characteristics:**
- Allocated rather than spent (assigned to activities)
- Primary constraint on research and deployment speed
- Can be reallocated with minor penalties
- Scales throughout the game

**Generation Sources:**
- Base value from organization type
- Infrastructure investments
- Partner agreements
- Research advancements
- Deployment revenue

**Usage:**
- Research progression
- Model deployment
- Internal operations
- Special projects

### 2. Data Access

Represents the quality and quantity of data available for training and validation.

**Key Characteristics:**
- Tiered system (public, specialized, proprietary, surveillance)
- Not consumed but may have usage restrictions
- Quality matters as much as quantity
- Some is permanent, some temporary

**Generation Sources:**
- Initial organization assets
- Partnerships and agreements
- User data from deployments
- Research breakthroughs
- Special events

**Usage:**
- Required for specific research paths
- Enhances deployment effectiveness
- Improves model quality
- Unlocks special capabilities

### 3. Influence

Represents social capital, reputation, and leverage with different groups.

**Key Characteristics:**
- Subdivided into multiple domains:
  - Academic (research community)
  - Industry (commercial partners)
  - Government (regulatory bodies)
  - Public (general population)
  - OSS Community (open source contributors)
- Can be spent or invested
- Affected by decisions and events
- Both enables actions and passively affects outcomes

**Generation Sources:**
- Organization type provides initial distribution
- Successful deployments
- Research publications
- Events and decisions
- Partnerships and collaborations

**Usage:**
- Unlock special actions
- Mitigate negative events
- Access restricted resources
- Form strategic partnerships
- Influence public and policy discourse

### 4. Funding

Represents financial resources available to the organization.

**Key Characteristics:**
- Spent and accumulated
- Relatively straightforward
- Buffer against setbacks
- Enables infrastructure expansion

**Generation Sources:**
- Initial organization backing
- Deployment revenue
- Investments and grants
- Partnerships
- Intellectual property

**Usage:**
- Infrastructure expansion
- Hiring and team growth
- Special projects
- Crisis management
- Competitor actions

## Resource Mechanics

### Resource Flow

1. **Generation Phase** - Resources accumulated from various sources
2. **Allocation Phase** - Player distributes resources to activities
3. **Effect Phase** - Resources produce outcomes based on allocation
4. **Adjustment Phase** - Events and decisions modify resource state

### Allocation System

- Computing power distributed as percentages
- Minimum thresholds for basic operations
- Bonuses for concentrated allocation
- Penalties for frequent reallocation
- Special allocation options unlock through research

### Resource Caps and Scaling

- Initial caps based on organization type
- Increase through research and infrastructure
- Soft caps (diminishing returns) vs. hard caps
- Different resources scale at different rates
- Late-game transformational changes to resource dynamics

### Resource Interaction

- Computing amplifies data effectiveness
- Influence can be converted to other resources
- Funding enables computing expansion
- Data quality affects research efficiency
- Synergy bonuses for balanced allocation

## Balance Considerations

### Early Game

- Limited computing (20-50 units)
- Basic data access (public tier)
- Low but focused influence
- Modest funding (sufficient for basic operations)
- Clear, straightforward choices

### Mid Game

- Expanded computing (100-500 units)
- Multiple data tiers accessible
- Growing influence across domains
- Increasing funding needs and sources
- More complex allocation decisions

### Late Game

- Large-scale computing (1000+ units)
- Comprehensive data access
- Significant influence in multiple domains
- Substantial funding with major investments
- Potentially automated resource management

### Organization Type Effects

| Organization | Computing | Data | Influence | Funding | Special |
|--------------|-----------|------|-----------|---------|---------|
| Academic Lab | Low | Medium | High (Academic) | Low | Research bonus |
| Startup | Medium | Low | Low | Medium | Agility bonus |
| Big Tech | High | High | High (Industry) | High | Deployment bonus |
| Government | Medium | High | High (Government) | Medium | Stability bonus |
| OSS Project | Low | Medium | High (OSS) | Low | Collaboration bonus |

## UI Design

### Resource Display

- Persistent resource bar at top of interface
- Numerical and graphical representation
- Color coding by resource type
- Tooltips with detailed information
- Trend indicators showing changes

### Allocation Interface

- Slider-based allocation for computing
- Tiered selection for data access
- Action buttons for influence spending
- Budget-style interface for funding
- Visual feedback on allocation effects

### Visualization

- Resource flow diagrams
- Income and expenditure breakdowns
- Historical trends and projections
- Comparative metrics vs. competitors
- Alert indicators for critical levels

## Implementation Approach

### Data Structure

```typescript
interface ResourceState {
  computing: {
    total: number;
    allocated: Record<string, number>; // activity ID -> amount
    cap: number;
    generation: number;
  };
  data: {
    tiers: Record<string, boolean>; // tier ID -> access status
    specializedSets: Record<string, boolean>; // set ID -> access status
    quality: number;
  };
  influence: {
    academic: number;
    industry: number;
    government: number;
    public: number;
    openSource: number;
  };
  funding: {
    current: number;
    income: number;
    expenses: number;
    reserves: number;
  };
}
```

### Resource System Class

```typescript
class ResourceSystem {
  // Core resource state
  private state: ResourceState;
  
  // Methods
  public allocateComputing(allocations: Record<string, number>): boolean;
  public generateResources(): void;
  public canAfford(costs: ResourceCost): boolean;
  public spend(costs: ResourceCost): boolean;
  public getResourceEffects(): ResourceEffects;
  public handleEvent(event: GameEvent): void;
  public getResourceState(): ResourceState;
}
```

### Integration Points

- **Research System** - Resource costs and effects
- **Deployment System** - Resource generation and allocation
- **Event System** - Resource modifications and special options
- **UI System** - Display and interaction
- **Game State** - Persistence and game progression

## Next Steps

1. Define detailed resource balance values
2. Create resource UI mockups
3. Implement basic resource tracking
4. Design resource generation algorithms
5. Create allocation interface prototype