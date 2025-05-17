/**
 * SuperInt++ Game Entry Point
 */

import { GameEngine } from './core';
import { Renderer } from './ui';

function main() {
  console.log('SuperInt++ Game Initialized');
  
  try {
    // Initialize game components
    const renderer = new Renderer();
    const gameEngine = new GameEngine();
    
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