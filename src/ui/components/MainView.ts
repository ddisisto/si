/**
 * MainView - Primary view for the main game area
 */

import UIComponent from './UIComponent';
import { ResearchTreeView, ResearchTreeHeader } from './research';
import { EventBus } from '../../core';
import GameLayout from './GameLayout';

/**
 * Primary view component for the main game area
 */
class MainView extends UIComponent {
  private researchTreeView: ResearchTreeView | null = null;
  private researchTreeHeader: ResearchTreeHeader | null = null;
  private showResearchTree: boolean = false;
  private gameLayout: GameLayout | null = null;
  
  /**
   * Create a new main view
   */
  constructor() {
    super('div', 'main-view');
  }
  
  /**
   * Set event bus and create child components
   */
  public setEventBus(eventBus: EventBus): void {
    super.setEventBus(eventBus);
    
    // Create research tree component
    this.researchTreeView = new ResearchTreeView();
    this.researchTreeView.setEventBus(eventBus);
    
    // Create research tree header component
    this.researchTreeHeader = new ResearchTreeHeader();
    this.researchTreeHeader.setEventBus(eventBus);
    
    // Listen for back to main event
    eventBus.subscribe('ui:back_to_main', () => {
      this.showResearchTree = false;
      
      // Unmount research tree before switching view
      if (this.researchTreeHeader) {
        this.researchTreeHeader.unmount();
      }
      
      if (this.researchTreeView) {
        this.researchTreeView.unmount();
      }
      
      this.render();
    });
  }
  
  /**
   * Set the game layout reference
   */
  public setGameLayout(layout: GameLayout): void {
    this.gameLayout = layout;
  }
  
  /**
   * Generate the main view HTML
   */
  protected createTemplate(): string {
    // Show research tree if enabled
    if (this.showResearchTree) {
      return `
        <div id="research-tree-container"></div>
      `;
    }
    
    // Otherwise show the welcome/intro panel
    return `
      <div class="main-content">
        <h2>SuperInt++</h2>
        <p>Welcome to the SuperInt++ strategic simulation game about AI development and its consequences.</p>
        <div class="main-section">
          <h3>Getting Started</h3>
          <p>Begin by allocating resources to research in the research tree. End your turn to see the results.</p>
          <button id="show-research-tree" class="game-button primary">Open Research Tree</button>
        </div>
        <div class="main-section">
          <h3>Current Objectives</h3>
          <ul>
            <li>Research fundamental AI capabilities</li>
            <li>Build your organization's resources</li>
            <li>Prepare for your first AI deployment</li>
          </ul>
        </div>
      </div>
    `;
  }
  
  /**
   * Attach event handlers after rendering
   */
  protected bindEvents(): void {
    // Handle research tree button click
    const showResearchButton = this.element.querySelector('#show-research-tree');
    if (showResearchButton) {
      showResearchButton.addEventListener('click', () => {
        this.showResearchTree = true;
        
        // First unmount any existing research tree component
        if (this.researchTreeView && this.researchTreeView.getElement().parentElement) {
          this.researchTreeView.unmount();
        }
        
        // Mount the research tree header to the view title area
        if (this.researchTreeHeader && this.gameLayout) {
          this.gameLayout.mountToViewTitle(this.researchTreeHeader);
        }
        
        // Then render the new container and mount the tree
        this.render();
        this.mountResearchTree();
      });
    }
  }
  
  /**
   * Mount the research tree after rendering
   */
  protected afterMount(): void {
    if (this.showResearchTree) {
      this.mountResearchTree();
    }
  }
  
  /**
   * Mount the research tree component
   */
  private mountResearchTree(): void {
    if (this.researchTreeView) {
      const container = this.element.querySelector('#research-tree-container');
      
      if (container) {
        this.researchTreeView.mount(container as HTMLElement);
        
        if (this.gameState) {
          this.researchTreeView.update(this.gameState);
        }
      } else {
        console.error('Could not find research-tree-container element');
      }
    } else {
      console.error('ResearchTreeView is not initialized');
    }
  }
  
  /**
   * Update all child components with new state
   */
  public update(gameState: Readonly<any>): void {
    super.update(gameState);
    
    // Update research tree if mounted
    if (this.showResearchTree && this.researchTreeView) {
      this.researchTreeView.update(gameState);
    }
  }
}

export default MainView;