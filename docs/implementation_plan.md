# Implementation Plan

This document outlines the concrete steps to implement SuperInt++ based on our design documentation, with a focus on the DOM-based UI approach.

## Current Status

We have completed the initial game design documentation, technical planning, and implemented the core state management system:

1. **Concept and Mechanics** - Core game concept and mechanics defined
2. **System Designs** - Individual systems documented with detailed specifications
3. **Technical Architecture** - Overall structure and patterns established
4. **Project Structure** - File and component organization defined
5. **State Management** - Core game state, reducers, and turn system implemented

## UI Transition Strategy: Canvas to DOM

We are transitioning from a Canvas-based UI to a pure DOM-based approach for the following reasons:

- **Better Developer Experience** - Standard HTML/CSS development patterns
- **Native Accessibility** - Improved accessibility with standard web elements
- **Easier Event Handling** - Native DOM events without manual hit detection
- **Responsive Design** - Natural responsiveness without custom scaling
- **Simpler Testing** - Components can be tested in isolation

## Implementation Priorities

### Phase 1: DOM UI Foundation (Priority 1)

1. **Core UI Infrastructure**
   - Create `UIComponent` base class
   - Implement `UIManager` to coordinate components
   - Set up CSS framework and styling
   - Create basic UI components (Panel, Button)

2. **State Integration**
   - Connect UI components to state management
   - Implement state subscriptions for UI updates
   - Create event handling for user interactions

3. **Basic Game UI**
   - Implement `ResourcePanel` component
   - Create `TurnControls` component
   - Add `GameInfoPanel` component

### Phase 2: Game Systems UI (Priority 2)

1. **Research System UI**
   - Implement `ResearchTreeView` component
   - Create research node representation
   - Add interactive selection

2. **Deployment System UI**
   - Create `DeploymentView` component
   - Implement deployment slot management UI
   - Add deployment effect visualization

3. **Event System UI**
   - Implement `EventPanel` component
   - Create event notification system
   - Add interactive event resolution UI

### Phase 3: Polish and Optimization (Priority 3)

1. **UI Refinement**
   - Improve visual styling
   - Add transitions and animations
   - Implement responsive breakpoints
   - Optimize for different screen sizes

2. **Performance Optimization**
   - Implement selective rendering
   - Add render batching
   - Optimize DOM updates

3. **Testing and Feedback**
   - Add component unit tests
   - Implement E2E testing
   - Refine user experience

## Implementation Plan for DOM UI Transition

### Step 1: Create Base UI Infrastructure

1. **Create UIComponent Base Class**
   ```typescript
   abstract class UIComponent {
     protected element: HTMLElement;
     protected gameState: Readonly<GameState>;
     
     constructor(elementType: string, className?: string);
     public mount(parent: HTMLElement): void;
     public unmount(): void;
     public update(gameState: Readonly<GameState>): void;
     public render(): void;
     protected createTemplate(): string;
   }
   ```

2. **Implement Basic UI Components**
   - Create `Panel` component for content containers
   - Implement `Button` component for interactive controls
   - Create `Label` component for text display

3. **Create UI Manager**
   ```typescript
   class UIManager {
     private components: Map<string, UIComponent>;
     private rootElement: HTMLElement;
     private eventBus: EventBus;
     
     public initialize(rootElement: HTMLElement): void;
     public registerComponent(id: string, component: UIComponent): void;
     public update(gameState: GameState): void;
   }
   ```

### Step 2: Update HTML Structure and CSS

1. **Update index.html**
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>SuperInt++</title>
     <link rel="stylesheet" href="styles/main.css">
   </head>
   <body>
     <div id="game-root">
       <div id="loading">Initializing game...</div>
     </div>
   </body>
   </html>
   ```

2. **Create CSS Structure**
   - Create `styles/main.css` for global styles
   - Add `styles/variables.css` for theming variables
   - Create `styles/components.css` for component-specific styles

3. **Set Up Responsive Layout**
   - Implement CSS Grid for main layout
   - Use Flexbox for component layouts
   - Add responsive breakpoints

### Step 3: Implement First UI Components

1. **Resource Panel**
   ```typescript
   class ResourcePanel extends UIComponent {
     constructor() {
       super('div', 'resource-panel');
     }
     
     protected createTemplate(): string {
       return `
         <div class="panel-header">Resources</div>
         <div class="panel-content">
           <div class="resource-item">
             <div class="resource-label">Computing</div>
             <div class="resource-value">${this.gameState?.resources.computing.total || 0}</div>
           </div>
           <!-- Other resources -->
         </div>
       `;
     }
     
     public update(gameState: Readonly<GameState>): void {
       this.gameState = gameState;
       this.render();
     }
   }
   ```

2. **Turn Controls**
   ```typescript
   class TurnControls extends UIComponent {
     constructor(eventBus: EventBus) {
       super('div', 'turn-controls');
       this.eventBus = eventBus;
     }
     
     protected createTemplate(): string {
       return `
         <div class="turn-info">Turn: ${this.gameState?.meta.turn || 1}</div>
         <button class="end-turn-button">End Turn</button>
       `;
     }
     
     public mount(parent: HTMLElement): void {
       super.mount(parent);
       
       // Add event listeners
       const endTurnButton = this.element.querySelector('.end-turn-button');
       if (endTurnButton) {
         endTurnButton.addEventListener('click', this.handleEndTurn.bind(this));
       }
     }
     
     private handleEndTurn(): void {
       this.eventBus.emit('turn:end', { turn: this.gameState?.meta.turn });
     }
   }
   ```

### Step 4: Integrate with Game Engine

1. **Update GameEngine to use UIManager**
   ```typescript
   // In GameEngine.ts
   private uiManager: UIManager;
   
   constructor() {
     // ...existing code
     this.uiManager = new UIManager(this.eventBus);
     
     // Subscribe to state changes
     this.stateManager.subscribe((prevState, nextState) => {
       this.uiManager.update(nextState);
     });
   }
   
   public initialize(): void {
     // ...existing code
     const rootElement = document.getElementById('game-root');
     if (!rootElement) {
       throw new Error('Game root element not found');
     }
     this.uiManager.initialize(rootElement);
     
     // Register UI components
     const resourcePanel = new ResourcePanel();
     this.uiManager.registerComponent('resources', resourcePanel);
     
     const turnControls = new TurnControls(this.eventBus);
     this.uiManager.registerComponent('turnControls', turnControls);
   }
   ```

2. **Update index.ts Entry Point**
   ```typescript
   // In index.ts
   function main() {
     console.log('SuperInt++ Game Initialized');
     
     try {
       // Initialize core systems
       const eventBus = new EventBus();
       
       // Create game engine
       const gameEngine = new GameEngine();
       
       // Register game systems
       const resourceSystem = new ResourceSystem(gameEngine.getStateManager(), eventBus);
       gameEngine.registerSystem(resourceSystem);
       
       // Initialize and start the game
       gameEngine.initialize();
       gameEngine.start();
       
       console.log('Game started successfully');
       
       // Expose game engine to console for debugging
       (window as any).gameEngine = gameEngine;
     } catch (error) {
       console.error('Failed to initialize game:', error);
     }
   }
   ```

### Step 5: Implement Research Tree Visualization

1. **Create Research Tree Component**
   ```typescript
   class ResearchTreeView extends UIComponent {
     constructor(eventBus: EventBus) {
       super('div', 'research-tree');
       this.eventBus = eventBus;
     }
     
     protected createTemplate(): string {
       // Generate nodes from research state
       const nodeElements = this.generateNodeElements();
       
       return `
         <div class="tree-container">
           <div class="tree-header">Research Tree</div>
           <div class="tree-content">
             ${nodeElements}
           </div>
         </div>
       `;
     }
     
     private generateNodeElements(): string {
       if (!this.gameState?.research.nodes) return '';
       
       // Generate HTML for research nodes
       return Object.entries(this.gameState.research.nodes)
         .map(([id, node]) => {
           const status = node.completed ? 'completed' : 
                          node.available ? 'available' : 'locked';
           
           return `
             <div class="research-node ${status}" data-id="${id}">
               <div class="node-title">${node.name}</div>
               <div class="node-desc">${node.description}</div>
               <div class="node-progress">${node.progress}/${node.cost}</div>
             </div>
           `;
         })
         .join('');
     }
     
     public mount(parent: HTMLElement): void {
       super.mount(parent);
       
       // Add event listeners to nodes
       this.element.querySelectorAll('.research-node').forEach(node => {
         node.addEventListener('click', this.handleNodeClick.bind(this));
       });
     }
     
     private handleNodeClick(event: Event): void {
       const node = event.currentTarget as HTMLElement;
       const nodeId = node.dataset.id;
       
       if (nodeId) {
         this.eventBus.emit('research:select', { nodeId });
       }
     }
   }
   ```

### Step 6: Migration Strategy

1. **Parallel Development**
   - Develop DOM components alongside existing Canvas code
   - Move functionality one component at a time
   - Test each component in isolation before integration

2. **Progressive Enhancement**
   - Start with simpler UI elements
   - Move to more complex components after basics work
   - Maintain game functionality throughout transition

3. **CSS-First Approach**
   - Design reusable CSS components
   - Create responsive layouts with CSS Grid and Flexbox
   - Use CSS variables for theming and consistency

## Timeline (Approximate)

- UI Foundation (Core infrastructure): 2-3 days
- Basic Game UI (Resource panel, turn controls): 1-2 days
- Research Tree UI: 2-3 days
- Deployment & Events UI: 2-3 days
- Polish and Optimization: 1-2 days

Total estimated time: 8-13 days of focused development

## Success Criteria

The transition will be considered successful when:

1. All Canvas-based UI is replaced with DOM components
2. User interactions work correctly with the new UI
3. State updates are properly reflected in the UI
4. The application is responsive across different screen sizes
5. Performance is equal to or better than the Canvas version

## Next Steps

1. Create UIComponent base class
2. Implement UIManager
3. Set up CSS framework
4. Create first DOM components (ResourcePanel, TurnControls)
5. Integrate with game engine
6. Update main game loop to work with DOM UI