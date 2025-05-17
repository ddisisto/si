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
import SaveLoadPanel from './components/SaveLoadPanel';

// Export research components
import { ResearchTreeView } from './components/research';

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
  MainView,
  SaveLoadPanel,
  
  // Research UI components
  ResearchTreeView
};