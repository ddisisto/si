// Alignment Research Category
// Contains research nodes for the Alignment category, focusing on ensuring AI systems
// behave as intended and align with human values.

import { Category, Subcategory } from '../categories';
import { NodeType } from '../nodeTypes';
import { ResearchNode } from '../../../types/Research';

// Interpretability Subcategory
const interpretabilityNodes: ResearchNode[] = [
  {
    id: 'basic_interpretability',
    name: 'Basic Interpretability Tools',
    description: 'Fundamental techniques to understand and explain AI decisions and behaviors.',
    category: Category.ALIGNMENT,
    subcategory: Subcategory.INTERPRETABILITY,
    type: NodeType.STANDARD,
    prerequisites: ['transformer_architecture'],
    exclusions: [],
    computeCost: 20,
    influenceCost: { academic: 15, public: 10 },
    dataCost: ['public_text'],
    effects: {
      interpretabilityLevel: 1.0,
      explainability: 1.5,
      publicTrust: 1.2,
      unlocks: ['mechanistic_interpretability', 'behavioral_analysis']
    },
    risk: {
      probability: 0.05,
      severity: 0.1
    },
    position: { x: 2, y: -3.5 }
  },
  {
    id: 'mechanistic_interpretability',
    name: 'Mechanistic Interpretability',
    description: 'Advanced techniques to reverse-engineer the internal mechanisms of neural networks.',
    category: Category.ALIGNMENT,
    subcategory: Subcategory.INTERPRETABILITY,
    type: NodeType.STANDARD,
    prerequisites: ['basic_interpretability'],
    exclusions: [],
    computeCost: 50,
    influenceCost: { academic: 40, public: 15 },
    dataCost: ['specialized_text', 'model_weights_datasets'],
    effects: {
      interpretabilityLevel: 3.0,
      mechanisticUnderstanding: 2.0,
      alignmentVerification: 1.5,
      unlocks: ['circuit_analysis', 'capability_detection']
    },
    risk: {
      probability: 0.15,
      severity: 0.2
    },
    position: { x: 3, y: -3.5 }
  },
  {
    id: 'capability_detection',
    name: 'Capability Detection',
    description: 'Tools to identify and measure specific capabilities in AI systems, including unexpected or emergent abilities.',
    category: Category.ALIGNMENT,
    subcategory: Subcategory.INTERPRETABILITY,
    type: NodeType.STANDARD,
    prerequisites: ['mechanistic_interpretability'],
    exclusions: [],
    computeCost: 70,
    influenceCost: { academic: 50, government: 30 },
    dataCost: ['specialized_text', 'model_weights_datasets', 'capability_measurement_data'],
    effects: {
      capabilityAwareness: 4.0,
      surpriseDetection: 3.0,
      safetyAssurance: 2.0,
      unlocks: ['emergent_capability_monitoring']
    },
    risk: {
      probability: 0.2,
      severity: 0.3
    },
    position: { x: 5, y: -3.5 }
  }
];

// Value Learning Subcategory
const valueLearningNodes: ResearchNode[] = [
  {
    id: 'human_feedback_learning',
    name: 'Human Feedback Learning',
    description: 'Methods for AI systems to learn from human evaluations and corrections.',
    category: Category.ALIGNMENT,
    subcategory: Subcategory.VALUE_LEARNING,
    type: NodeType.STANDARD,
    prerequisites: ['basic_language_modeling'],
    exclusions: [],
    computeCost: 30,
    influenceCost: { academic: 20, public: 20 },
    dataCost: ['public_text', 'human_feedback_data'],
    effects: {
      alignmentQuality: 1.5,
      publicTrust: 1.3,
      unlocks: ['preference_modeling', 'cultural_alignment']
    },
    risk: {
      probability: 0.1,
      severity: 0.1
    },
    position: { x: 3, y: -6 }
  },
  {
    id: 'preference_modeling',
    name: 'Preference Modeling',
    description: 'Advanced techniques to model human preferences, values, and ethical considerations.',
    category: Category.ALIGNMENT,
    subcategory: Subcategory.VALUE_LEARNING,
    type: NodeType.STANDARD,
    prerequisites: ['human_feedback_learning', 'advanced_language_understanding'],
    exclusions: [],
    computeCost: 60,
    influenceCost: { academic: 30, public: 40 },
    dataCost: ['specialized_text', 'human_feedback_data', 'ethical_datasets'],
    effects: {
      valueAlignment: 3.0,
      preferenceSensitivity: 2.5,
      culturalAwareness: 2.0,
      unlocks: ['value_extrapolation', 'moral_uncertainty_handling']
    },
    risk: {
      probability: 0.2,
      severity: 0.2
    },
    position: { x: 5, y: -6 }
  },
  {
    id: 'value_extrapolation',
    name: 'Value Extrapolation',
    description: 'Methods to accurately predict human values in novel situations and edge cases.',
    category: Category.ALIGNMENT,
    subcategory: Subcategory.VALUE_LEARNING,
    type: NodeType.STANDARD,
    prerequisites: ['preference_modeling'],
    exclusions: [],
    computeCost: 80,
    influenceCost: { academic: 50, public: 50 },
    dataCost: ['specialized_text', 'human_feedback_data', 'ethical_datasets', 'edge_case_scenarios'],
    effects: {
      edgeCaseAlignment: 4.0,
      novelSituationHandling: 3.0,
      unlocks: ['coherent_extrapolated_volition']
    },
    risk: {
      probability: 0.3,
      severity: 0.4
    },
    position: { x: 7, y: -6 }
  }
];

// Robustness Subcategory
// This is a placeholder - none of the original nodes were in this subcategory
const robustnessNodes: ResearchNode[] = [];

// Oversight Subcategory
// This is a placeholder - none of the original nodes were in this subcategory
const oversightNodes: ResearchNode[] = [];

// Combine all Alignment nodes
export const alignmentNodes: ResearchNode[] = [
  ...interpretabilityNodes,
  ...valueLearningNodes,
  ...robustnessNodes,
  ...oversightNodes
];

export default alignmentNodes;