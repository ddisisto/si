/**
 * Panel - Basic container component for grouping UI elements
 */

import UIComponent from './UIComponent';

interface PanelOptions {
  title?: string;
  className?: string;
  contentClassName?: string;
}

/**
 * Panel component for containing related UI elements
 */
class Panel extends UIComponent {
  private title?: string;
  private contentClassName: string;
  private children: UIComponent[] = [];
  
  /**
   * Create a new panel
   * @param options Panel configuration options
   */
  constructor(options: PanelOptions = {}) {
    super('div', `game-panel ${options.className || ''}`);
    
    this.title = options.title;
    this.contentClassName = options.contentClassName || 'panel-content';
  }
  
  /**
   * Add a child component to this panel
   * @param component Child component to add
   */
  public addChild(component: UIComponent): void {
    this.children.push(component);
    
    // If the panel is already in the DOM, mount the child immediately
    if (this.element.isConnected) {
      const contentElement = this.element.querySelector(`.${this.contentClassName}`);
      if (contentElement) {
        component.mount(contentElement as HTMLElement);
      }
    }
  }
  
  /**
   * Remove a child component from this panel
   * @param component Child component to remove
   */
  public removeChild(component: UIComponent): void {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
      component.unmount();
    }
  }
  
  /**
   * Update panel and all children with new game state
   * @param gameState Current game state
   */
  public update(gameState: Readonly<any>): void {
    super.update(gameState);
    
    // Update all children with the new state
    this.children.forEach(child => {
      child.update(gameState);
    });
  }
  
  /**
   * Generate the panel's HTML
   */
  protected createTemplate(): string {
    let titleHtml = '';
    
    if (this.title) {
      titleHtml = `<div class="panel-title">${this.title}</div>`;
    }
    
    return `
      ${titleHtml}
      <div class="${this.contentClassName}"></div>
    `;
  }
  
  /**
   * Re-mount children after rendering
   */
  protected afterMount(): void {
    // Get the content element
    const contentElement = this.element.querySelector(`.${this.contentClassName}`);
    
    if (contentElement) {
      // Mount all children to the content element
      this.children.forEach(child => {
        child.mount(contentElement as HTMLElement);
      });
    }
  }
  
  /**
   * Set panel title
   * @param title New panel title
   */
  public setTitle(title: string): void {
    this.title = title;
    this.render();
  }
}

export default Panel;