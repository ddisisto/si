/**
 * ResearchFilters - Component for filtering research nodes
 */

import UIComponent from '../../UIComponent';

export interface FilterState {
  categories: Record<string, boolean>;
  statuses: Record<string, boolean>;
}

export interface FilterChangeEvent {
  filterType: 'category' | 'status';
  filterValue: string;
  enabled: boolean;
}

/**
 * Component for filtering research nodes by category and status
 */
export class ResearchFilters extends UIComponent {
  private categoryFilters: Record<string, boolean> = {
    'Foundations': true,
    'Scaling': true,
    'Capabilities': true,
    'Infrastructure': true,
    'Agency': true,
    'Alignment': true,
    'Uncategorized': true
  };
  
  private statusFilters: Record<string, boolean> = {
    'available': true,
    'in_progress': true,
    'completed': true,
    'locked': true
  };
  
  private isFilterPanelVisible: boolean = false;
  private openDropdowns: Set<string> = new Set();
  private onFilterChange?: (event: FilterChangeEvent) => void;
  
  // Bound event handlers
  private boundHandleToggleFilterPanel: (event: Event) => void;
  private boundHandleToggleDropdown: (event: Event) => void;
  private boundHandleSelectFilterOption: (event: Event) => void;
  private boundHandleCloseFilter: (event: Event) => void;
  private boundHandleClickOutside: (event: Event) => void;
  
  constructor(onFilterChange?: (event: FilterChangeEvent) => void) {
    super('div', 'research-filters');
    this.onFilterChange = onFilterChange;
    
    // Bind event handlers
    this.boundHandleToggleFilterPanel = this.handleToggleFilterPanel.bind(this);
    this.boundHandleToggleDropdown = this.handleToggleDropdown.bind(this);
    this.boundHandleSelectFilterOption = this.handleSelectFilterOption.bind(this);
    this.boundHandleCloseFilter = this.handleCloseFilter.bind(this);
    this.boundHandleClickOutside = this.handleClickOutside.bind(this);
  }
  
  /**
   * Generate the filter panel HTML
   */
  protected createTemplate(): string {
    return `
      <button class="filter-toggle btn-compact btn-secondary" title="Filter Nodes">
        ⊙ Filter
      </button>
      <div class="filter-panel ${this.isFilterPanelVisible ? 'visible' : ''}">
        <div class="filter-panel-header">
          <h3>Filter Nodes</h3>
          <button class="close-filter btn-compact btn-secondary">×</button>
        </div>
        <div class="filter-panel-content">
          ${this.createFilterDropdown('category', 'Categories', this.categoryFilters)}
          ${this.createFilterDropdown('status', 'Status', this.statusFilters)}
        </div>
      </div>
    `;
  }
  
  /**
   * Create a filter dropdown
   */
  private createFilterDropdown(type: string, label: string, filters: Record<string, boolean>): string {
    const isOpen = this.openDropdowns.has(type);
    const selectedCount = Object.values(filters).filter(v => v).length;
    const totalCount = Object.keys(filters).length;
    
    return `
      <div class="filter-dropdown ${isOpen ? 'open' : ''}" data-filter-type="${type}">
        <div class="dropdown-header">
          <label>${label}</label>
          <div class="dropdown-selected" data-dropdown="${type}">
            <span>${selectedCount} of ${totalCount}</span>
            <span class="dropdown-arrow">▼</span>
          </div>
        </div>
        <div class="dropdown-content">
          ${Object.entries(filters).map(([key, value]) => `
            <label class="dropdown-option" data-filter-type="${type}" data-filter-value="${key}">
              <input type="checkbox" ${value ? 'checked' : ''}>
              <span>${this.formatFilterLabel(key)}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  /**
   * Format filter label for display
   */
  private formatFilterLabel(key: string): string {
    switch (key) {
      case 'in_progress': return 'In Progress';
      case 'available': return 'Available';
      case 'completed': return 'Completed';
      case 'locked': return 'Locked';
      default: return key;
    }
  }
  
  /**
   * Set up event listeners after render
   */
  protected setupEvents(): void {
    const filterToggle = this.element.querySelector('.filter-toggle');
    const closeFilter = this.element.querySelector('.close-filter');
    
    if (filterToggle) {
      filterToggle.addEventListener('click', this.boundHandleToggleFilterPanel);
    }
    if (closeFilter) {
      closeFilter.addEventListener('click', this.boundHandleCloseFilter);
    }
    
    // Dropdown toggles
    const dropdownSelects = this.element.querySelectorAll('.dropdown-selected');
    dropdownSelects.forEach(dropdown => {
      dropdown.addEventListener('click', this.boundHandleToggleDropdown);
    });
    
    // Filter options
    const filterOptions = this.element.querySelectorAll('.dropdown-option');
    filterOptions.forEach(option => {
      option.addEventListener('click', this.boundHandleSelectFilterOption);
    });
    
    // Click outside to close
    document.addEventListener('click', this.boundHandleClickOutside);
  }
  
  /**
   * Handle filter panel toggle
   */
  private handleToggleFilterPanel(event: Event): void {
    event.stopPropagation();
    this.isFilterPanelVisible = !this.isFilterPanelVisible;
    this.render();
  }
  
  /**
   * Handle close filter button
   */
  private handleCloseFilter(event: Event): void {
    event.stopPropagation();
    this.isFilterPanelVisible = false;
    this.render();
  }
  
  /**
   * Handle dropdown toggle
   */
  private handleToggleDropdown(event: Event): void {
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    const dropdownType = target.getAttribute('data-dropdown');
    
    if (!dropdownType) return;
    
    if (this.openDropdowns.has(dropdownType)) {
      this.openDropdowns.delete(dropdownType);
    } else {
      this.openDropdowns.clear();
      this.openDropdowns.add(dropdownType);
    }
    
    this.render();
  }
  
  /**
   * Handle filter option selection
   */
  private handleSelectFilterOption(event: Event): void {
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    const filterType = target.getAttribute('data-filter-type');
    const filterValue = target.getAttribute('data-filter-value');
    
    if (!filterType || !filterValue) return;
    
    // Toggle the filter value
    if (filterType === 'category') {
      this.categoryFilters[filterValue] = !this.categoryFilters[filterValue];
    } else if (filterType === 'status') {
      this.statusFilters[filterValue] = !this.statusFilters[filterValue];
    }
    
    // Notify parent component
    if (this.onFilterChange) {
      this.onFilterChange({
        filterType: filterType as 'category' | 'status',
        filterValue,
        enabled: filterType === 'category' ? 
          this.categoryFilters[filterValue] : 
          this.statusFilters[filterValue]
      });
    }
    
    this.render();
  }
  
  /**
   * Handle click outside to close dropdowns/panel
   */
  private handleClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const isInsideFilter = this.element.contains(target);
    
    if (!isInsideFilter) {
      if (this.openDropdowns.size > 0) {
        this.openDropdowns.clear();
        this.render();
      }
      if (this.isFilterPanelVisible) {
        this.isFilterPanelVisible = false;
        this.render();
      }
    }
  }
  
  /**
   * Get current filter state
   */
  public getFilterState(): FilterState {
    return {
      categories: { ...this.categoryFilters },
      statuses: { ...this.statusFilters }
    };
  }
  
  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    super.cleanup();
    document.removeEventListener('click', this.boundHandleClickOutside);
  }
}