/**
 * Button - Standardized button component system
 */

import UIComponent from './UIComponent';

export type ButtonType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonOptions {
  text: string;
  type?: ButtonType;
  size?: ButtonSize;
  className?: string;
  onClick?: (event: MouseEvent) => void;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  title?: string;
  fullWidth?: boolean;
}

/**
 * Standardized button component with configurable appearance and behavior
 */
class Button extends UIComponent {
  private text: string;
  private type: ButtonType;
  private size: ButtonSize;
  private onClick?: (event: MouseEvent) => void;
  private disabled: boolean;
  private icon?: string;
  private iconPosition: 'left' | 'right';
  private title?: string;
  private _fullWidth: boolean;
  
  /**
   * Create a new button
   * @param options Button configuration options
   */
  constructor(options: ButtonOptions) {
    const type = options.type || 'secondary';
    const size = options.size || 'medium';
    
    // Build class list for button
    const classNames = ['game-button', `btn-${type}`, `btn-${size}`];
    
    // Add custom class if provided
    if (options.className) {
      classNames.push(options.className);
    }
    
    // Add full width class if needed
    if (options.fullWidth) {
      classNames.push('btn-full-width');
    }
    
    // Add icon-only class if there's an icon but no text
    if (options.icon && !options.text.trim()) {
      classNames.push('btn-icon-only');
    }
    
    super('button', classNames.join(' '));
    
    this.text = options.text;
    this.type = type;
    this.size = size;
    this.onClick = options.onClick;
    this.disabled = options.disabled || false;
    this.icon = options.icon;
    this.iconPosition = options.iconPosition || 'left';
    this.title = options.title;
    this._fullWidth = options.fullWidth || false;
    
    // Set initial attributes
    if (this.disabled) {
      this.element.setAttribute('disabled', 'disabled');
    }
    
    if (this.title) {
      this.element.setAttribute('title', this.title);
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
   * Update button type
   * @param type New button type
   */
  public setType(type: ButtonType): void {
    // Remove old type class
    this.element.classList.remove(`btn-${this.type}`);
    
    // Set new type
    this.type = type;
    this.element.classList.add(`btn-${type}`);
  }
  
  /**
   * Update button size
   * @param size New button size
   */
  public setSize(size: ButtonSize): void {
    // Remove old size class
    this.element.classList.remove(`btn-${this.size}`);
    
    // Set new size
    this.size = size;
    this.element.classList.add(`btn-${size}`);
  }
  
  /**
   * Set button icon
   * @param icon Icon content (emoji, text, or html)
   * @param position Position of the icon (left or right)
   */
  public setIcon(icon?: string, position: 'left' | 'right' = 'left'): void {
    this.icon = icon;
    this.iconPosition = position;
    this.render();
    
    // Add or remove icon-only class if needed
    if (icon && !this.text.trim()) {
      this.element.classList.add('btn-icon-only');
    } else {
      this.element.classList.remove('btn-icon-only');
    }
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
   * Set whether the button should take up full width
   * @param fullWidth Whether the button should be full width
   */
  public setFullWidth(fullWidth: boolean): void {
    this._fullWidth = fullWidth;
    
    if (fullWidth) {
      this.element.classList.add('btn-full-width');
    } else {
      this.element.classList.remove('btn-full-width');
    }
  }
  
  /**
   * Generate the button's HTML
   */
  protected createTemplate(): string {
    // Prepare full width class for styling
    const fullWidthClass = this._fullWidth ? 'full-width' : '';
    
    // If we have an icon but no text, create an icon-only button
    if (this.icon && !this.text.trim()) {
      return `<span class="btn-icon ${fullWidthClass}">${this.icon}</span>`;
    }
    
    // If we have an icon and text, create a button with icon and text
    if (this.icon) {
      if (this.iconPosition === 'left') {
        return `<span class="btn-icon">${this.icon}</span><span class="btn-text ${fullWidthClass}">${this.text}</span>`;
      } else {
        return `<span class="btn-text ${fullWidthClass}">${this.text}</span><span class="btn-icon">${this.icon}</span>`;
      }
    }
    
    // Simple text button
    return `<span class="btn-text ${fullWidthClass}">${this.text}</span>`;
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
  
  /**
   * Create a primary button
   */
  public static primary(text: string, onClick?: (event: MouseEvent) => void, options: Partial<ButtonOptions> = {}): Button {
    return new Button({
      text,
      onClick,
      type: 'primary',
      ...options
    });
  }
  
  /**
   * Create a secondary button
   */
  public static secondary(text: string, onClick?: (event: MouseEvent) => void, options: Partial<ButtonOptions> = {}): Button {
    return new Button({
      text,
      onClick,
      type: 'secondary',
      ...options
    });
  }
  
  /**
   * Create a success button
   */
  public static success(text: string, onClick?: (event: MouseEvent) => void, options: Partial<ButtonOptions> = {}): Button {
    return new Button({
      text,
      onClick,
      type: 'success',
      ...options
    });
  }
  
  /**
   * Create a danger button
   */
  public static danger(text: string, onClick?: (event: MouseEvent) => void, options: Partial<ButtonOptions> = {}): Button {
    return new Button({
      text,
      onClick,
      type: 'danger',
      ...options
    });
  }
  
  /**
   * Create an icon button
   */
  public static icon(icon: string, onClick?: (event: MouseEvent) => void, options: Partial<ButtonOptions> = {}): Button {
    return new Button({
      text: '',
      icon,
      onClick,
      ...options
    });
  }
  
  /**
   * Create a small button
   */
  public static small(text: string, onClick?: (event: MouseEvent) => void, options: Partial<ButtonOptions> = {}): Button {
    return new Button({
      text,
      onClick,
      size: 'small',
      ...options
    });
  }
}

export default Button;