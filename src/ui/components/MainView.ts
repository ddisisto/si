/**
 * MainView - Primary view for the main game area
 */

import UIComponent from './UIComponent';

/**
 * Primary view component for the main game area
 */
class MainView extends UIComponent {
  /**
   * Create a new main view
   */
  constructor() {
    super('div', 'main-view');
  }
  
  /**
   * Generate the main view HTML
   */
  protected createTemplate(): string {
    return `
      <div class="main-content">
        <h2>SuperInt++</h2>
        <p>Welcome to the SuperInt++ strategic simulation game about AI development and its consequences.</p>
        <div class="main-section">
          <h3>Getting Started</h3>
          <p>Begin by allocating resources to research in the research tree. End your turn to see the results.</p>
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
}

export default MainView;