/**
 * SaveLoadPanel - UI component for game saving and loading
 */

import UIComponent from './UIComponent';
import Logger from '../../utils/Logger';

interface SaveLoadPanelOptions {
  eventBus?: any;
}

/**
 * Component for save and load game controls
 */
class SaveLoadPanel extends UIComponent {
  private saves: Array<{name: string, timestamp: number}> = [];
  private showingLoadDialog: boolean = false;
  private saveNameInput: string = '';
  
  /**
   * Create new save/load panel
   * @param options Configuration options
   */
  constructor(_options?: SaveLoadPanelOptions) {
    super('div', 'save-load-panel');
    
    // Get existing saves from localStorage
    this.refreshSavesList();
  }
  
  /**
   * Called after component is mounted
   * Set up event subscriptions
   */
  protected afterMount(): void {
    // Subscribe to save related events
    this.subscribe('game:saved', this.refreshSavesList.bind(this));
    this.subscribe('game:loaded', this.handleGameLoaded.bind(this));
  }
  
  /**
   * Refresh the list of available saves
   */
  private refreshSavesList(): void {
    this.saves = [];
    
    try {
      // Check localStorage for saved games
      
      // Get all keys from localStorage that start with si_save_
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('si_save_')) {
          const saveData = localStorage.getItem(key);
          if (saveData) {
            const parsed = JSON.parse(saveData);
            const saveName = key.replace('si_save_', '');
            
            this.saves.push({
              name: saveName,
              timestamp: parsed.timestamp
            });
          }
        }
      }
      
      // Sort saves by timestamp (newest first)
      this.saves.sort((a, b) => b.timestamp - a.timestamp);
      // Sort and display saves
      
      // Re-render to show updated saves list
      this.render();
    } catch (error) {
      Logger.error('Error loading saves list:', error);
    }
  }
  
  /**
   * Update state when a game is loaded
   */
  private handleGameLoaded(): void {
    this.showingLoadDialog = false;
    this.render();
  }
  
  /**
   * Generate the save/load panel HTML
   */
  protected createTemplate(): string {
    const lastSaved = this.gameState?.meta.lastSaved;
    const lastSavedText = lastSaved ? `Last saved: ${new Date(lastSaved).toLocaleString()}` : 'Not saved yet';
    
    // If showing load dialog, render the load UI
    if (this.showingLoadDialog) {
      return this.createLoadDialogTemplate();
    }
    
    return `
      <div class="save-load-buttons">
        <button class="btn-success btn-small save-button">Save Game</button>
        <button class="btn-info btn-small load-button">Load Game</button>
      </div>
      <div class="save-info">
        <div class="last-saved">${lastSavedText}</div>
        <div class="auto-save">
          <label for="auto-save-toggle">Auto-save:</label>
          <input type="checkbox" id="auto-save-toggle" ${this.gameState?.settings.autoSave ? 'checked' : ''}>
        </div>
      </div>
    `;
  }
  
  /**
   * Create the template for the load dialog
   */
  private createLoadDialogTemplate(): string {
    let savesList = '';
    
    if (this.saves.length === 0) {
      savesList = '<div class="no-saves">No saved games found</div>';
    } else {
      savesList = '<div class="saves-list">';
      this.saves.forEach(save => {
        const date = new Date(save.timestamp).toLocaleString();
        savesList += `
          <div class="save-item" data-save="${save.name}">
            <span class="save-name">${save.name}</span>
            <span class="save-date">${date}</span>
            <button class="btn-info btn-small load-save-button" data-save="${save.name}">Load</button>
            <button class="btn-danger btn-small delete-save-button" data-save="${save.name}">Delete</button>
          </div>
        `;
      });
      savesList += '</div>';
    }
    
    return `
      <div class="load-dialog">
        <h3>Load Game</h3>
        ${savesList}
        <button class="btn-secondary btn-small back-button">Back</button>
      </div>
    `;
  }
  
  /**
   * Create the template for the save dialog
   */
  private createSaveDialogTemplate(): string {
    return `
      <div class="save-dialog">
        <h3>Save Game</h3>
        <div class="save-form">
          <label for="save-name">Save Name:</label>
          <input type="text" id="save-name" value="${this.saveNameInput || 'Game Save'}">
          <div class="save-buttons">
            <button class="btn-success btn-small confirm-save-button">Save</button>
            <button class="btn-secondary btn-small cancel-save-button">Cancel</button>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Bind event handlers after rendering
   */
  protected bindEvents(): void {
    // Handle save button click
    const saveButton = this.element.querySelector('.save-button');
    if (saveButton) {
      saveButton.removeEventListener('click', this.handleShowSaveDialog);
      saveButton.addEventListener('click', this.handleShowSaveDialog);
    }
    
    // Handle load button click
    const loadButton = this.element.querySelector('.load-button');
    if (loadButton) {
      loadButton.removeEventListener('click', this.handleShowLoadDialog);
      loadButton.addEventListener('click', this.handleShowLoadDialog);
    }
    
    // Handle auto-save toggle
    const autoSaveToggle = this.element.querySelector('#auto-save-toggle');
    if (autoSaveToggle) {
      autoSaveToggle.removeEventListener('change', this.handleAutoSaveToggle);
      autoSaveToggle.addEventListener('change', this.handleAutoSaveToggle);
    }
    
    // If showing load dialog, bind those events
    if (this.showingLoadDialog) {
      // Back button
      const backButton = this.element.querySelector('.back-button');
      if (backButton) {
        backButton.removeEventListener('click', this.handleHideDialog);
        backButton.addEventListener('click', this.handleHideDialog);
      }
      
      // Load save buttons
      const loadSaveButtons = this.element.querySelectorAll('.load-save-button');
      loadSaveButtons.forEach(button => {
        button.removeEventListener('click', this.handleLoadSave);
        button.addEventListener('click', this.handleLoadSave);
      });
      
      // Delete save buttons
      const deleteSaveButtons = this.element.querySelectorAll('.delete-save-button');
      deleteSaveButtons.forEach(button => {
        button.removeEventListener('click', this.handleDeleteSave);
        button.addEventListener('click', this.handleDeleteSave);
      });
    }
    
    // If showing save dialog, bind those events
    const saveNameInput = this.element.querySelector('#save-name');
    if (saveNameInput) {
      saveNameInput.removeEventListener('input', this.handleSaveNameInput);
      saveNameInput.addEventListener('input', this.handleSaveNameInput);
      
      const confirmSaveButton = this.element.querySelector('.confirm-save-button');
      if (confirmSaveButton) {
        confirmSaveButton.removeEventListener('click', this.handleSaveGame);
        confirmSaveButton.addEventListener('click', this.handleSaveGame);
      }
      
      const cancelSaveButton = this.element.querySelector('.cancel-save-button');
      if (cancelSaveButton) {
        cancelSaveButton.removeEventListener('click', this.handleHideDialog);
        cancelSaveButton.addEventListener('click', this.handleHideDialog);
      }
    }
  }
  
  /**
   * Show the load dialog
   */
  private handleShowLoadDialog = (): void => {
    this.showingLoadDialog = true;
    this.refreshSavesList();
    this.render();
  };
  
  /**
   * Show the save dialog
   */
  private handleShowSaveDialog = (): void => {
    // Replace the current template with the save dialog
    this.element.innerHTML = this.createSaveDialogTemplate();
    this.bindEvents();
    
    // Focus the save name input
    const saveNameInput = this.element.querySelector('#save-name') as HTMLInputElement;
    if (saveNameInput) {
      saveNameInput.focus();
      saveNameInput.select();
    }
  };
  
  /**
   * Handle save name input changes
   */
  private handleSaveNameInput = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    this.saveNameInput = input.value;
  };
  
  /**
   * Hide the current dialog
   */
  private handleHideDialog = (): void => {
    this.showingLoadDialog = false;
    this.render();
  };
  
  /**
   * Load a saved game
   */
  private handleLoadSave = (event: Event): void => {
    const button = event.target as HTMLButtonElement;
    const saveName = button.getAttribute('data-save');
    
    if (saveName) {
      this.emit('action:load', { name: saveName });
    }
  };
  
  /**
   * Delete a saved game
   */
  private handleDeleteSave = (event: Event): void => {
    const button = event.target as HTMLButtonElement;
    const saveName = button.getAttribute('data-save');
    
    if (saveName) {
      try {
        Logger.info(`SaveLoadPanel: Deleting save "${saveName}"`);
        localStorage.removeItem(`si_save_${saveName}`);
        this.refreshSavesList();
      } catch (error) {
        Logger.error(`Error deleting save ${saveName}:`, error);
      }
    }
  };
  
  /**
   * Save the current game
   */
  private handleSaveGame = (): void => {
    const saveName = this.saveNameInput || 'Game Save';
    this.emit('action:save', { name: saveName });
    this.handleHideDialog();
  };
  
  /**
   * Handle auto-save toggle
   */
  private handleAutoSaveToggle = (event: Event): void => {
    const checkbox = event.target as HTMLInputElement;
    this.emit('action:queue', {
      action: {
        type: 'UPDATE_SETTINGS',
        payload: {
          autoSave: checkbox.checked
        }
      }
    });
    // Auto-save change will be logged by EventBus
  };
}

export default SaveLoadPanel;