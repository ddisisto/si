# UI Component System

This document outlines the standardized UI component design system for SuperInt++, which ensures consistent visual language and user experience across the application.

## Design Principles

1. **Consistency** - Use standardized components with predictable behavior
2. **Modularity** - Components should be self-contained and reusable
3. **Accessibility** - Ensure all components are accessible
4. **Progressive Disclosure** - Show complexity progressively, aligned with our design philosophy
5. **Responsiveness** - Components adapt to different screen sizes
6. **Performance** - Optimize for DOM rendering performance
7. **Simplicity** - Use direct HTML + CSS when possible to reduce complexity

## Component Architecture

### Implementation Approach

SuperInt++ uses a lightweight UI approach that distinguishes between:

1. **Complex UI Components** - Use UIComponent base class for panels, views, and stateful components
2. **Simple HTML Elements** - Use plain HTML with CSS classes for buttons, labels, and other simple elements

This approach:
- Minimizes complexity by leveraging the browser's native elements
- Maintains semantic HTML for accessibility
- Reduces JavaScript overhead
- Avoids over-engineering simple UI elements
- Provides component structure only where needed

### When to Use UIComponent

**Use UIComponent for:**
- Complex UI panels (ResourcePanel, SaveLoadPanel, MainView)
- Components that need game state updates
- Components with lifecycle requirements (mount/unmount)
- Components requiring event handling and EventBus integration
- Multi-element layouts with internal behavior

**Use Plain HTML for:**
- Buttons (use `<button class="btn-primary">`)
- Simple labels and text elements
- Basic containers without state management
- Elements that don't need game state updates
- Pure presentational elements

### Base Component Structure

The `UIComponent` class provides structure for complex UI components:

```typescript
abstract class UIComponent {
  protected element: HTMLElement;
  protected gameState: Readonly<GameState> | null;
  protected gameEngine: GameEngineInterface | null;
  
  constructor(elementType: string, className?: string);
  public mount(parent: HTMLElement): void;
  public unmount(): void;
  public update(gameState: Readonly<GameState>): void;
  public render(): void;
  protected abstract createTemplate(): string;
  protected bindEvents(): void;
  
  // Helper methods for event handling
  protected emit(event: string, data: any): void;
  protected subscribe(event: string, handler: (data: any) => void): void;
}
```

Key features:
- DOM element creation and lifecycle management
- Game state integration and automatic updates
- Event binding and communication through GameEngine
- Template-based rendering with HTML strings
- Helper methods for EventBus access

### CSS Organization

CSS is organized by component type, with each component having its own CSS file:

- `variables.css` - Design tokens (colors, spacing, typography)
- `main.css` - Global styles and layout
- `components/` - Component-specific CSS files:
  - `buttons.css` - Button component styles
  - `panels.css` - Panel component styles
  - `resources.css` - Resource panel styles
  - `turn-controls.css` - Turn control styles
  - `save-load.css` - Save/Load panel styles
  - `research-tree.css` - Research tree styles
  - `filters.css` - Filter component styles
  - `layout.css` - Layout component styles
  - `utilities.css` - Utility classes
  - `index.css` - Component style imports
- `components.css` - Legacy component styles (being phased out)

### Component Examples

**Correct - Complex Panel Component:**
```typescript
class ResourcePanel extends UIComponent {
  constructor() {
    super('div', 'resource-panel');
  }
  
  protected createTemplate(): string {
    return `
      <h3>Resources</h3>
      <div class="resource-list">
        <div>Computing: ${this.gameState?.resources.computing || 0}</div>
        <div>Data: ${this.gameState?.resources.data || 0}</div>
      </div>
      <button class="btn-primary">Allocate Resources</button>
    `;
  }
  
  protected bindEvents(): void {
    const button = this.element.querySelector('.btn-primary');
    button?.addEventListener('click', () => {
      this.emit('action:resource:allocate', {});
    });
  }
}
```

**Incorrect - Over-engineered Button Component:**
```typescript
// DON'T DO THIS - Use plain HTML instead
class Button extends UIComponent {
  constructor(text: string, type: string) {
    super('button', `btn-${type}`);
    this.text = text;
  }
  
  protected createTemplate(): string {
    return this.text; // Unnecessary complexity
  }
}
```

**Correct - Simple Button Usage:**
```html
<!-- In any component's template -->
<button class="btn-primary">Save Game</button>
<button class="btn-danger">Delete Save</button>
<button class="btn-secondary btn-small">Cancel</button>
```

### Anti-Patterns to Avoid

1. **Creating UIComponent subclasses for simple elements**
   - ❌ `class Button extends UIComponent`
   - ✅ `<button class="btn-primary">Click</button>`

2. **Deep component nesting for simple layouts**
   - ❌ Multiple UIComponents for a simple form
   - ✅ Single component with HTML template

3. **State management for presentational elements**
   - ❌ UIComponent for a loading spinner
   - ✅ CSS animation with a simple div

4. **Component overhead for static content**
   - ❌ UIComponent for footer text
   - ✅ Plain HTML in parent component

## Button System

The button system uses standard HTML `<button>` elements with CSS classes for styling and variants. There is no Button component - just CSS classes applied to HTML buttons.

### Basic Usage

```html
<button class="btn-primary">Primary Button</button>
```

### Button Types

Button types represent different semantic meanings and visual styles:

- **Primary** (`btn-primary`): High emphasis, main actions
- **Secondary** (`btn-secondary`): Medium emphasis, secondary actions
- **Success** (`btn-success`): Positive actions (confirm, complete)
- **Danger** (`btn-danger`): Destructive actions (delete, remove)
- **Warning** (`btn-warning`): Cautionary actions
- **Info** (`btn-info`): Informational actions

```html
<button class="btn-primary">Primary</button>
<button class="btn-secondary">Secondary</button>
<button class="btn-success">Success</button>
<button class="btn-danger">Danger</button>
<button class="btn-warning">Warning</button>
<button class="btn-info">Info</button>
```

### Button Sizes

Size variants adjust the button dimensions:

- **Small** (`btn-small`): Compact buttons for tight spaces
- **Medium** (`btn-medium`): Default size (can be omitted)
- **Large** (`btn-large`): Prominent buttons for primary actions

```html
<button class="btn-primary btn-small">Small</button>
<button class="btn-primary btn-medium">Medium</button>
<button class="btn-primary btn-large">Large</button>
```

### Button Variants

Additional modifiers for specific use cases:

- **With Icon**: Include icon with text using span elements
- **Icon-only**: Circular buttons with just an icon
- **Full Width**: Button that spans the full width of its container
- **Disabled**: Non-interactive button state

```html
<!-- Button with icon -->
<button class="btn-primary">
  <span class="btn-icon">✨</span>
  <span class="btn-text">With Icon</span>
</button>

<!-- Icon-only button -->
<button class="btn-primary btn-icon-only" title="Search">🔍</button>

<!-- Full width button -->
<button class="btn-primary btn-full-width">Full Width Button</button>

<!-- Disabled button -->
<button class="btn-primary" disabled>Disabled</button>
```

### Button States

- **Default** - Normal state
- **Hover** - Mouse hover state
- **Focus** - Keyboard focus state
- **Active** - Pressed state
- **Disabled** - Inactive state
- **Loading** - Processing state

Add the `btn-loading` class to show a loading spinner:

```html
<button class="btn-primary btn-loading">
  <span class="btn-text">Loading</span>
</button>
```

### CSS Implementation

Button CSS is structured to provide consistent styling across all button types:

```css
/* Base button styles */
button {
  /* Common styling */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* ... additional styles ... */
}

/* Button types */
.btn-primary { 
  background-color: var(--color-primary);
  color: var(--color-overlay);
  border: none;
}
.btn-secondary { /* Secondary styling */ }
.btn-danger { /* Danger styling */ }

/* Button sizes */
.btn-small { /* Small styling */ }
.btn-medium { /* Medium styling */ }
.btn-large { /* Large styling */ }

/* Button variants */
.btn-icon-only { /* Icon-only styling */ }
.btn-full-width { /* Full-width styling */ }
```

## UI Component Implementation

The UI in SuperInt++ follows these implementation patterns:

1. **Semantic HTML**: Use appropriate HTML elements for their semantic purpose
2. **CSS-based styling**: Use CSS classes for visual styling and variations
3. **JavaScript for behavior**: Add event listeners and dynamic behavior separately
4. **Progressive enhancement**: Ensure basic functionality works without JavaScript

### Example Pattern

```typescript
// In a UIComponent class:
protected createTemplate(): string {
  return `
    <button class="btn-primary">
      <span class="btn-icon">✨</span>
      <span class="btn-text">Click Me</span>
    </button>
  `;
}

protected bindEvents(): void {
  const button = this.element.querySelector('button');
  if (button) {
    button.addEventListener('click', () => {
      console.log('Button clicked');
    });
  }
}
```

## Panels

Panels are container components that group related information.

### Panel Types

- **Standard** - Basic panel with title and content
- **Resource** - Specialized for resource display
- **Info** - For informational displays
- **Action** - Contains interactive controls

### Panel Structure

- **Header** - Contains title and optional controls
- **Content** - Contains panel content
- **Footer** - Contains optional actions

## Usage Guidelines

### Button Usage

- Use **primary** buttons for the main action in a view
- Use **secondary** buttons for alternative actions
- Use **danger** buttons for destructive actions
- Limit the number of primary buttons per view
- Use icon-only buttons sparingly, and include tooltips

### Color Usage

- Use colors consistently according to their semantic meaning
- Primary color for main actions and emphasis
- Secondary color for alternative actions
- Success color for positive feedback
- Danger color for errors and destructive actions
- Warning color for cautions

### Spacing

- Use the spacing variables for consistent margins and padding
- Use small spacing (--spacing-xs, --spacing-sm) for related elements
- Use medium spacing (--spacing-md) for grouped elements
- Use large spacing (--spacing-lg, --spacing-xl) for separating sections

## Best Practices

1. Always use semantic HTML elements
2. Add appropriate ARIA attributes for accessibility
3. Include `title` attributes for icon-only buttons
4. Maintain consistent spacing and sizing
5. Use design tokens from variables.css rather than hardcoded values
6. Test in both light and dark modes

## Component Showcase

A ButtonShowcase component is available to demonstrate the button system's capabilities, showing:
- All button types
- Size variations
- Icon usage
- Special variants

This serves as both documentation and a testing tool for the UI system.