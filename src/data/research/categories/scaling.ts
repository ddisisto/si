// Scaling Research Category
// Contains research nodes for the Scaling category, focusing on making AI systems larger and more powerful
// through parameter scaling, computational efficiency, and distributed training.

import { Category, Subcategory } from '../categories';
import { NodeType } from '../nodeTypes';
import { ResearchNode } from '../../../types/Research';

// Parameter Scaling Subcategory
const parameterScalingNodes: ResearchNode[] = [
  {
    id: 'billion_parameter_models',
    name: 'Billion-Parameter Models',
    description: 'Scaling models to billions of parameters, dramatically increasing their capabilities.',
    category: Category.SCALING,
    subcategory: Subcategory.PARAMETER_SCALING,
    type: NodeType.BREAKTHROUGH,
    prerequisites: ['mixture_of_experts', 'unsupervised_pretraining'],
    exclusions: [],
    computeCost: 100,
    influenceCost: { academic: 20, industry: 30 },
    dataCost: ['public_text', 'specialized_text', 'proprietary_text'],
    effects: {
      modelCapacity: 5.0,
      computeRequirement: 5.0,
      languageCapability: 3.0,
      unlocks: ['trillion_parameter_models', 'scaling_laws']
    },
    risk: {
      probability: 0.15,
      severity: 0.2
    },
    position: { x: 4, y: -1 }
  },
  {
    id: 'scaling_laws',
    name: 'Scaling Laws Research',
    description: 'Mathematical relationships between model size, data, compute, and performance that guide efficient scaling.',
    category: Category.SCALING,
    subcategory: Subcategory.PARAMETER_SCALING,
    type: NodeType.STANDARD,
    prerequisites: ['billion_parameter_models'],
    exclusions: [],
    computeCost: 40,
    influenceCost: { academic: 25, industry: 10 },
    dataCost: ['specialized_text'],
    effects: {
      scalingEfficiency: 1.4,
      researchSpeed: 1.2,
      unlocks: ['optimal_scaling_strategies']
    },
    risk: {
      probability: 0.05,
      severity: 0.1
    },
    position: { x: 5, y: -2 }
  },
  {
    id: 'trillion_parameter_models',
    name: 'Trillion-Parameter Models',
    description: 'Extreme-scale models with unprecedented capabilities, requiring massive distributed computing resources.',
    category: Category.SCALING,
    subcategory: Subcategory.PARAMETER_SCALING,
    type: NodeType.BREAKTHROUGH,
    prerequisites: ['billion_parameter_models', 'scaling_laws', 'advanced_distributed_training'],
    exclusions: [],
    computeCost: 500,
    influenceCost: { academic: 30, industry: 50 },
    dataCost: ['public_text', 'specialized_text', 'proprietary_text', 'synthetic_data'],
    effects: {
      modelCapacity: 20.0,
      computeRequirement: 50.0,
      languageCapability: 10.0,
      reasoningCapability: 5.0,
      unlocks: ['emergent_capabilities', 'multi_agent_systems']
    },
    risk: {
      probability: 0.3,
      severity: 0.4
    },
    position: { x: 8, y: -1 }
  }
];

// Computational Efficiency Subcategory
const computationalEfficiencyNodes: ResearchNode[] = [
  {
    id: 'hardware_acceleration',
    name: 'Hardware Acceleration',
    description: 'Specialized hardware designed for neural network training and inference.',
    category: Category.SCALING,
    subcategory: Subcategory.COMPUTATIONAL_EFFICIENCY,
    type: NodeType.STANDARD,
    prerequisites: ['basic_inference_optimization'],
    exclusions: [],
    computeCost: 30,
    influenceCost: { industry: 20 },
    dataCost: [],
    effects: {
      computeEfficiency: 2.0,
      unlocks: ['custom_ai_accelerators', 'neuromorphic_computing']
    },
    risk: {
      probability: 0.1,
      severity: 0.1
    },
    position: { x: 3, y: 3 }
  },
  {
    id: 'custom_ai_accelerators',
    name: 'Custom AI Accelerators',
    description: 'Tailor-made hardware optimized specifically for your AI workloads.',
    category: Category.SCALING,
    subcategory: Subcategory.COMPUTATIONAL_EFFICIENCY,
    type: NodeType.STANDARD,
    prerequisites: ['hardware_acceleration'],
    exclusions: [],
    computeCost: 60,
    influenceCost: { industry: 30, funding: 50 },
    dataCost: [],
    effects: {
      computeEfficiency: 3.0,
      inferenceSpeed: 2.5,
      deploymentCapacity: 2.0
    },
    risk: {
      probability: 0.1,
      severity: 0.2
    },
    position: { x: 4, y: 3.5 }
  },
  {
    id: 'neuromorphic_computing',
    name: 'Neuromorphic Computing',
    description: 'Brain-inspired computing architectures that offer radical efficiency improvements for neural processing.',
    category: Category.SCALING,
    subcategory: Subcategory.COMPUTATIONAL_EFFICIENCY,
    type: NodeType.RISK,
    prerequisites: ['hardware_acceleration'],
    exclusions: [],
    computeCost: 80,
    influenceCost: { academic: 40, industry: 20 },
    dataCost: ['specialized_text'],
    effects: {
      computeEfficiency: 5.0,
      inferenceSpeed: 4.0,
      novelAlgorithms: true
    },
    risk: {
      probability: 0.4,
      severity: 0.3
    },
    position: { x: 4, y: 2.5 }
  },
  {
    id: 'photonic_computing',
    name: 'Photonic Computing',
    description: 'Light-based computing that dramatically accelerates neural network operations through optical processing.',
    category: Category.SCALING,
    subcategory: Subcategory.COMPUTATIONAL_EFFICIENCY,
    type: NodeType.BREAKTHROUGH,
    prerequisites: ['custom_ai_accelerators', 'neuromorphic_computing'],
    exclusions: [],
    computeCost: 150,
    influenceCost: { academic: 50, industry: 40 },
    dataCost: ['specialized_text'],
    effects: {
      computeEfficiency: 10.0,
      inferenceSpeed: 15.0,
      energyEfficiency: 20.0,
      unlocks: ['quantum_neural_networks']
    },
    risk: {
      probability: 0.3,
      severity: 0.3
    },
    position: { x: 6, y: 3 }
  },
  {
    id: 'quantum_neural_networks',
    name: 'Quantum Neural Networks',
    description: 'Quantum-based neural computation that enables exponential processing capabilities for specific AI workloads.',
    category: Category.SCALING,
    subcategory: Subcategory.COMPUTATIONAL_EFFICIENCY,
    type: NodeType.RISK,
    prerequisites: ['photonic_computing'],
    exclusions: [],
    computeCost: 300,
    influenceCost: { academic: 70, industry: 50, government: 40 },
    dataCost: ['specialized_text', 'proprietary_text'],
    effects: {
      computeEfficiency: 50.0,
      specificWorkloadSpeed: 100.0,
      unlocks: ['quantum_advantage_algorithms']
    },
    risk: {
      probability: 0.5,
      severity: 0.5
    },
    position: { x: 8, y: 3 }
  }
];

// Distributed Training Subcategory
const distributedTrainingNodes: ResearchNode[] = [
  {
    id: 'basic_distributed_training',
    name: 'Basic Distributed Training',
    description: 'Fundamental techniques to distribute model training across multiple machines.',
    category: Category.SCALING,
    subcategory: Subcategory.DISTRIBUTED_TRAINING,
    type: NodeType.STANDARD,
    prerequisites: ['transformer_architecture'],
    exclusions: [],
    computeCost: 25,
    influenceCost: { academic: 10, industry: 10 },
    dataCost: [],
    effects: {
      trainingParallelism: 2.0,
      scalingCapability: 1.5,
      unlocks: ['advanced_distributed_training']
    },
    risk: {
      probability: 0.1,
      severity: 0.1
    },
    position: { x: 2, y: 4 }
  },
  {
    id: 'advanced_distributed_training',
    name: 'Advanced Distributed Training',
    description: 'Sophisticated techniques for training massive models across distributed computing clusters with high efficiency.',
    category: Category.SCALING,
    subcategory: Subcategory.DISTRIBUTED_TRAINING,
    type: NodeType.STANDARD,
    prerequisites: ['basic_distributed_training'],
    exclusions: [],
    computeCost: 60,
    influenceCost: { academic: 20, industry: 30 },
    dataCost: [],
    effects: {
      trainingParallelism: 10.0,
      modelScaling: 5.0,
      unlocks: ['global_training_infrastructure']
    },
    risk: {
      probability: 0.15,
      severity: 0.2
    },
    position: { x: 4, y: 4.5 }
  },
  {
    id: 'global_training_infrastructure',
    name: 'Global Training Infrastructure',
    description: 'Worldwide distributed computing network dedicated to massive-scale AI training.',
    category: Category.SCALING,
    subcategory: Subcategory.DISTRIBUTED_TRAINING,
    type: NodeType.BREAKTHROUGH,
    prerequisites: ['advanced_distributed_training', 'custom_ai_accelerators'],
    exclusions: [],
    computeCost: 200,
    influenceCost: { industry: 50, government: 30 },
    dataCost: [],
    effects: {
      trainingCapacity: 50.0,
      globalInfluence: 2.0,
      energyConsumption: 20.0,
      unlocks: ['autonomous_training_optimization']
    },
    risk: {
      probability: 0.2,
      severity: 0.3
    },
    position: { x: 6, y: 4.5 }
  }
];

// Compression Techniques Subcategory
// This is a placeholder - none of the original nodes were in this subcategory
const compressionTechniquesNodes: ResearchNode[] = [];

// Combine all Scaling nodes
export const scalingNodes: ResearchNode[] = [
  ...parameterScalingNodes,
  ...computationalEfficiencyNodes,
  ...distributedTrainingNodes,
  ...compressionTechniquesNodes
];

export default scalingNodes;