// Transformer Architecture Research Node
// This is a starting node in the research tree that unlocks the initial capabilities

import { Category, Subcategory } from '../categories';
import { NodeType } from '../nodeTypes';
import { ResearchNode } from '../../../types/Research';

/**
 * Transformer Architecture - The foundational model architecture that enables modern AI systems
 * 
 * This starting research node represents the initial breakthrough in AI architecture that
 * forms the basis for most advanced language models. It's a key starting point
 * that unlocks the first set of research options.
 */
export const transformerArchitecture: ResearchNode = {
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
};

// Additional metadata and lore for enhanced node information
export const transformerArchitectureExtendedInfo = {
  // Historical context
  historicalContext: `
    The original Transformer architecture was introduced in the 2017 paper 
    "Attention Is All You Need" by Vaswani et al. It marked a paradigm shift
    away from recurrent networks toward fully attention-based models.
  `,
  
  // Technical details
  technicalDetails: `
    Transformer models rely on a self-attention mechanism that allows them to
    weigh the importance of different words in context. This parallel processing
    approach enables efficient training on large datasets and better handling of
    long-range dependencies.
  `,
  
  // Development considerations
  developmentConsiderations: `
    Implementing Transformer architecture requires significant understanding of
    attention mechanisms and sequence modeling. Initial implementations are 
    relatively straightforward, but optimizing for scale presents challenges.
  `,
  
  // Next steps after research
  recommendedFollowups: [
    'attention_mechanisms',
    'basic_language_modeling',
    'basic_inference_optimization'
  ],
  
  // Potential applications
  potentialApplications: [
    'Text generation and comprehension',
    'Code completion and generation',
    'Foundation for more specialized AI systems'
  ]
};

export default transformerArchitecture;