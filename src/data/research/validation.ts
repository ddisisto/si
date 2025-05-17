// Research Data Validation
// Provides utilities for validating research node data

import { Category, Subcategory, subcategoryToCategory } from './categories';
import { NodeType } from './nodeTypes';
import { ResearchNode } from '../../types/Research';

/**
 * Validates a research node to ensure it has all required properties with correct types
 * @param node The research node to validate
 * @returns An array of validation error messages, empty if valid
 */
export function validateNode(node: Partial<ResearchNode>): string[] {
  const errors: string[] = [];
  
  // Required string fields
  ['id', 'name', 'description'].forEach(field => {
    if (!node[field as keyof ResearchNode] || typeof node[field as keyof ResearchNode] !== 'string') {
      errors.push(`Missing or invalid ${field}`);
    }
  });
  
  // Validate category and subcategory
  if (!node.category || !Object.values(Category).includes(node.category)) {
    errors.push(`Invalid category: ${node.category}`);
  }
  
  if (!node.subcategory || !Object.values(Subcategory).includes(node.subcategory)) {
    errors.push(`Invalid subcategory: ${node.subcategory}`);
  }
  
  // Validate that subcategory belongs to the specified category
  if (node.category && node.subcategory && 
      subcategoryToCategory[node.subcategory as Subcategory] !== node.category) {
    errors.push(`Subcategory ${node.subcategory} does not belong to category ${node.category}`);
  }
  
  // Validate node type
  if (!node.type || !Object.values(NodeType).includes(node.type)) {
    errors.push(`Invalid node type: ${node.type}`);
  }
  
  // Validate arrays
  if (!Array.isArray(node.prerequisites)) {
    errors.push('prerequisites must be an array');
  }
  
  if (!Array.isArray(node.exclusions)) {
    errors.push('exclusions must be an array');
  }
  
  // Validate costs
  if (typeof node.computeCost !== 'number' || node.computeCost < 0) {
    errors.push('computeCost must be a non-negative number');
  }
  
  if (!node.influenceCost || typeof node.influenceCost !== 'object') {
    errors.push('influenceCost must be an object');
  }
  
  if (!Array.isArray(node.dataCost)) {
    errors.push('dataCost must be an array');
  }
  
  // Validate effects
  if (!node.effects || typeof node.effects !== 'object') {
    errors.push('effects must be an object');
  }
  
  // Validate risk
  if (!node.risk || typeof node.risk !== 'object' || 
      typeof node.risk.probability !== 'number' || 
      typeof node.risk.severity !== 'number') {
    errors.push('risk must be an object with numeric probability and severity');
  }
  
  // Validate position
  if (!node.position || typeof node.position !== 'object' || 
      typeof node.position.x !== 'number' || 
      typeof node.position.y !== 'number') {
    errors.push('position must be an object with numeric x and y coordinates');
  }
  
  return errors;
}

/**
 * Checks for dependency cycles in the research tree
 * @param nodes Array of research nodes to check
 * @returns Array of cycle descriptions, empty if no cycles found
 */
export function findDependencyCycles(nodes: ResearchNode[]): string[] {
  const cycles: string[] = [];
  const nodeMap: Record<string, ResearchNode> = {};
  
  // Create map for quick access
  nodes.forEach(node => {
    nodeMap[node.id] = node;
  });
  
  // For each node, traverse its dependency chain to look for cycles
  nodes.forEach(node => {
    const visited = new Set<string>();
    const path: string[] = [];
    
    function dfs(currentId: string) {
      // If we've seen this node in this path, we found a cycle
      if (path.includes(currentId)) {
        const cycleStart = path.indexOf(currentId);
        const cycle = [...path.slice(cycleStart), currentId];
        cycles.push(`Dependency cycle: ${cycle.join(' → ')}`);
        return;
      }
      
      // If we've already visited this node on another path, skip it
      if (visited.has(currentId)) return;
      
      // Mark as visited and add to current path
      visited.add(currentId);
      path.push(currentId);
      
      // Check all prerequisites recursively
      const currentNode = nodeMap[currentId];
      if (currentNode && currentNode.prerequisites) {
        currentNode.prerequisites.forEach(prereqId => {
          dfs(prereqId);
        });
      }
      
      // Remove from current path when backtracking
      path.pop();
    }
    
    dfs(node.id);
  });
  
  return cycles;
}

/**
 * Validates that all prerequisites referenced actually exist
 * @param nodes Array of research nodes to check
 * @returns Array of errors for missing prerequisites
 */
export function validatePrerequisites(nodes: ResearchNode[]): string[] {
  const errors: string[] = [];
  const nodeIds = new Set(nodes.map(node => node.id));
  
  nodes.forEach(node => {
    node.prerequisites.forEach((prereqId: string) => {
      if (!nodeIds.has(prereqId)) {
        errors.push(`Node ${node.id} references non-existent prerequisite ${prereqId}`);
      }
    });
  });
  
  return errors;
}

/**
 * Performs all validation checks on a set of research nodes
 * @param nodes Array of research nodes to validate
 * @returns Object containing various validation results
 */
export function validateResearchTree(nodes: ResearchNode[]): {
  invalidNodes: {nodeId: string, errors: string[]}[];
  cycles: string[];
  missingPrerequisites: string[];
  isValid: boolean;
} {
  const invalidNodes = nodes
    .map(node => ({
      nodeId: node.id,
      errors: validateNode(node)
    }))
    .filter(result => result.errors.length > 0);
  
  const cycles = findDependencyCycles(nodes);
  const missingPrerequisites = validatePrerequisites(nodes);
  
  const isValid = invalidNodes.length === 0 && 
                 cycles.length === 0 && 
                 missingPrerequisites.length === 0;
  
  return {
    invalidNodes,
    cycles,
    missingPrerequisites,
    isValid
  };
}

export default {
  validateNode,
  findDependencyCycles,
  validatePrerequisites,
  validateResearchTree
};