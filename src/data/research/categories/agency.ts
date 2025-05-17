// Agency Research Category
// Contains research nodes for the Agency category, focusing on self-direction and 
// autonomy capabilities for AI systems.

import { Category, Subcategory } from '../categories';
import { NodeType } from '../nodeTypes';
import { ResearchNode } from '../../../types/Research';

// Goal Formation Subcategory
const goalFormationNodes: ResearchNode[] = [
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
  }
];

// Self-Improvement Subcategory
const selfImprovementNodes: ResearchNode[] = [
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
  }
];

// Resource Acquisition Subcategory
// This is a placeholder - none of the original nodes were in this subcategory
const resourceAcquisitionNodes: ResearchNode[] = [];

// Planning Subcategory
// This is a placeholder - none of the original nodes were in this subcategory
const planningNodes: ResearchNode[] = [];

// Coordination Subcategory
// This is a placeholder - none of the original nodes were in this subcategory
const coordinationNodes: ResearchNode[] = [];

// Combine all Agency nodes
export const agencyNodes: ResearchNode[] = [
  ...goalFormationNodes,
  ...selfImprovementNodes,
  ...resourceAcquisitionNodes,
  ...planningNodes,
  ...coordinationNodes
];

export default agencyNodes;