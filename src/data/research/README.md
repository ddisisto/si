# Research Data Organization

This directory contains the research tree data for SuperInt++, organized into a modular structure for easier maintenance and extension.

## Directory Structure

- `index.ts` - Main export file that combines all research data
- `categories.ts` - Definitions of research categories and subcategories
- `nodeTypes.ts` - Definitions of node types and their characteristics
- `validation.ts` - Utilities for validating research node data
- `/categories/` - Directory containing category-specific node collections
  - `foundations.ts` - Nodes in the Foundations category
  - `scaling.ts` - Nodes in the Scaling category
  - `capabilities.ts` - Nodes in the Capabilities category
  - `infrastructure.ts` - Nodes in the Infrastructure category
  - `agency.ts` - Nodes in the Agency category
  - `alignment.ts` - Nodes in the Alignment category
- `/nodes/` - Directory containing definitions for significant individual nodes
  - `transformerArchitecture.ts` - Detailed definition of the Transformer Architecture node
  - `recursiveSelfImprovement.ts` - Detailed definition of the Recursive Self-Improvement node
  - *(additional significant nodes will be added here)*

## Usage

### Importing Research Data

To use the research data in your code:

```typescript
// Import all research nodes
import researchNodes from '../data/research';

// Import specific categories and utilities
import { 
  Category, 
  NodeType, 
  nodesByCategory, 
  nodesById 
} from '../data/research';

// Access individual significant nodes
import { transformerArchitecture } from '../data/research';
```

### Working with Categories

Research is organized into six main categories, each with multiple subcategories:

1. **Foundations** - Core building blocks (Architecture, Training Methods, Inference Optimization)
2. **Scaling** - Making AI systems larger (Parameter Scaling, Computational Efficiency, Distributed Training, Compression)
3. **Capabilities** - New abilities (Language, Vision, Multimodal, Tool Use, Reasoning)
4. **Infrastructure** - Supporting systems (Data Management, Deployment, Monitoring, Security)
5. **Agency** - Self-direction (Goal Formation, Self-Improvement, Resource Acquisition, Planning, Coordination)
6. **Alignment** - Ensuring good behavior (Interpretability, Value Learning, Robustness, Oversight)

### Node Types

Each research node has one of the following types:

1. **Standard** - Normal research nodes with predictable effects
2. **Breakthrough** - Major advancements that unlock significant new capabilities
3. **Tiered** - Nodes with multiple levels representing incremental improvements
4. **Risk** - Higher risk nodes with greater potential rewards
5. **Divergent** - Mutually exclusive choices between different paths

## Adding New Research Nodes

### Creating a Basic Node

To add a new node to an existing category:

1. Add the node definition to the appropriate category file in `/categories/`
2. Ensure the node has all required properties (see `ResearchNodeData` interface in `types/Research.ts`)
3. Add any necessary prerequisites and unlocks

Example:

```typescript
// In categories/foundations.ts
const newNode: ResearchNodeData = {
  id: 'unique_node_id',
  name: 'Display Name',
  description: 'Detailed description of the research.',
  category: Category.FOUNDATIONS,
  subcategory: Subcategory.ARCHITECTURE,
  type: NodeType.STANDARD,
  prerequisites: ['other_node_id'],
  exclusions: [],
  computeCost: 30,
  influenceCost: { academic: 15, industry: 10 },
  dataCost: ['public_text'],
  effects: {
    unlocks: ['future_node_id'],
    someCapability: 1.5
  },
  risk: {
    probability: 0.1,
    severity: 0.2
  },
  position: { x: 5, y: 2 }
};

// Add to the appropriate array
architectureNodes.push(newNode);
```

### Creating a Significant Node

For major nodes that deserve more detailed information:

1. Create a new file in the `/nodes/` directory
2. Define the node and any extended information
3. Export the node as the default
4. Add it to the `extendedNodeInfo` object in `index.ts`

Example:

```typescript
// In nodes/mySignificantNode.ts
import { Category, Subcategory } from '../categories';
import { NodeType } from '../nodeTypes';
import { ResearchNodeData } from '../../../types/Research';

export const mySignificantNode: ResearchNodeData = {
  // Basic node properties
  // ...
};

export const mySignificantNodeExtendedInfo = {
  historicalContext: `...`,
  technicalDetails: `...`,
  // Additional detailed information
};

export default mySignificantNode;
```

Then update `index.ts`:

```typescript
// In index.ts
import mySignificantNode, { mySignificantNodeExtendedInfo } from './nodes/mySignificantNode';

// Add to extendedNodeInfo
export const extendedNodeInfo: Record<string, any> = {
  // ...existing nodes
  my_significant_node_id: mySignificantNodeExtendedInfo,
};

// Export the node individually
export {
  // ...existing exports
  mySignificantNode,
};
```

## Validation

The research tree includes validation utilities to ensure data integrity:

- `validateNode()` - Checks a single node for required properties
- `findDependencyCycles()` - Identifies circular dependencies
- `validatePrerequisites()` - Ensures all prerequisites exist
- `validateResearchTree()` - Performs comprehensive validation

To validate the research tree:

```typescript
import { validation, researchNodes } from '../data/research';

const results = validation.validateResearchTree(researchNodes);
if (!results.isValid) {
  console.error('Research tree validation failed:', results);
}
```

## Best Practices

1. **Categorization** - Place nodes in appropriate categories and subcategories
2. **Prerequisites** - Ensure logical progression through prerequisites
3. **Effects** - Use consistent naming for effects properties
4. **Positioning** - Maintain relative positioning that makes sense visually
5. **Risk Balance** - Higher rewards should come with higher risks
6. **Documentation** - Add thorough descriptions for all nodes
7. **Validation** - Run validation checks when adding new nodes