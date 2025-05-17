/**
 * SuperInt++ Game Entry Point
 */

import { GameEngine, EventBus } from './core';
import { 
  UIManager, 
  ResourcePanel, 
  TurnControls, 
  GameInfoPanel,
  MainView
} from './ui';
import { ResourceSystem } from './systems';

/**
 * Initialize and start the game
 */
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
    
    // Initialize UI Manager
    const uiManager = new UIManager(eventBus);
    
    // Get the root element for the game
    const rootElement = document.getElementById('game-root');
    if (!rootElement) {
      throw new Error('Game root element not found');
    }
    
    // Clear any existing content
    rootElement.innerHTML = '';

    // Create a new game container
    const container = document.createElement('div');
    container.className = 'game-container';
    rootElement.appendChild(container);

    // Create header
    const header = document.createElement('header');
    header.className = 'game-header';
    container.appendChild(header);

    const headerTitle = document.createElement('div');
    headerTitle.className = 'game-title';
    headerTitle.textContent = 'SuperInt++';
    header.appendChild(headerTitle);

    const headerControls = document.createElement('div');
    headerControls.className = 'game-controls';
    header.appendChild(headerControls);

    // Create sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'game-sidebar';
    container.appendChild(sidebar);

    // Create main area
    const main = document.createElement('main');
    main.className = 'game-main';
    container.appendChild(main);

    // Create panel area
    const panelArea = document.createElement('div');
    panelArea.className = 'game-panel-area';
    container.appendChild(panelArea);

    // Create footer
    const footer = document.createElement('footer');
    footer.className = 'game-footer';
    container.appendChild(footer);

    const footerInfo = document.createElement('div');
    footerInfo.className = 'footer-info';
    footerInfo.textContent = 'v0.1.0';
    footer.appendChild(footerInfo);

    const footerControls = document.createElement('div');
    footerControls.className = 'footer-controls';
    footer.appendChild(footerControls);

    // Initialize UI Manager
    uiManager.initialize(rootElement);

    // Create and register game components
    const resourcePanel = new ResourcePanel();
    const turnControls = new TurnControls(eventBus);
    const gameInfoPanel = new GameInfoPanel();
    const mainView = new MainView();
    
    // Register all components
    uiManager.registerComponent('resources', resourcePanel);
    uiManager.registerComponent('turnControls', turnControls);
    uiManager.registerComponent('gameInfo', gameInfoPanel);
    uiManager.registerComponent('mainView', mainView);
    
    console.log('Mounting components to DOM...');
    
    // Mount components directly to their containers
    resourcePanel.mount(sidebar);
    turnControls.mount(headerControls);
    gameInfoPanel.mount(panelArea);
    mainView.mount(main);
    
    console.log('All components mounted');
    
    // Update all components with initial state
    uiManager.update(gameEngine.getState());
    
    // Get initial state
    const initialState = gameEngine.getState();
    
    // Initial UI update with current state
    uiManager.update(initialState);
    
    // Subscribe UI manager directly to state changes via state manager
    // This ensures we catch all state changes regardless of the event bus
    gameEngine.getStateManager().subscribe((_, nextState) => {
      uiManager.update(nextState);
    });
    
    // Subscribe to turn end events from UI
    eventBus.subscribe('turn:end', (data: any) => {
      // Call the turn system's endTurn method
      gameEngine.getTurnSystem().endTurn(data);
    });
    
    // Initialize and start the game
    gameEngine.initialize();
    gameEngine.start();
    
    console.log('Game started successfully');
    
    // Expose game engine to console for debugging
    (window as any).gameEngine = gameEngine;
    (window as any).uiManager = uiManager;
    
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

// Start the game when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}