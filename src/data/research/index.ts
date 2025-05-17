// Research Data Main Export
// This file exports all research data in a structured way

import { ResearchNode } from '../../types/Research';
import { Category, Subcategory, categoryToSubcategories, subcategoryToCategory } from './categories';
import { NodeType, nodeTypeDefaults, nodeTypeVisuals } from './nodeTypes';
import validation from './validation';

// Import category data
import foundationsNodes from './categories/foundations';
import scalingNodes from './categories/scaling';
import capabilitiesNodes from './categories/capabilities';
import infrastructureNodes from './categories/infrastructure';
import agencyNodes from './categories/agency';
import alignmentNodes from './categories/alignment';

// Import significant individual nodes
import transformerArchitecture, { transformerArchitectureExtendedInfo } from './nodes/transformerArchitecture';
import recursiveSelfImprovement, { recursiveSelfImprovementExtendedInfo } from './nodes/recursiveSelfImprovement';

// Combine all research nodes into a single array
export const researchNodes: ResearchNode[] = [
  // Include all category nodes
  ...foundationsNodes,
  ...scalingNodes,
  ...capabilitiesNodes,
  ...infrastructureNodes,
  ...agencyNodes,
  ...alignmentNodes
];

// Map of node ID to extended info (for nodes that have it)
export const extendedNodeInfo: Record<string, any> = {
  transformer_architecture: transformerArchitectureExtendedInfo,
  recursive_self_improvement: recursiveSelfImprovementExtendedInfo,
};

// Group nodes by category for easier access
export const nodesByCategory: Record<Category, ResearchNode[]> = {
  [Category.FOUNDATIONS]: foundationsNodes,
  [Category.SCALING]: scalingNodes,
  [Category.CAPABILITIES]: capabilitiesNodes,
  [Category.INFRASTRUCTURE]: infrastructureNodes,
  [Category.AGENCY]: agencyNodes,
  [Category.ALIGNMENT]: alignmentNodes
};

// Create index of nodes by ID for quick lookup
export const nodesById: Record<string, ResearchNode> = {};
researchNodes.forEach(node => {
  nodesById[node.id] = node;
});

// Export validation results for debugging (only in development)
export const validationResults = validation.validateResearchTree(researchNodes);

export {
  // Export base enums and utilities
  Category,
  Subcategory,
  categoryToSubcategories,
  subcategoryToCategory,
  
  // Export node type information
  NodeType,
  nodeTypeDefaults,
  nodeTypeVisuals,
  
  // Export validation utilities
  validation,
  
  // Export individual significant nodes
  transformerArchitecture,
  recursiveSelfImprovement,
};

// Default export is all research nodes
export default researchNodes;