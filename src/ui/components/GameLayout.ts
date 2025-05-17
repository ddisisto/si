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
        <div class="game-controls"></div>
      </header>
      
      <aside class="game-sidebar"></aside>
      
      <main class="game-main"></main>
      
      <div class="game-panel-area"></div>
      
      <footer class="game-footer">
        <div class="footer-info">v0.1.0</div>
        <div class="footer-controls"></div>
      </footer>
    `;
  }
  
  /**
   * Store references to container elements after mount
   */
  protected afterMount(): void {
    this.headerElement = this.element.querySelector('.game-header');
    this.sidebarElement = this.element.querySelector('.game-sidebar');
    this.mainElement = this.element.querySelector('.game-main');
    this.panelAreaElement = this.element.querySelector('.game-panel-area');
    this.footerElement = this.element.querySelector('.game-footer');
  }
  
  /**
   * Mount a component to the header area
   * @param component Component to mount
   */
  public mountToHeader(component: UIComponent): void {
    if (this.headerElement) {
      component.mount(this.headerElement);
    }
  }
  
  /**
   * Mount a component to the sidebar
   * @param component Component to mount
   */
  public mountToSidebar(component: UIComponent): void {
    if (this.sidebarElement) {
      component.mount(this.sidebarElement);
    }
  }
  
  /**
   * Mount a component to the main area
   * @param component Component to mount
   */
  public mountToMain(component: UIComponent): void {
    if (this.mainElement) {
      component.mount(this.mainElement);
    }
  }
  
  /**
   * Mount a component to the panel area
   * @param component Component to mount
   */
  public mountToPanelArea(component: UIComponent): void {
    if (this.panelAreaElement) {
      component.mount(this.panelAreaElement);
    }
  }
  
  /**
   * Mount a component to the footer
   * @param component Component to mount
   */
  public mountToFooter(component: UIComponent): void {
    if (this.footerElement) {
      component.mount(this.footerElement);
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