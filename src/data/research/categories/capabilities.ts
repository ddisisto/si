// Capabilities Research Category
// Contains research nodes for the Capabilities category, focusing on different abilities and
// functions the AI can perform, such as language, vision, multimodal, tool use, and reasoning.

import { Category, Subcategory } from '../categories';
import { NodeType } from '../nodeTypes';
import { ResearchNode } from '../../../types/Research';

// Language Processing Subcategory
const languageProcessingNodes: ResearchNode[] = [
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
  }
];

// Vision Systems Subcategory
const visionSystemsNodes: ResearchNode[] = [
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
  }
];

// Multimodal Integration Subcategory
const multimodalIntegrationNodes: ResearchNode[] = [
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
  }
];

// Tool Use Subcategory
const toolUseNodes: ResearchNode[] = [
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
  }
];

// Reasoning Subcategory
const reasoningNodes: ResearchNode[] = [
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
  }
];

// Combine all Capabilities nodes
export const capabilitiesNodes: ResearchNode[] = [
  ...languageProcessingNodes,
  ...visionSystemsNodes,
  ...multimodalIntegrationNodes,
  ...toolUseNodes,
  ...reasoningNodes
];

export default capabilitiesNodes;