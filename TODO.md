# DOM UI Transition TODO List

This file tracks the tasks required to transition from Canvas-based UI to DOM-based UI.

## Core UI Infrastructure

- [ ] **UIComponent Base Class**
  - [ ] Create `/src/ui/components/UIComponent.ts`
  - [ ] Implement base methods (mount, unmount, update, render)
  - [ ] Add template rendering functionality

- [ ] **UI Manager**
  - [ ] Create `/src/ui/UIManager.ts`
  - [ ] Implement component registration
  - [ ] Add state update handling
  - [ ] Connect to game engine

- [ ] **HTML/CSS Structure**
  - [ ] Update `/public/index.html` with game root element
  - [ ] Create `/public/styles/main.css` for global styles
  - [ ] Create `/public/styles/variables.css` for theming
  - [ ] Create `/public/styles/components.css` for component styles

## Basic Components

- [ ] **Basic UI Components**
  - [ ] Create `/src/ui/components/Panel.ts`
  - [ ] Create `/src/ui/components/Button.ts`
  - [ ] Create `/src/ui/components/Label.ts`

- [ ] **Game UI Components**
  - [ ] Create `/src/ui/components/ResourcePanel.ts`
  - [ ] Create `/src/ui/components/TurnControls.ts`
  - [ ] Create `/src/ui/components/GameInfoPanel.ts`

## Integration

- [ ] **Update Entry Point**
  - [ ] Modify `/src/index.ts` to use new UI system
  - [ ] Remove Canvas rendering initialization
  - [ ] Set up DOM event handling

- [ ] **Update Game Engine**
  - [ ] Modify `/src/core/GameEngine.ts` to use UIManager
  - [ ] Connect state updates to UI updates
  - [ ] Register UI components

- [ ] **Event Handling**
  - [ ] Connect DOM events to game actions
  - [ ] Update event bus for DOM events
  - [ ] Handle component-to-system communication

## Game Systems UI

- [ ] **Research System UI**
  - [ ] Create `/src/ui/components/ResearchTreeView.ts`
  - [ ] Implement research node visualization
  - [ ] Add selection and interaction

- [ ] **Deployment System UI**
  - [ ] Create `/src/ui/components/DeploymentView.ts`
  - [ ] Implement deployment slot visualization
  - [ ] Add deployment management UI

- [ ] **Event System UI**
  - [ ] Create `/src/ui/components/EventPanel.ts`
  - [ ] Implement event notification UI
  - [ ] Add event resolution interface

## Layout and Styling

- [ ] **Main Game Layout**
  - [ ] Create responsive grid layout
  - [ ] Implement panel positioning
  - [ ] Add layout for different screen sizes

- [ ] **Component Styling**
  - [ ] Style resource panel
  - [ ] Style turn controls
  - [ ] Style research tree
  - [ ] Style event panels

- [ ] **Responsive Design**
  - [ ] Add media queries for different screen sizes
  - [ ] Implement mobile-friendly layout
  - [ ] Test on different devices

## Cleanup

- [ ] **Remove Canvas Code**
  - [ ] Remove `/src/ui/Renderer.ts`
  - [ ] Remove `/src/ui/View.ts`
  - [ ] Remove `/src/ui/DemoView.ts`
  - [ ] Update any remaining Canvas references

- [ ] **Testing and Verification**
  - [ ] Test state updates reflect in UI
  - [ ] Verify user interactions work correctly
  - [ ] Check performance with profiling
  - [ ] Ensure accessibility standards