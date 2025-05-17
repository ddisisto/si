// Research Node Types
// Defines the different types of research nodes and their characteristics

import { ResearchNodeType } from '../../types/Research';

/**
 * Types of research nodes that have different gameplay implications
 */
export type NodeType = ResearchNodeType;
export const NodeType = ResearchNodeType;

/**
 * Default values for various node types to maintain consistency
 */
export const nodeTypeDefaults = {
  [NodeType.STANDARD]: {
    baseComputeCost: 20,
    baseRisk: {
      probability: 0.05,
      severity: 0.1
    },
    researchTimeMultiplier: 1.0
  },
  [NodeType.BREAKTHROUGH]: {
    baseComputeCost: 50,
    baseRisk: {
      probability: 0.15,
      severity: 0.2
    },
    researchTimeMultiplier: 1.5
  },
  [NodeType.TIERED]: {
    baseComputeCost: 15,
    baseRisk: {
      probability: 0.05,
      severity: 0.1
    },
    researchTimeMultiplier: 0.8
  },
  [NodeType.RISK]: {
    baseComputeCost: 30,
    baseRisk: {
      probability: 0.3,
      severity: 0.3
    },
    researchTimeMultiplier: 1.2
  },
  [NodeType.DIVERGENT]: {
    baseComputeCost: 25,
    baseRisk: {
      probability: 0.1,
      severity: 0.15
    },
    researchTimeMultiplier: 1.0
  }
};

/**
 * Visual representation characteristics for each node type
 */
export const nodeTypeVisuals = {
  [NodeType.STANDARD]: {
    icon: '📄',
    color: '#4a6fa5',
    size: 'medium'
  },
  [NodeType.BREAKTHROUGH]: {
    icon: '⭐',
    color: '#c4a14e',
    size: 'large'
  },
  [NodeType.TIERED]: {
    icon: '📊',
    color: '#568f8b',
    size: 'medium'
  },
  [NodeType.RISK]: {
    icon: '⚠️',
    color: '#b33f40',
    size: 'medium'
  },
  [NodeType.DIVERGENT]: {
    icon: '🔀',
    color: '#7e6b8f',
    size: 'medium'
  }
};

export default {
  NodeType,
  nodeTypeDefaults,
  nodeTypeVisuals
};