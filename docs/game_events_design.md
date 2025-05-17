# Event System Design

This document outlines the event system for SuperInt++, defining event types, triggers, effects, and mechanics.

## Event System Overview

The event system injects dynamism, narrative, and challenge into gameplay through triggered occurrences that require player response. Events create interesting decisions, unexpected situations, and serve as feedback for player actions.

### Design Goals

1. **Narrative Enhancement** - Build the game's story through emergent events
2. **Strategic Depth** - Create meaningful decisions with consequences
3. **Feedback Mechanism** - Respond to player actions and strategies
4. **Pacing Control** - Break up standard gameplay with varied situations
5. **World Building** - Establish the game world through event content

## Event Categories

### 1. Research Events

Related to technological advancement and discoveries.

**Examples:**
- Unexpected breakthrough
- Research setback
- Competitor discovery
- External collaboration opportunity
- Ethical dilemma in research direction

### 2. Organizational Events

Related to the player's institution or company.

**Examples:**
- Staff disputes
- Funding changes
- Leadership challenges
- Facility issues
- Partnership opportunities

### 3. External Events

Originating from outside the player's direct control.

**Examples:**
- Global technology regulations
- Market shifts
- Public perception changes
- Competitor actions
- International incidents

### 4. Deployment Events

Related to AI systems in the field.

**Examples:**
- Unexpected deployment behavior
- User feedback
- System vulnerabilities
- Usage pattern changes
- Integration challenges

### 5. Emergent Events (Late Game)

Arise from advanced AI capabilities.

**Examples:**
- AI-initiated actions
- Emergent capabilities
- Novel AI behaviors
- System cooperation phenomena
- Autonomy incidents

## Event Structure

Each event contains:

- **ID** - Unique identifier
- **Title** - Brief descriptive name
- **Description** - Full explanation of the situation
- **Category** - Primary classification
- **Trigger Conditions** - Requirements for the event to occur
- **Choices** - Player response options
- **Effects** - Game state changes from the event and choices
- **Follow-up Events** - Potential future events that may be triggered
- **Weight** - Base probability of occurrence when conditions are met
- **Tags** - Metadata for filtering and categorization

## Event Mechanics

### Triggering System

Events can be triggered by:

1. **Time-based** - Occur after specific number of turns or game progress
2. **State-based** - Triggered when game state meets certain conditions
3. **Action-based** - Response to specific player actions
4. **Random** - Chance-based triggers with weighting
5. **Sequential** - Follow-up events from previous occurrences

### Probability Factors

Event likelihood is affected by:

- Base weight of the event
- Player decisions and game state
- Previous event history
- Research path choices
- Deployment strategies
- Organization type
- Risk tolerance settings

### Resolution System

When an event occurs:

1. Event details presented to player
2. Player selects from available choices
3. Immediate effects applied to game state
4. Follow-up flags or timers set if applicable
5. Event recorded in history log

### Event Chains

Some events form sequences:

- **Linear Chains** - Direct sequence of related events
- **Branching Chains** - Different paths based on choices
- **Condition Chains** - Events triggered by combinations of factors
- **Emergent Chains** - Complex interactions between game systems

## Choice Design

Choices should generally:

1. Offer meaningful alternatives with different strengths
2. Have both immediate and delayed consequences
3. Connect to the player's strategy and values
4. Reveal varying amounts of information
5. Occasionally include hidden options based on game state

**Choice Categories:**
- **Resource tradeoffs** - Gain one resource at cost of another
- **Risk management** - Safe vs. high-risk/high-reward options
- **Ethical decisions** - Value-based tradeoffs
- **Strategic direction** - Commit to particular approaches
- **Relationship management** - Balance different stakeholders

## Effect Types

Events can modify:

- **Resources** - Add or subtract from resource pools
- **Research** - Speed up, slow down, or unlock research options
- **Deployments** - Affect existing deployments or create opportunities
- **Relationships** - Change influence levels with different groups
- **Game Rules** - Modify mechanics temporarily or permanently
- **Special Assets** - Grant unique advantages or disadvantages

## Event Pool Management

### Event Selection Algorithm

1. Filter available events based on current game state
2. Apply probability weighting modified by:
   - Game phase
   - Player actions
   - Previous events
   - Research status
   - Risk settings
3. Select event(s) for the current turn
4. Track event frequency to prevent repetition

### Event Distribution

- Target frequency varies by game phase
- Major events separated by quieter periods
- Crisis events can cluster for narrative tension
- Similar events spaced out for variety
- Balance positive, negative, and neutral events

## Implementation Approach

### Data Structure

```typescript
interface EventChoice {
  id: string;
  text: string;
  effects: EventEffect[];
  requirements?: Condition[];
  visibilityRequirements?: Condition[];
}

interface EventEffect {
  type: EffectType;
  target: string;
  value: number | string | boolean;
  duration?: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  triggers: Trigger[];
  choices: EventChoice[];
  weight: number;
  minTurn?: number;
  maxTurn?: number;
  oneTime: boolean;
  tags: string[];
  followUpEvents?: {eventId: string, delay: number, conditions?: Condition[]}[];
}
```

### Event System Class

```typescript
class EventSystem {
  private eventPool: Event[];
  private triggeredEvents: string[];
  private eventQueue: Event[];
  private activeEvent: Event | null;
  
  public updateEvents(gameState: GameState): void;
  public checkTriggers(gameState: GameState): Event[];
  public selectEvent(candidates: Event[], gameState: GameState): Event;
  public resolveChoice(choiceId: string): void;
  public getActiveEvent(): Event | null;
  public addEvent(event: Event): void;
  public isEventAvailable(eventId: string, gameState: GameState): boolean;
}
```

### Event UI Components

1. **Event Notification** - Alerts the player to new events
2. **Event Dialog** - Displays event details and choices
3. **Event Log** - Records history of events and choices
4. **Event Effects Panel** - Shows ongoing effects from events
5. **Event Preview** - Indicates potential consequences of choices

## Content Creation

### Event Writing Guidelines

1. **Clear Stakes** - Make consequences understandable
2. **Consistent Tone** - Match the game's overall style
3. **Balanced Options** - Avoid obvious best choices
4. **Narrative Hooks** - Connect to larger game themes
5. **Brevity** - Keep text concise but informative
6. **Technological Plausibility** - Based on realistic scenarios

### Event Content Scale

Initial Implementation:
- 20 Research events
- 20 Organizational events
- 20 External events
- 20 Deployment events
- 10 Emergent events

Full Implementation:
- 50+ events per category
- Multiple event chains
- Phase-specific event pools
- Organization-specific events

## Integration Points

- **Research System** - Events trigger research effects
- **Resource System** - Events modify resources
- **Deployment System** - Events affect deployments
- **UI System** - Event display and interaction
- **Game State** - Event history and persistent effects

## Event Communication Architecture

For technical details on how events are communicated between components using the EventBus system, see [EventBus System Design](./eventbus_design.md). This documentation covers:

- Event bus implementation
- Event type categorization
- Command and notification event patterns
- Integration with the save/load system

## Next Steps

1. Create event data structure and system skeleton
2. Design basic event UI components
3. Develop initial pool of events (5-10 per category)
4. Implement trigger and resolution system
5. Test event balance and frequency