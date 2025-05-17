/**
 * GameLayout - Main layout component for the game UI
 */

import UIComponent from './UIComponent';
import { EventBus } from '../../core';

interface GameLayoutOptions {
  eventBus: EventBus;
}

/**
 * Main layout component that structures the game UI into sections
 */
class GameLayout extends UIComponent {
  // References to container elements for mounting child components
  private headerElement: HTMLElement | null = null;
  private viewTitleElement: HTMLElement | null = null;
  private sidebarElement: HTMLElement | null = null;
  private mainElement: HTMLElement | null = null;
  private panelAreaElement: HTMLElement | null = null;
  private footerElement: HTMLElement | null = null;
  
  /**
   * Create a new game layout
   * @param options Configuration options
   */
  constructor(options: GameLayoutOptions) {
    super('div', 'game-root');
    this.eventBus = options.eventBus;
  }
  
  /**
   * Generate the game layout HTML
   */
  protected createTemplate(): string {
    return `
      <header class="game-header">
        <div class="game-title">SuperInt++</div>
        <div class="view-title" id="view-title"></div>
        <div class="game-controls" id="game-controls"></div>
      </header>
      
      <aside class="game-sidebar" id="game-sidebar"></aside>
      
      <main class="game-main" id="game-main"></main>
      
      <div class="game-panel-area" id="game-panel-area"></div>
      
      <footer class="game-footer">
        <div class="footer-info">v0.1.0</div>
        <div class="footer-controls" id="footer-controls"></div>
      </footer>
    `;
  }
  
  /**
   * Store references to container elements after mount
   */
  protected afterMount(): void {
    try {
      // Get references to all container elements
      this.headerElement = this.element.querySelector('.game-controls');
      this.viewTitleElement = this.element.querySelector('.view-title');
      this.sidebarElement = this.element.querySelector('.game-sidebar');
      this.mainElement = this.element.querySelector('.game-main');
      this.panelAreaElement = this.element.querySelector('.game-panel-area');
      this.footerElement = this.element.querySelector('.footer-controls');

      console.log('GameLayout mounted with elements:', {
        header: !!this.headerElement,
        viewTitle: !!this.viewTitleElement,
        sidebar: !!this.sidebarElement,
        main: !!this.mainElement,
        panelArea: !!this.panelAreaElement,
        footer: !!this.footerElement
      });
      
      // Add a class to indicate the layout is ready
      this.element.classList.add('layout-initialized');
    } catch (error) {
      console.error('Error in GameLayout.afterMount:', error);
    }
  }
  
  /**
   * Mount a component to the view title area
   * @param component Component to mount
   */
  public mountToViewTitle(component: UIComponent): void {
    try {
      if (!this.viewTitleElement) {
        // If we don't have a reference, try to get it again
        this.viewTitleElement = this.element.querySelector('.view-title');
        
        if (!this.viewTitleElement) {
          // Create the element if it doesn't exist
          this.viewTitleElement = document.createElement('div');
          this.viewTitleElement.className = 'view-title';
          const header = this.element.querySelector('.game-header');
          if (header) {
            const gameTitle = header.querySelector('.game-title');
            if (gameTitle) {
              header.insertBefore(this.viewTitleElement, gameTitle.nextSibling);
            } else {
              header.appendChild(this.viewTitleElement);
            }
          } else {
            console.error('Header element not found');
            return;
          }
        }
      }
      
      component.mount(this.viewTitleElement);
    } catch (error) {
      console.error('Error mounting to view title:', error);
    }
  }

  /**
   * Mount a component to the header area
   * @param component Component to mount
   */
  public mountToHeader(component: UIComponent): void {
    try {
      if (!this.headerElement) {
        // If we don't have a reference, try to get it again
        this.headerElement = this.element.querySelector('.game-controls');
        
        if (!this.headerElement) {
          // Create the element if it doesn't exist
          this.headerElement = document.createElement('div');
          this.headerElement.className = 'game-controls';
          const header = this.element.querySelector('.game-header');
          if (header) {
            header.appendChild(this.headerElement);
          } else {
            console.error('Header element not found');
            return;
          }
        }
      }
      
      component.mount(this.headerElement);
    } catch (error) {
      console.error('Error mounting to header:', error);
    }
  }
  
  /**
   * Mount a component to the sidebar
   * @param component Component to mount
   */
  public mountToSidebar(component: UIComponent): void {
    try {
      if (!this.sidebarElement) {
        // If we don't have a reference, try to get it again
        this.sidebarElement = this.element.querySelector('.game-sidebar');
        
        if (!this.sidebarElement) {
          console.error('Sidebar element not found');
          return;
        }
      }
      
      component.mount(this.sidebarElement);
    } catch (error) {
      console.error('Error mounting to sidebar:', error);
    }
  }
  
  /**
   * Mount a component to the main area
   * @param component Component to mount
   */
  public mountToMain(component: UIComponent): void {
    try {
      if (!this.mainElement) {
        // If we don't have a reference, try to get it again
        this.mainElement = this.element.querySelector('.game-main');
        
        if (!this.mainElement) {
          console.error('Main element not found');
          return;
        }
      }
      
      component.mount(this.mainElement);
    } catch (error) {
      console.error('Error mounting to main area:', error);
    }
  }
  
  /**
   * Mount a component to the panel area
   * @param component Component to mount
   */
  public mountToPanelArea(component: UIComponent): void {
    try {
      if (!this.panelAreaElement) {
        // If we don't have a reference, try to get it again
        this.panelAreaElement = this.element.querySelector('.game-panel-area');
        
        if (!this.panelAreaElement) {
          console.error('Panel area element not found');
          return;
        }
      }
      
      component.mount(this.panelAreaElement);
    } catch (error) {
      console.error('Error mounting to panel area:', error);
    }
  }
  
  /**
   * Mount a component to the footer
   * @param component Component to mount
   */
  public mountToFooter(component: UIComponent): void {
    try {
      if (!this.footerElement) {
        // If we don't have a reference, try to get it again
        this.footerElement = this.element.querySelector('.footer-controls');
        
        if (!this.footerElement) {
          // Create the element if it doesn't exist
          this.footerElement = document.createElement('div');
          this.footerElement.className = 'footer-controls';
          const footer = this.element.querySelector('.game-footer');
          if (footer) {
            footer.appendChild(this.footerElement);
          } else {
            console.error('Footer element not found');
            return;
          }
        }
      }
      
      component.mount(this.footerElement);
    } catch (error) {
      console.error('Error mounting to footer:', error);
    }
  }
  
  /**
   * Update all mounted components with new game state
   */
  public update(gameState: Readonly<any>): void {
    super.update(gameState);
  }
}

export default GameLayout;