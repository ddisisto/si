/**
 * Research UI components
 */

import ResearchTreeView from './ResearchTreeView';
import UIComponent from '../UIComponent';

/**
 * Component for displaying the research tree title in the game header
 */
class ResearchTreeHeader extends UIComponent {
  constructor() {
    super('div', 'research-tree-header');
  }
  
  protected createTemplate(): string {
    return `
      <h2>Research Tree</h2>
      <button id="back-to-main" class="btn-secondary">Back to Main</button>
    `;
  }
  
  protected bindEvents(): void {
    const backButton = this.element.querySelector('#back-to-main');
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.emit('ui:back_to_main', {});
      });
    }
  }
}

export {
  ResearchTreeView,
  ResearchTreeHeader
};