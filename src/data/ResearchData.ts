// Research Data

/**
 * This file has been refactored to use the new modular research data structure.
 * Please import research nodes from the new structure in src/data/research/index.ts
 */

import researchNodes, {
  Category,
  Subcategory,
  NodeType
} from './research';

// Export all relevant types and data
export {
  Category,
  Subcategory,
  NodeType,
  researchNodes as researchNodes
};

// Default export the research nodes
export default researchNodes;