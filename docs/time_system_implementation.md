# Time System Implementation

This document details the implementation of the dynamic time progression system in SuperInt++.

## Overview

The time system manages in-game temporal progression, representing the accelerating pace of AI development through an innovative dynamic time scale that compresses over the course of gameplay.

## Core Concepts

### Time Compression

As the game progresses and AI research advances, time begins to compress - the same player turn represents increasingly shorter time periods, simulating the accelerating pace of technological development. This creates a sense of increasing momentum and stakes as the game advances.

The time compression is:
- Continuous rather than discrete jumps
- Connected to research progress as a feedback loop
- Progressive in nature, gradually revealing more granular time scales
- Creates tension between short-term and long-term thinking

### Time Scale Progression

The game begins with quarterly turns (approximately 90 days per turn), but as research progresses, this gradually compresses to:
- Monthly turns (approximately 30 days)
- Weekly turns (approximately 7 days)
- Daily turns
- Eventually hourly turns (in late-game advanced scenarios)

This acceleration creates urgency and reflects how AI development might accelerate dramatically at certain capability thresholds.

## Technical Implementation

### GameTime Interface

The time system stores game time in a comprehensive structure:

```typescript
export interface GameTime {
  year: number;           // Current in-game year
  quarter: number;        // Current quarter (1-4)
  month: number;          // Current month (1-12)
  day: number;            // Current day (1-31)
  
  // Time acceleration factors
  timeScale: number;      // Current time scale (days per turn)
  compressionFactor: number; // How much time is compressing
  
  // For tracking overall progression
  daysPassed: number;     // Total days passed in game time
}
```

### TimeSystem Class

The TimeSystem class manages all temporal aspects:
- Advancing time when turns progress
- Calculating compression based on research progress
- Providing human-readable time representation
- Handling date arithmetic (months, years, etc.)
- Tracking turn history

### Compression Mechanics

Time compression increases through:
1. **Regular Research** - Small, incremental increases (5%)
2. **Research Breakthroughs** - Larger jumps in compression (10%)
3. **Specific Technologies** - Certain research nodes might have direct effects on time compression

The general formula is:
```
timeScale = initialTimeScale / compressionFactor
```

As compressionFactor increases, the days per turn decreases, causing time to move faster per player turn.

### Turn History

The system maintains a history of turns, recording:
- The turn number
- The time scale at that turn
- How many days advanced
- The game time snapshot
- Research progress at that point

This enables analysis and visualization of the acceleration over time.

## UI Integration

The time system integrates with the UI in several ways:

1. **TurnControls** - Displays the current date and time scale
2. **GameInfoPanel** - Shows detailed time information
3. **Event System** - Events reference the actual game date
4. **Resource System** - Resource generation scales with game time

## Impact on Game Systems

The dynamic time system affects other game systems:

1. **Research Progress** - Occurs per turn, not per time unit
2. **Resource Generation** - Scaled to represent the appropriate time period
3. **Event Triggers** - Tied to specific dates or thresholds
4. **Competitor Actions** - Paced according to game time, not turn count

## Player Experience

From the player's perspective, the time compression creates an evolving experience:

1. **Early Game** - Slower, strategic decisions on a quarterly basis
2. **Mid Game** - Monthly planning as pace increases
3. **Late Game** - Rapid decision-making as events unfold daily or hourly
4. **End Game** - Potentially real-time-like experience at maximum compression

## Balance Considerations

The time system includes several measures to maintain game balance:

1. **Minimum Time Scale** - Prevents compression from becoming too extreme
2. **Maximum Research Factor** - Caps the total possible compression
3. **Balanced Resource Generation** - Outputs adjusted for time scale
4. **Progressive Challenges** - Events and challenges scale with time compression

## Implementation Roadmap

The full time system implementation will occur in phases:

1. **Phase 1** (Current) - Basic time tracking and compression
2. **Phase 2** - Integration with research system feedback loops
3. **Phase 3** - Advanced temporal events and time-based challenges
4. **Phase 4** - Visual timeline representation and analysis tools

## Conclusion

The dynamic time system is a core mechanic that embodies the philosophical principles of SuperInt++. It creates meaningful feedback loops between player progress and game experience, generates tension between immediate and long-term goals, and metaphorically represents the accelerating nature of technological progress - one of the central themes of the game.