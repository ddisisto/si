# Event Communication and State Persistence

This document details the event-based communication architecture and state persistence system used in SuperInt++, highlighting the relationships between the EventBus, GameStateManager, and UI components.

## 1. Event Communication Architecture

The event system facilitates decoupled communication between components through a centralized EventBus.

### 1.1 Event Bus Design

The EventBus follows a publish-subscribe pattern:
- Components **subscribe** to events they want to receive
- Components **publish** events to notify others of changes
- All communication flows through a **SINGLE shared EventBus instance**

```typescript
class EventBus {
  private listeners: Map<string, EventCallback[]>;
  
  public subscribe(eventType: string, callback: EventCallback): void;
  public unsubscribe(eventType: string, callback: EventCallback): void;
  public emit(eventType: string, data: any = {}): void;
}
```

### 1.2 Event Type Categories

Events in the system are categorized by their purpose and naming convention:

1. **Command Events** (`action:*`)
   - Request a change to game state
   - Flow: UI Components → Game Systems
   - Examples: `action:save`, `action:load`, `action:queue`

2. **State Change Events** (`game:*`)
   - Notify of completed state changes
   - Flow: Game Systems → UI Components
   - Examples: `game:saved`, `game:loaded`, `game:stateChanged`

3. **System Events** (`*:*`)
   - Coordinate game systems
   - Flow: Between Game Systems
   - Examples: `turn:start`, `turn:end`, `phase:changed`

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
| `game:saved` | GameEngine | SaveLoadPanel | Notify save complete | `{ name: string }` |
| `game:loaded` | GameEngine | SaveLoadPanel | Notify load complete | `{ name: string }` |
| `stateChanged` | GameStateManager | Systems | Notify state update | `{ action, prevState, nextState }` |
| `stateLoaded` | GameStateManager | Systems | Notify state replacement | `{ name: string }` |
| `turn:start` | TurnSystem | Systems | Signal turn beginning | `{ turn, gameTime }` |
| `turn:end` | TurnSystem | Systems | Signal turn completion | `{ turn, gameTime }` |
| `phase:changed` | TurnSystem | Systems | Signal phase change | `{ phase }` |

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

## 3. Best Practices

### 3.1 Event Communication

1. **Use existing event types** when possible
2. **Document new events** in this registry when created
3. **Verify event subscriptions** exist before emitting events
4. **Never create multiple EventBus instances**
5. **Add logging** for event emission and reception during development

### 3.2 State Persistence

1. **Validate save data** when loading to prevent corruption
2. **Provide clear feedback** to users about save/load operations
3. **Handle errors gracefully** when saves fail or are corrupted
4. **Use meaningful save names** in auto-generated situations
5. **Implement data migrations** as the save format evolves

## 4. Implementation Example

```typescript
// In GameEngine constructor:
this.eventBus = new EventBus();

// Subscribe to save/load events
this.eventBus.subscribe('action:save', (data) => {
  console.log(`GameEngine: Received action:save event with name: "${data.name}"`);
  this.saveGame(data.name);
  this.eventBus.emit('game:saved', { name: data.name });
});

// In SaveLoadPanel:
constructor(options: SaveLoadPanelOptions) {
  super('div', 'save-load-panel');
  // Critical: Set eventBus from constructor params
  this.eventBus = options.eventBus;
}

// In UI component when handling save action:
handleSaveGame(): void {
  if (this.eventBus) {
    const saveName = this.saveNameInput || 'Game Save';
    this.eventBus.emit('action:save', { name: saveName });
  }
}
```