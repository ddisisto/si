/**
 * SuperInt++ Game Entry Point
 */

import { GameEngine } from './core';
import { 
  UIManager, 
  ResourcePanel, 
  TurnControls, 
  GameInfoPanel,
  MainView,
  SaveLoadPanel
} from './ui';
import Logger from './utils/Logger';

/**
 * Initialize and start the game
 */
function main() {
  Logger.info('SuperInt++ Game Initialized');
  
  try {
    // Create game engine - it creates its own event bus internally
    const gameEngine = new GameEngine();
    
    // Get the event bus from the engine to ensure we're using a single instance
    const engineEventBus = gameEngine.getEventBus();
    
    // Initialize UI Manager with the engine's event bus
    const uiManager = new UIManager(engineEventBus);
    
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
    uiManager.setGameEngine(gameEngine);

    // Create and register game components
    const resourcePanel = new ResourcePanel();
    const turnControls = new TurnControls();
    const gameInfoPanel = new GameInfoPanel();
    const mainView = new MainView();
    const saveLoadPanel = new SaveLoadPanel();
    
    // Set game engine on mainView so child components can access it
    mainView.setGameEngine(gameEngine);
    
    // Register all components
    uiManager.registerComponent('resources', resourcePanel);
    uiManager.registerComponent('turnControls', turnControls);
    uiManager.registerComponent('gameInfo', gameInfoPanel);
    uiManager.registerComponent('mainView', mainView);
    uiManager.registerComponent('saveLoad', saveLoadPanel);
    
    Logger.debug('Mounting components to DOM...');
    
    // Mount components directly to their containers
    resourcePanel.mount(sidebar);
    turnControls.mount(headerControls);
    gameInfoPanel.mount(panelArea);
    mainView.mount(main);
    saveLoadPanel.mount(footerControls);
    
    Logger.debug('All components mounted');
    
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
    
    // The TurnSystem now subscribes to turn:end events directly,
    // so we don't need this manual subscription anymore
    
    // Initialize and start the game
    gameEngine.initialize();
    gameEngine.start();
    
    Logger.info('Game started successfully');
    
    // Expose game engine to console for debugging
    (window as any).gameEngine = gameEngine;
    (window as any).uiManager = uiManager;
    
  } catch (error) {
    Logger.error('Failed to initialize game:', error);
  }
}

// Start the game when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}