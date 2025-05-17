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
import MainView from './components/MainView';

// Export UI manager
import UIManager from './UIManager';

export {
  // DOM-based UI
  UIComponent,
  UIManager,
  Panel,
  Button,
  ResourcePanel,
  TurnControls,
  GameInfoPanel,
  GameLayout,
  MainView
};