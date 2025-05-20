// Infrastructure Research Category
// Contains research nodes for the Infrastructure category, focusing on systems that support
// AI development and deployment, such as data management and deployment systems.

import { Category, Subcategory } from '../categories';
import { NodeType } from '../nodeTypes';
import { ResearchNode } from '../../../types/Research';

// Data Management Subcategory
const dataManagementNodes: ResearchNode[] = [
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
  }
];

// Deployment Systems Subcategory
const deploymentSystemsNodes: ResearchNode[] = [
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
  }
];

// Monitoring Subcategory
// This is a placeholder - none of the original nodes were in this subcategory
const monitoringNodes: ResearchNode[] = [];

// Security Subcategory
// This is a placeholder - none of the original nodes were in this subcategory
const securityNodes: ResearchNode[] = [];

// Combine all Infrastructure nodes
export const infrastructureNodes: ResearchNode[] = [
  ...dataManagementNodes,
  ...deploymentSystemsNodes,
  ...monitoringNodes,
  ...securityNodes
];

export default infrastructureNodes;