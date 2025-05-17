/**
 * SuperInt++ Game Entry Point
 */

import { GameEngine, EventBus } from './core';
import { Renderer, InputHandler } from './ui';

/**
 * Initialize and start the game
 */
function main() {
  console.log('SuperInt++ Game Initialized');
  
  try {
    // Initialize core systems
    const eventBus = new EventBus();
    const renderer = new Renderer();
    
    // Initialize input handler with canvas from renderer
    new InputHandler(renderer.getDimensions().canvas, eventBus);
    
    const gameEngine = new GameEngine();
    
    // Set up event handlers
    document.getElementById('loading')?.remove();
    
    // Start the game loop
    gameEngine.start();
    
    console.log('Game started successfully');
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