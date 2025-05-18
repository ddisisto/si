/**
 * SaveLoadPanel - UI component for game saving and loading
 */

import UIComponent from './UIComponent';
import { EventBus } from '../../core';

interface SaveLoadPanelOptions {
  eventBus: EventBus;
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
  constructor(options: SaveLoadPanelOptions) {
    super('div', 'save-load-panel');
    // We need to set eventBus here to ensure it's available from the start
    this.eventBus = options.eventBus;
    console.log('SaveLoadPanel constructor: EventBus is', this.eventBus ? 'available' : 'NOT AVAILABLE');
    
    // Get existing saves from localStorage
    this.refreshSavesList();
  }
  
  /**
   * Called after component is mounted
   * Set up event subscriptions
   */
  protected afterMount(): void {
    // Subscribe to save related events
    console.log('SaveLoadPanel.afterMount: EventBus is', this.eventBus ? 'available' : 'NOT AVAILABLE');
    if (this.eventBus) {
      console.log('SaveLoadPanel: Subscribing to game:saved and game:loaded events');
      this.eventBus.subscribe('game:saved', this.refreshSavesList.bind(this));
      this.eventBus.subscribe('game:loaded', this.handleGameLoaded.bind(this));
    } else {
      console.error('SaveLoadPanel: No eventBus available for subscribing');
    }
  }
  
  /**
   * Refresh the list of available saves
   */
  private refreshSavesList(): void {
    this.saves = [];
    
    try {
      console.log('SaveLoadPanel: Refreshing saves list...');
      console.log(`SaveLoadPanel: localStorage contains ${localStorage.length} items`);
      
      // Get all keys from localStorage that start with si_save_
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`SaveLoadPanel: Checking localStorage key: ${key}`);
        
        if (key && key.startsWith('si_save_')) {
          const saveData = localStorage.getItem(key);
          if (saveData) {
            const parsed = JSON.parse(saveData);
            const saveName = key.replace('si_save_', '');
            console.log(`SaveLoadPanel: Found save: ${saveName}, timestamp: ${new Date(parsed.timestamp).toLocaleString()}`);
            
            this.saves.push({
              name: saveName,
              timestamp: parsed.timestamp
            });
          }
        }
      }
      
      // Sort saves by timestamp (newest first)
      this.saves.sort((a, b) => b.timestamp - a.timestamp);
      console.log(`SaveLoadPanel: Found ${this.saves.length} total saves`);
      
      // Re-render to show updated saves list
      this.render();
    } catch (error) {
      console.error('Error loading saves list:', error);
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
    console.log('SaveLoadPanel.handleShowSaveDialog: EventBus is', this.eventBus ? 'available' : 'NOT AVAILABLE');
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
    console.log('SaveLoadPanel.handleLoadSave: EventBus is', this.eventBus ? 'available' : 'NOT AVAILABLE');
    const button = event.target as HTMLButtonElement;
    const saveName = button.getAttribute('data-save');
    
    if (saveName && this.eventBus) {
      console.log(`SaveLoadPanel: Loading save "${saveName}"`);
      this.eventBus.emit('action:load', { name: saveName });
      console.log(`SaveLoadPanel: Emitted action:load event for "${saveName}"`);
    } else if (!this.eventBus) {
      console.error('SaveLoadPanel: No eventBus available for emitting action:load event');
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
        console.log(`SaveLoadPanel: Deleting save "${saveName}"`);
        localStorage.removeItem(`si_save_${saveName}`);
        this.refreshSavesList();
      } catch (error) {
        console.error(`Error deleting save ${saveName}:`, error);
      }
    }
  };
  
  /**
   * Save the current game
   */
  private handleSaveGame = (): void => {
    console.log('SaveLoadPanel.handleSaveGame: EventBus is', this.eventBus ? 'available' : 'NOT AVAILABLE');
    if (this.eventBus) {
      const saveName = this.saveNameInput || 'Game Save';
      console.log(`SaveLoadPanel: Saving game as "${saveName}"`);
      this.eventBus.emit('action:save', { name: saveName });
      console.log(`SaveLoadPanel: Emitted action:save event for "${saveName}"`);
      this.handleHideDialog();
    } else {
      console.error('SaveLoadPanel: No eventBus available for emitting action:save event');
    }
  };
  
  /**
   * Handle auto-save toggle
   */
  private handleAutoSaveToggle = (event: Event): void => {
    console.log('SaveLoadPanel.handleAutoSaveToggle: EventBus is', this.eventBus ? 'available' : 'NOT AVAILABLE');
    const checkbox = event.target as HTMLInputElement;
    if (this.eventBus) {
      console.log(`SaveLoadPanel: Setting auto-save to ${checkbox.checked}`);
      this.eventBus.emit('action:queue', {
        action: {
          type: 'UPDATE_SETTINGS',
          payload: {
            autoSave: checkbox.checked
          }
        }
      });
      
      console.log(`SaveLoadPanel: Emitted action:queue for UPDATE_SETTINGS with autoSave=${checkbox.checked}`);
      console.log(`SaveLoadPanel: Auto-save ${checkbox.checked ? 'enabled' : 'disabled'}`);
    } else {
      console.error('SaveLoadPanel: No eventBus available for emitting action:queue event');
    }
  };
}

export default SaveLoadPanel;