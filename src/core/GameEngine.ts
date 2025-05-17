/**
 * Game Engine - Core game loop and state management
 */

class GameEngine {
  private gameLoop: number | null = null;
  private lastTimestamp = 0;

  constructor() {
    // Initialize the game engine
    console.log('Game Engine initialized');
  }

  public start(): void {
    if (this.gameLoop !== null) return;
    
    this.lastTimestamp = performance.now();
    this.gameLoop = requestAnimationFrame(this.update.bind(this));
    console.log('Game loop started');
  }

  public stop(): void {
    if (this.gameLoop === null) return;
    
    cancelAnimationFrame(this.gameLoop);
    this.gameLoop = null;
    console.log('Game loop stopped');
  }

  private update(timestamp: number): void {
    const deltaTime = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Update game state based on deltaTime
    // This will be expanded as we implement the game systems
    
    // Request next frame if game is still running
    if (this.gameLoop !== null) {
      this.gameLoop = requestAnimationFrame(this.update.bind(this));
    }
  }
}

export default GameEngine;