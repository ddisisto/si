/**
 * MainView - Primary view for the main game area
 */

import UIComponent from './UIComponent';
// Research components will be reimplemented
import GameLayout from './GameLayout';
import ButtonShowcase from './ButtonShowcase';

/**
 * Primary view component for the main game area
 */
class MainView extends UIComponent {
  // private researchTreeView: ResearchTreeView | null = null;
  // private researchTreeHeader: ResearchTreeHeader | null = null;
  private buttonShowcase: ButtonShowcase | null = null;
  private showResearchTree: boolean = false;
  private showButtonShowcase: boolean = false;
  private gameLayout: GameLayout | null = null;
  
  /**
   * Create a new main view
   */
  constructor() {
    super('div', 'main-view');
  }
  
  /**
   * Initialize child components and set up event subscriptions
   */
  private initializeComponents(): void {
    // Research tree components to be reimplemented
    // this.researchTreeView = new ResearchTreeView();
    // this.researchTreeHeader = new ResearchTreeHeader();
    
    // Create button showcase component
    this.buttonShowcase = new ButtonShowcase();
    
    // Set game engine if we have it
    if (this.gameEngine) {
      // this.researchTreeView.setGameEngine(this.gameEngine);
      // this.researchTreeHeader.setGameEngine(this.gameEngine);
      this.buttonShowcase.setGameEngine(this.gameEngine);
    }
    
    // Subscribe to back to main event
    this.subscribe('ui:back_to_main', () => {
      this.showResearchTree = false;
      this.showButtonShowcase = false;
      
      // Unmount components before switching view
      // if (this.researchTreeHeader) {
      //   this.researchTreeHeader.unmount();
      // }
      
      // if (this.researchTreeView) {
      //   this.researchTreeView.unmount();
      // }
      
      if (this.buttonShowcase) {
        this.buttonShowcase.unmount();
      }
      
      this.render();
    });
    
    // Subscribe to button showcase event
    this.subscribe('ui:show-button-showcase', () => {
      this.showButtonShowcase = true;
      
      // Unmount main layout before switching view
      if (this.gameLayout) {
        this.gameLayout.unmount();
      }
      
      // Mount and render button showcase
      if (this.buttonShowcase) {
        this.buttonShowcase.mount(this.element);
        this.buttonShowcase.setGameEngine(this.gameEngine!);
      }
      
      this.render();
    });
  }
  
  /**
   * Set the game engine and initialize components once it's available
   */
  public setGameEngine(gameEngine: any): void {
    super.setGameEngine(gameEngine);
    
    if (!this.researchTreeView || !this.researchTreeHeader || !this.buttonShowcase) {
      this.initializeComponents();
    }
  }
  
  /**
   * Create the main view template
   */
  protected createTemplate(): string {
    if (this.showResearchTree) {
      // Will be reimplemented
      return `<div class="research-container">Research Tree - To Be Reimplemented</div>`;
    }
    
    if (this.showButtonShowcase) {
      return ''; // ButtonShowcase will handle its own rendering
    }
    
    return ''; // Game layout will be rendered via setupEvents
  }
  
  /**
   * Set up the view based on current state
   */
  protected setupEvents(): void {
    this.element.innerHTML = '';
    
    if (this.showResearchTree) {
      // Will be reimplemented
      this.element.innerHTML = '<div class="research-container">Research Tree - To Be Reimplemented</div>';
    } else if (this.showButtonShowcase) {
      if (this.buttonShowcase) {
        this.buttonShowcase.mount(this.element);
      }
    } else {
      this.element.classList.add('game-layout-container');
      
      if (!this.gameLayout) {
        this.gameLayout = new GameLayout();
        if (this.gameEngine) {
          this.gameLayout.setGameEngine(this.gameEngine);
        }
      }
      
      this.gameLayout.mount(this.element);
    }
  }
  
  /**
   * Update the view based on game state changes
   */
  public update(gameState: any): void {
    // Update game layout if active
    if (this.gameLayout && !this.showResearchTree && !this.showButtonShowcase) {
      this.gameLayout.update(gameState);
    }
    
    // Update research tree if active - will be reimplemented
    // if (this.researchTreeView && this.showResearchTree) {
    //   this.researchTreeView.update(gameState);
    // }
  }
  
  /**
   * Open the research tree view
   */
  public openResearchTree(): void {
    this.showResearchTree = true;
    this.showButtonShowcase = false;
    
    // Unmount game layout before switching view
    if (this.gameLayout) {
      this.gameLayout.unmount();
    }
    
    // Will be reimplemented
    this.render();
  }
  
  /**
   * Clean up component resources
   */
  public cleanup(): void {
    // if (this.researchTreeView) {
    //   this.researchTreeView.cleanup();
    // }
    
    // if (this.researchTreeHeader) {
    //   this.researchTreeHeader.cleanup();
    // }
    
    if (this.buttonShowcase) {
      this.buttonShowcase.cleanup();
    }
    
    if (this.gameLayout) {
      this.gameLayout.cleanup();
    }
    
    super.cleanup();
  }
}

export default MainView;