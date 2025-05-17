/**
 * Button - Reusable button component
 */

import UIComponent from './UIComponent';

interface ButtonOptions {
  text: string;
  className?: string;
  onClick?: (event: MouseEvent) => void;
  disabled?: boolean;
}

/**
 * Reusable button component with customizable appearance and behavior
 */
class Button extends UIComponent {
  private text: string;
  private onClick?: (event: MouseEvent) => void;
  private disabled: boolean;
  
  /**
   * Create a new button
   * @param options Button configuration options
   */
  constructor(options: ButtonOptions) {
    super('button', `game-button ${options.className || ''}`);
    
    this.text = options.text;
    this.onClick = options.onClick;
    this.disabled = options.disabled || false;
    
    // Set initial attributes
    if (this.disabled) {
      this.element.setAttribute('disabled', 'disabled');
    }
  }
  
  /**
   * Update button text
   * @param text New button text
   */
  public setText(text: string): void {
    this.text = text;
    this.render();
  }
  
  /**
   * Set click handler
   * @param onClick Click event handler
   */
  public setClickHandler(onClick: (event: MouseEvent) => void): void {
    this.onClick = onClick;
    
    // Rebind events if already mounted
    if (this.element.isConnected) {
      this.bindEvents();
    }
  }
  
  /**
   * Enable or disable the button
   * @param disabled Whether the button should be disabled
   */
  public setDisabled(disabled: boolean): void {
    this.disabled = disabled;
    
    if (disabled) {
      this.element.setAttribute('disabled', 'disabled');
    } else {
      this.element.removeAttribute('disabled');
    }
  }
  
  /**
   * Generate the button's HTML
   */
  protected createTemplate(): string {
    return this.text;
  }
  
  /**
   * Bind click event after rendering
   */
  protected bindEvents(): void {
    // Remove existing listeners first to avoid duplicates
    this.element.removeEventListener('click', this.handleClick);
    
    // Add new click listener if we have a handler
    if (this.onClick) {
      this.element.addEventListener('click', this.handleClick);
    }
  }
  
  /**
   * Internal click handler
   */
  private handleClick = (event: MouseEvent): void => {
    if (this.onClick && !this.disabled) {
      this.onClick(event);
    }
  };
}

export default Button;