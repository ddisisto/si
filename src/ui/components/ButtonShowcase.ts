/**
 * ButtonShowcase - Component to demonstrate button system
 */

import UIComponent from './UIComponent';

/**
 * Component to showcase the button system using HTML + CSS
 */
class ButtonShowcase extends UIComponent {
  /**
   * Create a new button showcase
   */
  constructor() {
    super('div', 'button-showcase');
  }

  /**
   * Generate the showcase template using raw HTML buttons
   */
  protected createTemplate(): string {
    return `
      <h2>Button Component System</h2>
      <p>This showcase demonstrates the standardized button system using HTML + CSS.</p>
      
      <div class="showcase-sections">
        <section>
          <h3>Button Types</h3>
          <div class="button-types">
            <button class="btn-primary">Primary</button>
            <button class="btn-secondary">Secondary</button>
            <button class="btn-success">Success</button>
            <button class="btn-danger">Danger</button>
            <button class="btn-warning">Warning</button>
            <button class="btn-info">Info</button>
          </div>
          <pre><code>&lt;button class="btn-primary"&gt;Primary&lt;/button&gt;
&lt;button class="btn-secondary"&gt;Secondary&lt;/button&gt;
&lt;button class="btn-success"&gt;Success&lt;/button&gt;
&lt;button class="btn-danger"&gt;Danger&lt;/button&gt;</code></pre>
        </section>
        
        <section>
          <h3>Button Sizes</h3>
          <div class="button-sizes">
            <button class="btn-primary btn-small">Small</button>
            <button class="btn-primary btn-medium">Medium</button>
            <button class="btn-primary btn-large">Large</button>
          </div>
          <pre><code>&lt;button class="btn-primary btn-small"&gt;Small&lt;/button&gt;
&lt;button class="btn-primary btn-medium"&gt;Medium&lt;/button&gt;
&lt;button class="btn-primary btn-large"&gt;Large&lt;/button&gt;</code></pre>
        </section>
        
        <section>
          <h3>Button Variants</h3>
          <div class="button-variants">
            <button class="btn-primary"><span class="btn-icon">✨</span><span class="btn-text">With Icon</span></button>
            <button class="btn-primary btn-icon-only" title="Search">🔍</button>
            <button class="btn-primary btn-large btn-icon-only" title="Add Item">➕</button>
            <button class="btn-primary btn-full-width">Full Width Button</button>
            <button class="btn-primary" disabled>Disabled</button>
            <button class="btn-primary btn-loading"><span class="btn-text">Loading</span></button>
          </div>
          <pre><code>&lt;button class="btn-primary"&gt;&lt;span class="btn-icon"&gt;✨&lt;/span&gt;&lt;span class="btn-text"&gt;With Icon&lt;/span&gt;&lt;/button&gt;
&lt;button class="btn-primary btn-icon-only" title="Search"&gt;🔍&lt;/button&gt;
&lt;button class="btn-primary btn-large btn-icon-only" title="Add Item"&gt;➕&lt;/button&gt;
&lt;button class="btn-primary btn-full-width"&gt;Full Width Button&lt;/button&gt;
&lt;button class="btn-primary" disabled&gt;Disabled&lt;/button&gt;
&lt;button class="btn-primary btn-loading"&gt;&lt;span class="btn-text"&gt;Loading&lt;/span&gt;&lt;/button&gt;</code></pre>
        </section>

        <section>
          <h3>Interactive Examples</h3>
          <div class="button-interactive">
            <button id="toggle-loading-btn" class="btn-primary">Toggle Loading State</button>
            <button id="loading-demo-btn" class="btn-success">Click to Load</button>
          </div>
          <pre><code>// JavaScript example for toggling loading state
const button = document.querySelector('#my-button');

// Show loading state
button.classList.add('btn-loading');

// Hide loading state after action completes
setTimeout(() => {
  button.classList.remove('btn-loading');
}, 2000);</code></pre>
        </section>
      </div>
      
      <style>
        .button-showcase {
          padding: var(--spacing-md);
          max-width: 800px;
          margin: 0 auto;
        }
        
        .button-showcase h2 {
          margin-bottom: var(--spacing-md);
          color: var(--color-primary);
          border-bottom: 1px solid var(--color-overlay);
          padding-bottom: var(--spacing-sm);
        }
        
        .button-showcase p {
          margin-bottom: var(--spacing-lg);
          line-height: 1.5;
          color: var(--color-text-muted);
        }
        
        .showcase-sections {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }
        
        .button-showcase section {
          border: 1px solid var(--color-surface);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-md);
          background-color: var(--color-overlay);
        }
        
        .button-showcase h3 {
          margin-bottom: var(--spacing-md);
          color: var(--color-primary);
          display: flex;
          align-items: center;
        }
        
        .button-showcase h3::before {
          content: "⦿";
          margin-right: var(--spacing-sm);
          color: var(--color-accent);
          font-size: 0.8em;
        }
        
        .button-types, .button-sizes, .button-variants, .button-interactive {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
          margin-bottom: var(--spacing-md);
          padding: var(--spacing-md);
          background-color: var(--color-surface);
          border-radius: var(--border-radius-sm);
          align-items: center;
        }
        
        .button-showcase pre {
          background-color: var(--color-background);
          padding: var(--spacing-md);
          border-radius: var(--border-radius-sm);
          overflow-x: auto;
          font-family: var(--font-family-mono);
          font-size: var(--font-size-xs);
          margin-top: var(--spacing-md);
          border-left: 3px solid var(--color-accent);
        }
        
        .button-showcase code {
          color: var(--color-text);
        }
        
        /* Special styling for interactive demo section */
        .button-interactive {
          gap: var(--spacing-lg);
          justify-content: center;
        }
      </style>
    `;
  }

  /**
   * Add event listeners to buttons
   */
  protected bindEvents(): void {
    // Add click handlers to all buttons in the showcase
    const buttons = this.element.querySelectorAll('button:not(#toggle-loading-btn):not(#loading-demo-btn)');
    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        const target = event.currentTarget as HTMLButtonElement;
        const buttonText = target.textContent || target.title || 'Button';
        console.log(`${buttonText} clicked`);
      });
    });

    // Implement loading state toggle demo
    const toggleLoadingBtn = this.element.querySelector('#toggle-loading-btn');
    const loadingDemoBtn = this.element.querySelector('#loading-demo-btn');
    
    if (toggleLoadingBtn) {
      toggleLoadingBtn.addEventListener('click', () => {
        if (loadingDemoBtn) {
          loadingDemoBtn.classList.toggle('btn-loading');
        }
      });
    }

    // Implement loading state simulation
    if (loadingDemoBtn) {
      loadingDemoBtn.addEventListener('click', (event) => {
        const button = event.currentTarget as HTMLButtonElement;
        
        // Skip if already loading
        if (button.classList.contains('btn-loading')) {
          return;
        }
        
        // Show loading state
        button.classList.add('btn-loading');
        console.log('Loading started...');
        
        // Simulate loading process
        setTimeout(() => {
          button.classList.remove('btn-loading');
          console.log('Loading completed!');
        }, 2000);
      });
    }
  }
}

export default ButtonShowcase;