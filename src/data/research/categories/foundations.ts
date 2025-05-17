// Foundations Research Category
// Contains research nodes for the Foundations category, focusing on core AI architecture, 
// training methods, and inference optimization.

import { Category, Subcategory } from '../categories';
import { NodeType } from '../nodeTypes';
import { ResearchNode } from '../../../types/Research';

// Architecture Subcategory
const architectureNodes: ResearchNode[] = [
  {
    id: 'transformer_architecture',
    name: 'Transformer Architecture',
    description: 'Basic attention-based model architecture that forms the foundation of most advanced language models.',
    category: Category.FOUNDATIONS,
    subcategory: Subcategory.ARCHITECTURE,
    type: NodeType.STANDARD,
    prerequisites: [],
    exclusions: [],
    computeCost: 10,
    influenceCost: { academic: 5 },
    dataCost: ['public_text'],
    effects: {
      unlocks: ['basic_language_modeling', 'attention_mechanisms'],
      computeEfficiency: 1.0
    },
    risk: {
      probability: 0.05,
      severity: 0.1
    },
    position: { x: 0, y: 0 }
  },
  {
    id: 'attention_mechanisms',
    name: 'Advanced Attention Mechanisms',
    description: 'Improvements to attention mechanisms that increase efficiency and capability.',
    category: Category.FOUNDATIONS,
    subcategory: Subcategory.ARCHITECTURE,
    type: NodeType.STANDARD,
    prerequisites: ['transformer_architecture'],
    exclusions: [],
    computeCost: 20,
    influenceCost: { academic: 10 },
    dataCost: ['public_text'],
    effects: {
      unlocks: ['multihead_attention', 'sparse_attention'],
      computeEfficiency: 1.2
    },
    risk: {
      probability: 0.05,
      severity: 0.1
    },
    position: { x: 1, y: 0 }
  },
  {
    id: 'multihead_attention',
    name: 'Multi-head Attention',
    description: 'Parallel attention mechanisms that allow models to focus on different aspects of the input simultaneously.',
    category: Category.FOUNDATIONS,
    subcategory: Subcategory.ARCHITECTURE,
    type: NodeType.STANDARD,
    prerequisites: ['attention_mechanisms'],
    exclusions: [],
    computeCost: 25,
    influenceCost: { academic: 15 },
    dataCost: ['public_text'],
    effects: {
      modelQuality: 1.2,
      computeRequirement: 1.1
    },
    risk: {
      probability: 0.05,
      severity: 0.1
    },
    position: { x: 2, y: -0.5 }
  },
  {
    id: 'sparse_attention',
    name: 'Sparse Attention Patterns',
    description: 'Selective attention mechanisms that reduce computational requirements while maintaining model quality.',
    category: Category.FOUNDATIONS,
    subcategory: Subcategory.ARCHITECTURE,
    type: NodeType.STANDARD,
    prerequisites: ['attention_mechanisms'],
    exclusions: [],
    computeCost: 25,
    influenceCost: { academic: 15 },
    dataCost: ['public_text'],
    effects: {
      modelQuality: 1.1,
      computeEfficiency: 1.3
    },
    risk: {
      probability: 0.05,
      severity: 0.1
    },
    position: { x: 2, y: 0.5 }
  },
  {
    id: 'mixture_of_experts',
    name: 'Mixture of Experts',
    description: 'Architectural approach that routes inputs to specialized sub-networks, increasing model capacity without proportional compute costs.',
    category: Category.FOUNDATIONS,
    subcategory: Subcategory.ARCHITECTURE,
    type: NodeType.BREAKTHROUGH,
    prerequisites: ['multihead_attention', 'sparse_attention'],
    exclusions: [],
    computeCost: 50,
    influenceCost: { academic: 25, industry: 10 },
    dataCost: ['public_text', 'specialized_text'],
    effects: {
      modelCapacity: 2.0,
      computeEfficiency: 1.5,
      unlocks: ['moe_routing_algorithms', 'conditional_computation']
    },
    risk: {
      probability: 0.1,
      severity: 0.2
    },
    position: { x: 3, y: 0 }
  }
];

// Training Methods Subcategory
const trainingMethodsNodes: ResearchNode[] = [
  {
    id: 'basic_language_modeling',
    name: 'Basic Language Modeling',
    description: 'Fundamental next-token prediction training methodology for language models.',
    category: Category.FOUNDATIONS,
    subcategory: Subcategory.TRAINING_METHODS,
    type: NodeType.STANDARD,
    prerequisites: ['transformer_architecture'],
    exclusions: [],
    computeCost: 15,
    influenceCost: { academic: 10 },
    dataCost: ['public_text'],
    effects: {
      unlocks: ['unsupervised_pretraining', 'curriculum_learning'],
      languageCapability: 1.0
    },
    risk: {
      probability: 0.05,
      severity: 0.1
    },
    position: { x: 1, y: -2 }
  },
  {
    id: 'unsupervised_pretraining',
    name: 'Unsupervised Pretraining',
    description: 'Self-supervised training techniques that leverage large unlabeled datasets to learn general representations.',
    category: Category.FOUNDATIONS,
    subcategory: Subcategory.TRAINING_METHODS,
    type: NodeType.STANDARD,
    prerequisites: ['basic_language_modeling'],
    exclusions: [],
    computeCost: 30,
    influenceCost: { academic: 15 },
    dataCost: ['public_text', 'specialized_text'],
    effects: {
      unlocks: ['transfer_learning', 'contrastive_learning'],
      modelQuality: 1.3
    },
    risk: {
      probability: 0.05,
      severity: 0.1
    },
    position: { x: 2, y: -2.5 }
  },
  {
    id: 'curriculum_learning',
    name: 'Curriculum Learning',
    description: 'Training methodology that presents examples in order of increasing difficulty for more efficient learning.',
    category: Category.FOUNDATIONS,
    subcategory: Subcategory.TRAINING_METHODS,
    type: NodeType.STANDARD,
    prerequisites: ['basic_language_modeling'],
    exclusions: [],
    computeCost: 25,
    influenceCost: { academic: 15 },
    dataCost: ['public_text'],
    effects: {
      trainingEfficiency: 1.2,
      modelQuality: 1.1
    },
    risk: {
      probability: 0.05,
      severity: 0.1
    },
    position: { x: 2, y: -1.5 }
  }
];

// Inference Optimization Subcategory
const inferenceOptimizationNodes: ResearchNode[] = [
  {
    id: 'basic_inference_optimization',
    name: 'Basic Inference Optimization',
    description: 'Fundamental techniques to improve model inference speed and efficiency.',
    category: Category.FOUNDATIONS,
    subcategory: Subcategory.INFERENCE_OPTIMIZATION,
    type: NodeType.STANDARD,
    prerequisites: ['transformer_architecture'],
    exclusions: [],
    computeCost: 15,
    influenceCost: { academic: 5, industry: 5 },
    dataCost: ['public_text'],
    effects: {
      inferenceSpeed: 1.2,
      deploymentCapacity: 1.1
    },
    risk: {
      probability: 0.05,
      severity: 0.1
    },
    position: { x: 1, y: 2 }
  },
  {
    id: 'knowledge_distillation',
    name: 'Knowledge Distillation',
    description: 'Technique to transfer knowledge from a large model to a smaller one, maintaining much of the capability with reduced compute requirements.',
    category: Category.FOUNDATIONS,
    subcategory: Subcategory.INFERENCE_OPTIMIZATION,
    type: NodeType.STANDARD,
    prerequisites: ['basic_inference_optimization'],
    exclusions: [],
    computeCost: 30,
    influenceCost: { academic: 15, industry: 10 },
    dataCost: ['public_text', 'specialized_text'],
    effects: {
      inferenceEfficiency: 1.5,
      modelSize: 0.7,
      capabilityRetention: 0.85
    },
    risk: {
      probability: 0.05,
      severity: 0.1
    },
    position: { x: 2, y: 2 }
  }
];

// Combine all Foundations nodes
export const foundationsNodes: ResearchNode[] = [
  ...architectureNodes,
  ...trainingMethodsNodes,
  ...inferenceOptimizationNodes
];

export default foundationsNodes;