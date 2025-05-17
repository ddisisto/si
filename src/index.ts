/**
 * SuperInt++ Game Entry Point
 */

import { GameEngine, EventBus } from './core';
import { Renderer, InputHandler, DemoView } from './ui';
import { ResourceSystem } from './systems';

/**
 * Initialize and start the game
 */
function main() {
  console.log('SuperInt++ Game Initialized');
  
  try {
    // Initialize core systems
    const eventBus = new EventBus();
    const renderer = new Renderer();
    
    // Create a demo view for testing
    const demoView = new DemoView();
    renderer.registerView('demo', demoView);
    
    // Initialize input handler with canvas from renderer
    const inputHandler = new InputHandler(renderer.getDimensions().canvas, eventBus);
    
    // Create game engine
    const gameEngine = new GameEngine();
    
    // Register game systems
    const resourceSystem = new ResourceSystem(gameEngine.getStateManager(), eventBus);
    gameEngine.registerSystem(resourceSystem);
    
    // Subscribe renderer to state changes
    eventBus.subscribe('stateChanged', (data) => {
      console.log('State changed event received, updating UI', data);
      demoView.connectGameState(gameEngine.getState());
      renderer.render();
    });
    
    // Subscribe to mouse events for UI interaction
    inputHandler.addClickHandler((x, y) => {
      renderer.handleClick(x, y);
    });
    
    inputHandler.addMoveHandler((x, y) => {
      renderer.handleHover(x, y);
    });
    
    // Start rendering loop
    function renderLoop() {
      renderer.render();
      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
    
    // Set up event handlers
    document.getElementById('loading')?.remove();
    
    // Connect state displays to demo view for initial state
    demoView.connectGameState(gameEngine.getState());
    
    // Start the game loop
    gameEngine.initialize();
    gameEngine.start();
    
    console.log('Game started successfully');
    
    // Expose game engine to console for debugging
    (window as any).gameEngine = gameEngine;
    
    // Add event listener for custom turn:end events from UI
    document.addEventListener('turn:end', (e: any) => {
      console.log('Turn end event received:', e.detail);
      eventBus.emit('turn:end', e.detail);
      
      // Directly call the turn system's endTurn method for debugging
      console.log('Directly calling turnSystem.endTurn()');
      gameEngine.getTurnSystem().endTurn(e.detail);
    });
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