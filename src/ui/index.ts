/**
 * UI Module Entry Point
 */

// Export UI components
import UIComponent from './components/UIComponent';
import Panel from './components/Panel';
import Button from './components/Button';
import ResourcePanel from './components/ResourcePanel';
import TurnControls from './components/TurnControls';
import GameInfoPanel from './components/GameInfoPanel';
import GameLayout from './components/GameLayout';

// Export UI manager
import UIManager from './UIManager';

// Legacy canvas components (will be replaced)
import Renderer from './Renderer';
import View from './View';
import DemoView from './DemoView';
import InputHandler from './InputHandler';

export {
  // New DOM-based UI
  UIComponent,
  UIManager,
  Panel,
  Button,
  ResourcePanel,
  TurnControls,
  GameInfoPanel,
  GameLayout,
  
  // Legacy canvas components (for backwards compatibility)
  Renderer,
  View,
  DemoView,
  InputHandler
};