/**
 * SuperInt++ Game Entry Point
 */

import { GameEngine, EventBus } from './core';
import { 
  UIManager, 
  ResourcePanel, 
  TurnControls, 
  GameInfoPanel,
  GameLayout,
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
    
    // Initialize UI Manager with root element
    uiManager.initialize(rootElement);
    
    // Create main game layout
    const gameLayout = new GameLayout({ eventBus });
    uiManager.registerComponent('layout', gameLayout);
    
    // Create and register game components
    const resourcePanel = new ResourcePanel();
    uiManager.registerComponent('resources', resourcePanel);
    
    const turnControls = new TurnControls(eventBus);
    uiManager.registerComponent('turnControls', turnControls);
    
    const gameInfoPanel = new GameInfoPanel();
    uiManager.registerComponent('gameInfo', gameInfoPanel);
    
    const mainView = new MainView();
    uiManager.registerComponent('mainView', mainView);
    
    // Mount components to layout
    gameLayout.mountToSidebar(resourcePanel);
    gameLayout.mountToHeader(turnControls);
    gameLayout.mountToPanelArea(gameInfoPanel);
    gameLayout.mountToMain(mainView);
    
    // Get initial state
    const initialState = gameEngine.getState();
    
    // Subscribe UI manager to state changes
    eventBus.subscribe('stateChanged', () => {
      uiManager.update(gameEngine.getState());
    });
    
    // Initial UI update with current state
    uiManager.update(initialState);
    
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