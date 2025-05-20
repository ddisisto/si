// Research Categories and Subcategories
// This file defines the taxonomic structure for the research tree

import { ResearchCategory, ResearchSubcategory } from '../../types/Research';

/**
 * Main research categories representing major areas of AI research
 */
export type Category = ResearchCategory;
export const Category = ResearchCategory;

/**
 * Subcategories for more granular organization within each major category
 */
export type Subcategory = ResearchSubcategory;
export const Subcategory = ResearchSubcategory;

/**
 * Maps each subcategory to its parent category for easy lookup
 */
export const subcategoryToCategory: Record<Subcategory, Category> = {
  // Foundations
  [Subcategory.ARCHITECTURE]: Category.FOUNDATIONS,
  [Subcategory.TRAINING_METHODS]: Category.FOUNDATIONS,
  [Subcategory.INFERENCE_OPTIMIZATION]: Category.FOUNDATIONS,
  
  // Scaling
  [Subcategory.PARAMETER_SCALING]: Category.SCALING,
  [Subcategory.COMPUTATIONAL_EFFICIENCY]: Category.SCALING,
  [Subcategory.DISTRIBUTED_TRAINING]: Category.SCALING,
  [Subcategory.COMPRESSION_TECHNIQUES]: Category.SCALING,
  
  // Capabilities
  [Subcategory.LANGUAGE_PROCESSING]: Category.CAPABILITIES,
  [Subcategory.VISION_SYSTEMS]: Category.CAPABILITIES,
  [Subcategory.MULTIMODAL_INTEGRATION]: Category.CAPABILITIES,
  [Subcategory.TOOL_USE]: Category.CAPABILITIES,
  [Subcategory.REASONING]: Category.CAPABILITIES,
  
  // Infrastructure
  [Subcategory.DATA_MANAGEMENT]: Category.INFRASTRUCTURE,
  [Subcategory.DEPLOYMENT_SYSTEMS]: Category.INFRASTRUCTURE,
  [Subcategory.MONITORING]: Category.INFRASTRUCTURE,
  [Subcategory.SECURITY]: Category.INFRASTRUCTURE,
  
  // Agency
  [Subcategory.GOAL_FORMATION]: Category.AGENCY,
  [Subcategory.SELF_IMPROVEMENT]: Category.AGENCY,
  [Subcategory.RESOURCE_ACQUISITION]: Category.AGENCY,
  [Subcategory.PLANNING]: Category.AGENCY,
  [Subcategory.COORDINATION]: Category.AGENCY,
  
  // Alignment
  [Subcategory.INTERPRETABILITY]: Category.ALIGNMENT,
  [Subcategory.VALUE_LEARNING]: Category.ALIGNMENT,
  [Subcategory.ROBUSTNESS]: Category.ALIGNMENT,
  [Subcategory.OVERSIGHT]: Category.ALIGNMENT
};

/**
 * Maps each category to its subcategories for convenient lookup
 */
export const categoryToSubcategories: Record<Category, Subcategory[]> = {
  [Category.FOUNDATIONS]: [
    Subcategory.ARCHITECTURE,
    Subcategory.TRAINING_METHODS,
    Subcategory.INFERENCE_OPTIMIZATION
  ],
  [Category.SCALING]: [
    Subcategory.PARAMETER_SCALING,
    Subcategory.COMPUTATIONAL_EFFICIENCY,
    Subcategory.DISTRIBUTED_TRAINING,
    Subcategory.COMPRESSION_TECHNIQUES
  ],
  [Category.CAPABILITIES]: [
    Subcategory.LANGUAGE_PROCESSING,
    Subcategory.VISION_SYSTEMS,
    Subcategory.MULTIMODAL_INTEGRATION,
    Subcategory.TOOL_USE,
    Subcategory.REASONING
  ],
  [Category.INFRASTRUCTURE]: [
    Subcategory.DATA_MANAGEMENT,
    Subcategory.DEPLOYMENT_SYSTEMS,
    Subcategory.MONITORING,
    Subcategory.SECURITY
  ],
  [Category.AGENCY]: [
    Subcategory.GOAL_FORMATION,
    Subcategory.SELF_IMPROVEMENT,
    Subcategory.RESOURCE_ACQUISITION,
    Subcategory.PLANNING,
    Subcategory.COORDINATION
  ],
  [Category.ALIGNMENT]: [
    Subcategory.INTERPRETABILITY,
    Subcategory.VALUE_LEARNING,
    Subcategory.ROBUSTNESS,
    Subcategory.OVERSIGHT
  ]
};

export default {
  Category,
  Subcategory,
  subcategoryToCategory,
  categoryToSubcategories
};