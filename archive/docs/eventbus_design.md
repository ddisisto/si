# Event Communication and State Persistence

This document details the event-based communication architecture and state persistence system used in SuperInt++, highlighting the relationships between the EventBus, GameStateManager, and UI components.

## 1. Event Communication Architecture

The event system facilitates decoupled communication between components through a centralized EventBus.

### 1.1 Event Bus Design

The EventBus follows a publish-subscribe pattern with enhanced debugging and error handling capabilities:
- Components **subscribe** to events they want to receive
- Components **publish** events to notify others of changes
- All communication flows through a **SINGLE shared EventBus instance**
- **Enhanced features** include event chaining, health monitoring, and debug mode

```typescript
class EventBus {
  private listeners: Map<string, ListenerInfo[]>;
  private eventHistory: EventContext[] = [];
  private eventChain: string[] = [];
  private options: EventBusOptions;
  
  constructor(options: EventBusOptions) {
    this.options = {
      debugMode: process.env.NODE_ENV === 'development',
      enableEventChaining: true,
      maxListenersPerEvent: 20,
      ...options
    };
  }
  
  public subscribe(eventType: string, callback: EventCallback, source?: string): void;
  public unsubscribe(eventType: string, callback: EventCallback): void;
  public emit(eventType: string, data: any = {}, source?: string): void;
  public getHealthStatus(): EventHealthStatus;
  public getEventHistory(limit?: number): EventContext[];
  public setDebugMode(enabled: boolean): void;
}
```

#### Enhanced Features:

1. **Event Chaining**: Tracks cascade of events to debug complex interactions
2. **Health Monitoring**: Reports listener counts, warnings, and performance metrics
3. **Debug Mode**: Detailed logging when enabled, minimal overhead in production
4. **Event History**: Stores recent events for debugging and analysis
5. **Error Context**: Rich error information with event chains and sources
6. **Source Tracking**: Optional source identifiers for better debugging

### 1.2 Event Type Categories

Events in the system are categorized by their purpose and naming convention:

1. **Command Events** (`action:*`)
   - Request a change to game state
   - Flow: UI Components → Game Systems
   - Examples: `action:save`, `action:load`, `action:queue`, `action:research:start`

2. **State Change Events** (`game:*`)
   - Notify of completed state changes
   - Flow: Game Systems → UI Components
   - Examples: `game:saved`, `game:loaded`, `game:state:updated`

3. **UI Events** (`ui:*`)
   - Inter-component communication
   - Flow: Between UI Components
   - Examples: `ui:panel:toggle`, `ui:view:change`, `ui:back_to_main`

4. **System Events** (`turn:*`, `phase:*`)
   - Coordinate game systems and timing
   - Flow: Between Game Systems
   - Examples: `turn:start`, `turn:end`, `phase:action`, `time:compression:changed`

### 1.3 Event Flow Diagram

```
┌─────────────────┐                 ┌─────────────────┐
│                 │  action:save    │                 │
│  UI Components  ├────────────────►│  Game Engine    │
│  (SaveLoadPanel)│                 │                 │
│                 │◄────────────────┤                 │
└─────────────────┘  game:saved     └────────┬────────┘
                                             │
                                             │ saveState()
                                             ▼
                                    ┌─────────────────┐
                                    │                 │
                                    │GameStateManager │
                                    │                 │
                                    └─────────────────┘
```

### 1.4 Critical Implementation Details

1. **Single Event Bus Instance Requirement**
   - The application MUST use a single EventBus instance shared by all components
   - The GameEngine's EventBus should be the source of truth
   - All components and systems should receive this same instance
   - Multiple EventBus instances will break event communication

2. **Event Initialization Timing**
   - Components need access to the EventBus before emitting or subscribing to events
   - Most components should receive EventBus in their constructor
   - UI components typically subscribe to events in their `afterMount()` method

3. **Central Event Registry**

| Event Type | Emitted By | Received By | Purpose | Payload |
|------------|------------|-------------|---------|---------|
| `action:save` | SaveLoadPanel | GameEngine | Request game save | `{ name: string }` |
| `action:load` | SaveLoadPanel | GameEngine | Request game load | `{ name: string }` |
| `action:queue` | UI Components | GameEngine | Queue a state action | `{ action: GameAction }` |
| `action:research:start` | ResearchTreeView | GameEngine | Start research | `{ researchId: string }` |
| `game:saved` | GameEngine | SaveLoadPanel | Notify save complete | `{ name: string }` |
| `game:loaded` | GameEngine | SaveLoadPanel | Notify load complete | `{ name: string }` |
| `game:state:updated` | GameStateManager | Systems | Notify state update | `{ action, prevState, nextState }` |
| `stateLoaded` | GameStateManager | Systems | Notify state replacement | `{ name: string }` |
| `ui:back_to_main` | ResearchTreeHeader | MainView | Return to main view | `{}` |
| `turn:start` | TurnSystem | Systems | Signal turn beginning | `{ turn, gameTime }` |
| `turn:end` | TurnControls | TurnSystem | Request turn end | `{ turn, gameTime }` |
| `phase:action` | TurnSystem | UI Components | Signal action phase | `{ phase }` |
| `time:compression:changed` | TimeSystem | UI Components | Time scale changed | `{ timeScale }` |

## 2. State Persistence System

The state persistence system provides save/load functionality for game state.

### 2.1 System Components

1. **GameStateManager**
   - Core implementation of `saveState()` and `loadState()`
   - Serializes state to localStorage
   - Updates state when loading
   - Emits events when state changes

2. **SaveLoadPanel**
   - UI component for save/load controls
   - Emits `action:save` and `action:load` events
   - Renders save files list and dialogs
   - Controls auto-save toggling via settings

3. **GameEngine**
   - Subscribes to `action:save` and `action:load` events
   - Calls `saveGame()` and `loadGame()` methods
   - Emits `game:saved` and `game:loaded` events
   - Maintains the authoritative EventBus instance

4. **TurnSystem**
   - Handles auto-save during turn progression
   - Checks `settings.autoSave` during `endTurn()`

### 2.2 Save/Load Process Flow

1. **Manual Saving Process:**
   ```
   1. User clicks "Save" → SaveLoadPanel shows dialog
   2. User enters name → SaveLoadPanel emits action:save
   3. GameEngine receives action:save → calls saveGame()
   4. GameStateManager executes saveState():
      - Serializes state to JSON
      - Saves to localStorage
      - Updates lastSaved timestamp
   5. GameEngine emits game:saved
   6. SaveLoadPanel receives game:saved → refreshes save list
   ```

2. **Loading Process:**
   ```
   1. User clicks "Load" → SaveLoadPanel shows save list
   2. User selects save → SaveLoadPanel emits action:load
   3. GameEngine receives action:load → calls loadGame()
   4. GameStateManager executes loadState():
      - Retrieves save from localStorage
      - Parses JSON to GameState
      - Replaces current state
      - Emits stateLoaded event
   5. GameEngine emits game:loaded
   6. SaveLoadPanel receives game:loaded → closes dialog
   7. UI components update to reflect loaded state
   ```

3. **Auto-Save Process:**
   ```
   1. User toggles auto-save → SaveLoadPanel emits action:queue with UPDATE_SETTINGS
   2. GameStateManager updates settings.autoSave
   3. At the START of each turn → TurnSystem checks settings.autoSave
   4. If enabled → calls stateManager.saveState('autosave')
   ```
   
   Note: Auto-save happens at the beginning of each turn (not the end) to ensure that when loading a saved game, the player will be at the same turn number they were at when playing.

### 2.3 Save Data Structure

Saved games are stored in localStorage using the following structure:

```typescript
interface SaveGameData {
  version: string;        // For migration support
  gameState: GameState;   // Complete game state
  timestamp: number;      // When save was created
  meta: {                 // Quick access to key info
    turn: number;
    year: number;
    quarter: number;
    month: number;
    day: number;
  }
}
```

Each save is stored with key `si_save_{name}` where `name` is the user-provided name or `autosave` for automatic saves.

## 3. Detailed Event Flows

### 3.1 Research System Event Flow

```
User Action → ResearchTreeView → EventBus → ResearchSystem → State Update → UI Update

1. action:start_research
   Payload: { nodeId: string, allocatedCompute: number }
   Flow: ResearchTreeView → ResearchSystem
   
2. resource:allocate
   Payload: { resource: 'computing', target: 'research:nodeId', amount: number }
   Flow: ResearchSystem → ResourceSystem
   
3. research:started
   Payload: { nodeId, node, allocatedCompute, turn }
   Flow: ResearchSystem → UI Components
   
4. research:progress (on each turn)
   Payload: { nodeId, previousProgress, newProgress, increment, computeAllocated, turn }
   Flow: ResearchSystem → UI Components
   Note: Triggered during turn:ending event, UPDATE_RESEARCH_PROGRESS action is dispatched internally
   
5. research:completed
   Payload: { nodeId, node, turn, totalCompleted }
   Flow: ResearchSystem → UI Components + Other Systems
```

### 3.2 Resource System Event Flow

```
1. turn:start
   Payload: { turn, gameTime }
   Flow: TurnSystem → ResourceSystem
   
2. resources:updated
   Payload: { resources, previousResources }
   Flow: ResourceSystem → UI Components
   
3. resource:allocate / resource:deallocate
   Payload: { resource, target, amount }
   Flow: Various Systems → ResourceSystem
   
4. resource:spend
   Payload: { resource, amount, purpose }
   Flow: Various Systems → ResourceSystem
```

### 3.3 Turn System Event Flow

```
1. turn:end (user initiated)
   Payload: { turn, gameTime }
   Flow: TurnControls → TurnSystem
   
2. turn:ending
   Payload: { turn, gameTime }
   Flow: TurnSystem → All Systems
   
3. phase:changed
   Payload: { phase }
   Flow: TurnSystem → UI Components
   
4. turn:start
   Payload: { turn, gameTime, formattedDate }
   Flow: TurnSystem → All Systems
   
5. phase:action
   Payload: { timeScale, formattedDate }
   Flow: TurnSystem → UI Components
```

## 4. Best Practices

### 4.1 Event Communication

1. **Use existing event types** when possible
2. **Document new events** in this registry when created
3. **Verify event subscriptions** exist before emitting events
4. **Never create multiple EventBus instances**
5. **Use source identifiers** for better debugging
6. **Handle errors gracefully** in event handlers

### 4.2 State Persistence

1. **Validate save data** when loading to prevent corruption
2. **Provide clear feedback** to users about save/load operations
3. **Handle errors gracefully** when saves fail or are corrupted
4. **Use meaningful save names** in auto-generated situations
5. **Implement data migrations** as the save format evolves

## 5. Debugging and Monitoring

### 5.1 EventBus Health Check

The GameEngine provides a health status method that exposes EventBus metrics:

```typescript
const healthStatus = gameEngine.getHealthStatus();
console.log(healthStatus.eventBus);
// Output: { totalEvents, totalListeners, eventCounts, warnings }
```

### 5.2 Debug Mode

Enable debug mode for detailed event flow logging:

```typescript
// Enable debug mode
gameEngine.eventBus.setDebugMode(true);

// Or configure in GameEngine constructor for development
new EventBus({
  debugMode: process.env.NODE_ENV === 'development',
  enableEventChaining: true,
  maxListenersPerEvent: 20
});
```

### 5.3 Event History

View recent events for debugging:

```typescript
// Get last 50 events
const history = gameEngine.eventBus.getEventHistory(50);

// Get current event chain (shows cascade)
const chain = gameEngine.eventBus.getCurrentEventChain();
```

### 5.4 Common Debugging Scenarios

1. **Event Not Received**
   - Check EventBus instance is shared
   - Verify subscription timing
   - Enable debug mode to trace event flow
   - Check event type spelling

2. **Multiple Events Triggered**
   - Review event chains in history
   - Check for circular event dependencies
   - Use source identifiers to trace origin

3. **Performance Issues**
   - Monitor listener counts in health status
   - Check for memory leaks in event history
   - Review event chain depth for cascades

## 6. Implementation Example

```typescript
// In GameEngine constructor:
this.eventBus = new EventBus();

// Subscribe to save/load events
this.eventBus.subscribe('action:save', (data) => {
  Logger.info(`GameEngine: Received action:save event with name: "${data.name}"`);
  this.saveGame(data.name);
  this.eventBus.emit('game:saved', { name: data.name });
});

// NEW PATTERN - Components access EventBus through GameEngine:
abstract class UIComponent {
  protected gameEngine: GameEngineInterface | null = null;
  
  // Helper methods for common patterns
  protected emit(event: string, data: any): void {
    this.gameEngine?.eventBus.emit(event, data);
  }
  
  protected subscribe(event: string, handler: (data: any) => void): void {
    this.gameEngine?.eventBus.subscribe(event, handler);
  }
  
  public setGameEngine(gameEngine: GameEngineInterface): void {
    this.gameEngine = gameEngine;
    this.gameState = gameEngine.getState();
  }
}

// In UI component implementation:
class SaveLoadPanel extends UIComponent {
  protected afterMount(): void {
    // Subscribe to events using helper method
    this.subscribe('game:saved', this.refreshSavesList.bind(this));
    this.subscribe('game:loaded', this.handleGameLoaded.bind(this));
  }
  
  private handleSaveGame = (): void => {
    const saveName = this.saveNameInput || 'Game Save';
    // Emit event using helper method
    this.emit('action:save', { name: saveName });
  };
}
```