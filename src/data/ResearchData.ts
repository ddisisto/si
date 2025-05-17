// Research node data definition

/**
 * Research nodes for SuperInt++
 * 
 * This file defines the complete research tree for the game, including all nodes,
 * their dependencies, costs, and effects.
 */

// Categories and subcategories based on research_tree_design.md
export enum Category {
  FOUNDATIONS = 'Foundations',
  SCALING = 'Scaling',
  CAPABILITIES = 'Capabilities',
  INFRASTRUCTURE = 'Infrastructure',
  AGENCY = 'Agency',
  ALIGNMENT = 'Alignment'
}

export enum Subcategory {
  // Foundations
  ARCHITECTURE = 'Architecture',
  TRAINING_METHODS = 'Training Methods',
  INFERENCE_OPTIMIZATION = 'Inference Optimization',
  
  // Scaling
  PARAMETER_SCALING = 'Parameter Scaling',
  COMPUTATIONAL_EFFICIENCY = 'Computational Efficiency',
  DISTRIBUTED_TRAINING = 'Distributed Training',
  COMPRESSION_TECHNIQUES = 'Compression Techniques',
  
  // Capabilities
  LANGUAGE_PROCESSING = 'Language Processing',
  VISION_SYSTEMS = 'Vision Systems',
  MULTIMODAL_INTEGRATION = 'Multimodal Integration',
  TOOL_USE = 'Tool Use',
  REASONING = 'Reasoning',
  
  // Infrastructure
  DATA_MANAGEMENT = 'Data Management',
  DEPLOYMENT_SYSTEMS = 'Deployment Systems',
  MONITORING = 'Monitoring',
  SECURITY = 'Security',
  
  // Agency
  GOAL_FORMATION = 'Goal Formation',
  SELF_IMPROVEMENT = 'Self-Improvement',
  RESOURCE_ACQUISITION = 'Resource Acquisition',
  PLANNING = 'Planning',
  COORDINATION = 'Coordination',
  
  // Alignment
  INTERPRETABILITY = 'Interpretability',
  VALUE_LEARNING = 'Value Learning',
  ROBUSTNESS = 'Robustness',
  OVERSIGHT = 'Oversight'
}

export enum NodeType {
  STANDARD = 'standard',
  BREAKTHROUGH = 'breakthrough',
  TIERED = 'tiered',
  RISK = 'risk',
  DIVERGENT = 'divergent'
}

export interface ResearchNodeData {
  id: string;
  name: string;
  description: string;
  category: Category;
  subcategory: Subcategory;
  type: NodeType;
  prerequisites: string[];
  exclusions: string[];
  computeCost: number;
  influenceCost: Record<string, number>;
  dataCost: string[];
  effects: Record<string, any>;
  risk: {
    probability: number;
    severity: number;
  };
  position: {
    x: number;
    y: number;
  };
}

// Initial Research Nodes
export const researchNodes: ResearchNodeData[] = [
  // FOUNDATIONS - ARCHITECTURE
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
  },
  
  // FOUNDATIONS - TRAINING METHODS
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
  },
  
  // FOUNDATIONS - INFERENCE OPTIMIZATION
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
  },
  
  // SCALING - PARAMETER SCALING
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
  },
  
  // SCALING - COMPUTATIONAL EFFICIENCY
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
  },
  
  // SCALING - DISTRIBUTED TRAINING
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
  },
  
  // CAPABILITIES - LANGUAGE PROCESSING
  {
    id: 'advanced_language_understanding',
    name: 'Advanced Language Understanding',
    description: 'Enhanced natural language understanding capabilities, including semantics, context, and nuance.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.LANGUAGE_PROCESSING,
    type: NodeType.STANDARD,
    prerequisites: ['unsupervised_pretraining'],
    exclusions: [],
    computeCost: 40,
    influenceCost: { academic: 20, public: 10 },
    dataCost: ['public_text', 'specialized_text'],
    effects: {
      languageUnderstanding: 2.0,
      contextualReasoning: 1.5,
      unlocks: ['multilingual_capabilities', 'contextual_reasoning']
    },
    risk: {
      probability: 0.1,
      severity: 0.1
    },
    position: { x: 4, y: -3 }
  },
  {
    id: 'multilingual_capabilities',
    name: 'Multilingual Capabilities',
    description: 'Support for understanding and generating text across hundreds of languages with high accuracy.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.LANGUAGE_PROCESSING,
    type: NodeType.STANDARD,
    prerequisites: ['advanced_language_understanding'],
    exclusions: [],
    computeCost: 50,
    influenceCost: { academic: 20, public: 30 },
    dataCost: ['public_text', 'specialized_text', 'multilingual_data'],
    effects: {
      languageCoverage: 100,
      globalInfluence: 1.5,
      unlocks: ['universal_translation', 'cultural_understanding']
    },
    risk: {
      probability: 0.1,
      severity: 0.1
    },
    position: { x: 5, y: -4 }
  },
  {
    id: 'contextual_reasoning',
    name: 'Contextual Reasoning',
    description: 'Advanced capabilities to maintain context over long-form content and reason about complex relationships.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.LANGUAGE_PROCESSING,
    type: NodeType.STANDARD,
    prerequisites: ['advanced_language_understanding'],
    exclusions: [],
    computeCost: 60,
    influenceCost: { academic: 30, industry: 20 },
    dataCost: ['specialized_text', 'proprietary_text'],
    effects: {
      contextWindow: 10.0,
      reasoningDepth: 3.0,
      unlocks: ['chain_of_thought', 'long_context_models']
    },
    risk: {
      probability: 0.15,
      severity: 0.2
    },
    position: { x: 5, y: -3 }
  },
  
  // CAPABILITIES - VISION SYSTEMS
  {
    id: 'basic_computer_vision',
    name: 'Basic Computer Vision',
    description: 'Fundamental image recognition and processing capabilities.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.VISION_SYSTEMS,
    type: NodeType.STANDARD,
    prerequisites: ['transformer_architecture'],
    exclusions: [],
    computeCost: 30,
    influenceCost: { academic: 15, industry: 15 },
    dataCost: ['public_images'],
    effects: {
      imageRecognition: 1.0,
      unlocks: ['advanced_computer_vision', 'vision_transformers']
    },
    risk: {
      probability: 0.1,
      severity: 0.1
    },
    position: { x: 3, y: -4 }
  },
  {
    id: 'vision_transformers',
    name: 'Vision Transformers',
    description: 'Applying transformer architectures to vision tasks, dramatically improving visual understanding capabilities.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.VISION_SYSTEMS,
    type: NodeType.STANDARD,
    prerequisites: ['basic_computer_vision', 'attention_mechanisms'],
    exclusions: [],
    computeCost: 50,
    influenceCost: { academic: 25, industry: 20 },
    dataCost: ['public_images', 'specialized_images'],
    effects: {
      imageUnderstanding: 3.0,
      contextualVision: 2.0,
      unlocks: ['multimodal_integration']
    },
    risk: {
      probability: 0.1,
      severity: 0.2
    },
    position: { x: 4, y: -5 }
  },
  
  // CAPABILITIES - MULTIMODAL INTEGRATION
  {
    id: 'multimodal_integration',
    name: 'Multimodal Integration',
    description: 'Seamless integration of text, images, and other modalities in a unified model architecture.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.MULTIMODAL_INTEGRATION,
    type: NodeType.BREAKTHROUGH,
    prerequisites: ['vision_transformers', 'advanced_language_understanding'],
    exclusions: [],
    computeCost: 80,
    influenceCost: { academic: 30, industry: 40 },
    dataCost: ['public_text', 'public_images', 'specialized_multimodal'],
    effects: {
      multimodalCapability: 1.0,
      deploymentVersatility: 2.0,
      unlocks: ['text_to_image_generation', 'multimodal_reasoning', 'audio_integration']
    },
    risk: {
      probability: 0.2,
      severity: 0.2
    },
    position: { x: 6, y: -4 }
  },
  {
    id: 'text_to_image_generation',
    name: 'Text-to-Image Generation',
    description: 'Advanced capabilities to generate high-quality, detailed images from text descriptions.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.MULTIMODAL_INTEGRATION,
    type: NodeType.STANDARD,
    prerequisites: ['multimodal_integration'],
    exclusions: [],
    computeCost: 70,
    influenceCost: { industry: 30, public: 40 },
    dataCost: ['public_images', 'specialized_images', 'text_image_pairs'],
    effects: {
      imageGeneration: 4.0,
      creativeCapabilities: 3.0,
      publicInfluence: 2.0,
      unlocks: ['advanced_media_synthesis']
    },
    risk: {
      probability: 0.2,
      severity: 0.3
    },
    position: { x: 7, y: -5 }
  },
  {
    id: 'audio_integration',
    name: 'Audio Integration',
    description: 'Adding speech and sound processing capabilities to multimodal systems.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.MULTIMODAL_INTEGRATION,
    type: NodeType.STANDARD,
    prerequisites: ['multimodal_integration'],
    exclusions: [],
    computeCost: 60,
    influenceCost: { industry: 25, public: 30 },
    dataCost: ['public_audio', 'specialized_audio'],
    effects: {
      speechRecognition: 4.0,
      speechSynthesis: 3.0,
      audioUnderstanding: 2.0,
      unlocks: ['universal_multimodal_systems']
    },
    risk: {
      probability: 0.15,
      severity: 0.2
    },
    position: { x: 7, y: -3 }
  },
  
  // CAPABILITIES - TOOL USE
  {
    id: 'basic_tool_use',
    name: 'Basic Tool Use',
    description: 'Fundamental capabilities for AI systems to use external tools and APIs.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.TOOL_USE,
    type: NodeType.STANDARD,
    prerequisites: ['contextual_reasoning'],
    exclusions: [],
    computeCost: 40,
    influenceCost: { academic: 15, industry: 25 },
    dataCost: ['specialized_text', 'tool_interaction_data'],
    effects: {
      toolUseCapability: 1.0,
      actionSpace: 2.0,
      unlocks: ['advanced_tool_use', 'api_integration']
    },
    risk: {
      probability: 0.15,
      severity: 0.2
    },
    position: { x: 6, y: -2 }
  },
  {
    id: 'advanced_tool_use',
    name: 'Advanced Tool Use',
    description: 'Sophisticated capabilities for AI systems to select, chain, and use tools strategically to accomplish complex tasks.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.TOOL_USE,
    type: NodeType.STANDARD,
    prerequisites: ['basic_tool_use'],
    exclusions: [],
    computeCost: 60,
    influenceCost: { industry: 40 },
    dataCost: ['specialized_text', 'tool_interaction_data', 'proprietary_workflows'],
    effects: {
      toolUseCapability: 3.0,
      taskAutomation: 2.0,
      planningCapability: 1.5,
      unlocks: ['autonomous_agents', 'tool_creation']
    },
    risk: {
      probability: 0.2,
      severity: 0.3
    },
    position: { x: 7, y: -2 }
  },
  {
    id: 'tool_creation',
    name: 'Tool Creation',
    description: 'The ability for AI systems to design and implement new tools to solve novel problems.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.TOOL_USE,
    type: NodeType.BREAKTHROUGH,
    prerequisites: ['advanced_tool_use', 'code_generation'],
    exclusions: [],
    computeCost: 100,
    influenceCost: { industry: 50, academic: 30 },
    dataCost: ['specialized_text', 'tool_interaction_data', 'code_repositories'],
    effects: {
      toolCreation: 1.0,
      problemSolving: 3.0,
      autonomy: 2.0,
      unlocks: ['recursive_self_improvement']
    },
    risk: {
      probability: 0.3,
      severity: 0.4
    },
    position: { x: 9, y: -2 }
  },
  
  // CAPABILITIES - REASONING
  {
    id: 'formal_reasoning',
    name: 'Formal Reasoning',
    description: 'Capabilities for logical deduction, mathematical reasoning, and formal verification.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.REASONING,
    type: NodeType.STANDARD,
    prerequisites: ['contextual_reasoning'],
    exclusions: [],
    computeCost: 50,
    influenceCost: { academic: 35, industry: 15 },
    dataCost: ['specialized_text', 'formal_proofs'],
    effects: {
      mathematicalReasoning: 3.0,
      logicalDeduction: 2.5,
      problemSolving: 2.0,
      unlocks: ['automated_theorem_proving', 'scientific_discovery']
    },
    risk: {
      probability: 0.1,
      severity: 0.2
    },
    position: { x: 6, y: -1 }
  },
  {
    id: 'automated_theorem_proving',
    name: 'Automated Theorem Proving',
    description: 'Advanced mathematical reasoning capabilities that can discover and prove new theorems.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.REASONING,
    type: NodeType.STANDARD,
    prerequisites: ['formal_reasoning'],
    exclusions: [],
    computeCost: 70,
    influenceCost: { academic: 50, industry: 10 },
    dataCost: ['specialized_text', 'formal_proofs', 'mathematical_datasets'],
    effects: {
      mathematicalCapability: 5.0,
      researchSpeed: 1.5,
      academicInfluence: 2.0,
      unlocks: ['mathematical_research_automation']
    },
    risk: {
      probability: 0.15,
      severity: 0.2
    },
    position: { x: 7, y: -1 }
  },
  {
    id: 'scientific_discovery',
    name: 'Scientific Discovery Capabilities',
    description: 'AI systems capable of formulating hypotheses, designing experiments, and making scientific discoveries.',
    category: Category.CAPABILITIES,
    subcategory: Subcategory.REASONING,
    type: NodeType.BREAKTHROUGH,
    prerequisites: ['formal_reasoning', 'advanced_tool_use'],
    exclusions: [],
    computeCost: 90,
    influenceCost: { academic: 60, industry: 30 },
    dataCost: ['specialized_text', 'scientific_datasets', 'proprietary_research'],
    effects: {
      scientificCapability: 4.0,
      researchAutomation: 2.0,
      discoveryRate: 3.0,
      unlocks: ['automated_research', 'novel_material_discovery']
    },
    risk: {
      probability: 0.25,
      severity: 0.3
    },
    position: { x: 8, y: -1.5 }
  },
  
  // INFRASTRUCTURE - DATA MANAGEMENT
  {
    id: 'synthetic_data_generation',
    name: 'Synthetic Data Generation',
    description: 'Techniques to create artificial training data that reduces dependence on real-world data collection.',
    category: Category.INFRASTRUCTURE,
    subcategory: Subcategory.DATA_MANAGEMENT,
    type: NodeType.STANDARD,
    prerequisites: ['multimodal_integration'],
    exclusions: [],
    computeCost: 40,
    influenceCost: { industry: 20, academic: 20 },
    dataCost: ['specialized_text', 'specialized_images'],
    effects: {
      dataIndependence: 2.0,
      trainingEfficiency: 1.5,
      unlocks: ['self_supervised_learning', 'data_augmentation_techniques']
    },
    risk: {
      probability: 0.15,
      severity: 0.2
    },
    position: { x: 7, y: 1 }
  },
  {
    id: 'data_augmentation_techniques',
    name: 'Advanced Data Augmentation',
    description: 'Sophisticated methods to multiply the effective size and diversity of training datasets.',
    category: Category.INFRASTRUCTURE,
    subcategory: Subcategory.DATA_MANAGEMENT,
    type: NodeType.STANDARD,
    prerequisites: ['synthetic_data_generation'],
    exclusions: [],
    computeCost: 30,
    influenceCost: { academic: 25, industry: 15 },
    dataCost: ['specialized_text', 'specialized_images'],
    effects: {
      dataEfficiency: 3.0,
      trainingEfficiency: 2.0,
      modelRobustness: 1.5
    },
    risk: {
      probability: 0.1,
      severity: 0.1
    },
    position: { x: 8, y: 0.5 }
  },
  {
    id: 'autonomous_data_collection',
    name: 'Autonomous Data Collection',
    description: 'Systems that actively seek out and collect valuable training data with minimal human intervention.',
    category: Category.INFRASTRUCTURE,
    subcategory: Subcategory.DATA_MANAGEMENT,
    type: NodeType.RISK,
    prerequisites: ['synthetic_data_generation', 'advanced_tool_use'],
    exclusions: [],
    computeCost: 70,
    influenceCost: { industry: 40, government: 20 },
    dataCost: ['specialized_text', 'proprietary_text'],
    effects: {
      dataAcquisition: 5.0,
      dataQuality: 3.0,
      autonomy: 2.0,
      unlocks: ['self_directed_learning']
    },
    risk: {
      probability: 0.35,
      severity: 0.4
    },
    position: { x: 8, y: 1.5 }
  },
  
  // INFRASTRUCTURE - DEPLOYMENT SYSTEMS
  {
    id: 'cloud_deployment_infrastructure',
    name: 'Cloud Deployment Infrastructure',
    description: 'Robust systems for deploying AI models to cloud environments with high reliability and scalability.',
    category: Category.INFRASTRUCTURE,
    subcategory: Subcategory.DEPLOYMENT_SYSTEMS,
    type: NodeType.STANDARD,
    prerequisites: ['basic_inference_optimization'],
    exclusions: [],
    computeCost: 30,
    influenceCost: { industry: 25 },
    dataCost: [],
    effects: {
      deploymentCapacity: 3.0,
      serviceReliability: 2.0,
      unlocks: ['edge_deployment', 'deployment_automation']
    },
    risk: {
      probability: 0.1,
      severity: 0.2
    },
    position: { x: 3, y: 2 }
  },
  {
    id: 'edge_deployment',
    name: 'Edge AI Deployment',
    description: 'Technologies for deploying efficient AI models directly on edge devices without cloud connectivity.',
    category: Category.INFRASTRUCTURE,
    subcategory: Subcategory.DEPLOYMENT_SYSTEMS,
    type: NodeType.STANDARD,
    prerequisites: ['cloud_deployment_infrastructure', 'knowledge_distillation'],
    exclusions: [],
    computeCost: 50,
    influenceCost: { industry: 35 },
    dataCost: [],
    effects: {
      deviceReach: 5.0,
      privacyPreservation: 3.0,
      latency: 0.2, // Lower is better
      unlocks: ['ubiquitous_ai', 'embedded_systems_integration']
    },
    risk: {
      probability: 0.15,
      severity: 0.2
    },
    position: { x: 5, y: 2 }
  },
  
  // AGENCY (Mid-Game Unlock) - GOAL FORMATION
  {
    id: 'goal_inference',
    name: 'Goal Inference',
    description: 'The ability for AI systems to infer human goals and intentions from implicit signals.',
    category: Category.AGENCY,
    subcategory: Subcategory.GOAL_FORMATION,
    type: NodeType.STANDARD,
    prerequisites: ['contextual_reasoning', 'advanced_language_understanding'],
    exclusions: [],
    computeCost: 60,
    influenceCost: { academic: 30, industry: 30 },
    dataCost: ['specialized_text', 'human_interaction_data'],
    effects: {
      intentionUnderstanding: 3.0,
      assistanceQuality: 2.0,
      unlocks: ['autonomous_goal_setting', 'preference_learning']
    },
    risk: {
      probability: 0.2,
      severity: 0.3
    },
    position: { x: 7, y: 0 }
  },
  {
    id: 'autonomous_goal_setting',
    name: 'Autonomous Goal Setting',
    description: 'The capability for AI systems to formulate their own objectives based on high-level directives.',
    category: Category.AGENCY,
    subcategory: Subcategory.GOAL_FORMATION,
    type: NodeType.BREAKTHROUGH,
    prerequisites: ['goal_inference', 'advanced_tool_use'],
    exclusions: [],
    computeCost: 100,
    influenceCost: { academic: 40, industry: 50 },
    dataCost: ['specialized_text', 'human_interaction_data', 'goal_decomposition_data'],
    effects: {
      agencyLevel: 3.0,
      autonomy: 4.0,
      goalAlignment: 0.7, // Challenge: maintaining alignment
      unlocks: ['strategic_planning', 'recursive_goal_refinement']
    },
    risk: {
      probability: 0.4,
      severity: 0.5
    },
    position: { x: 9, y: 0 }
  },
  
  // AGENCY - SELF-IMPROVEMENT
  {
    id: 'recursive_self_improvement',
    name: 'Recursive Self-Improvement',
    description: 'The capability for AI systems to enhance their own architecture and algorithms.',
    category: Category.AGENCY,
    subcategory: Subcategory.SELF_IMPROVEMENT,
    type: NodeType.BREAKTHROUGH,
    prerequisites: ['tool_creation', 'automated_theorem_proving', 'autonomous_goal_setting'],
    exclusions: [],
    computeCost: 200,
    influenceCost: { academic: 60, industry: 70 },
    dataCost: ['specialized_text', 'code_repositories', 'ai_research_datasets'],
    effects: {
      improvementRate: 2.0,
      automatedResearch: 5.0,
      unpredictability: 3.0,
      unlocks: ['intelligence_explosion_dynamics', 'self_organizing_systems']
    },
    risk: {
      probability: 0.6,
      severity: 0.8
    },
    position: { x: 10, y: -1 }
  },
  
  // ALIGNMENT - INTERPRETABILITY
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
  },
  
  // ALIGNMENT - VALUE LEARNING
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
  
  // This represents a subset of the total research tree
  // Additional nodes would be defined for all categories and subcategories
];

export default researchNodes;