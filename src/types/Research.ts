/**
 * Types for the research system
 */

// Research categories
export enum ResearchCategory {
  FOUNDATIONS = 'Foundations',
  SCALING = 'Scaling',
  CAPABILITIES = 'Capabilities',
  INFRASTRUCTURE = 'Infrastructure',
  AGENCY = 'Agency',
  ALIGNMENT = 'Alignment'
}

// Research subcategories
export enum ResearchSubcategory {
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

// Research node types
export enum ResearchNodeType {
  STANDARD = 'standard',
  BREAKTHROUGH = 'breakthrough',
  TIERED = 'tiered',
  RISK = 'risk',
  DIVERGENT = 'divergent'
}

// Research progress status
export enum ResearchStatus {
  LOCKED = 'locked',       // Prerequisites not met
  AVAILABLE = 'available', // Available but not started
  IN_PROGRESS = 'in_progress', // Research underway
  COMPLETED = 'completed'  // Research finished
}

// Base research node interface
export interface ResearchNode {
  id: string;
  name: string;
  description: string;
  category: ResearchCategory;
  subcategory: ResearchSubcategory;
  type: ResearchNodeType;
  prerequisites: string[];
  exclusions: string[];
  computeCost: number;
  influenceCost: Record<string, number>;
  dataCost: string[];
  effects: Record<string, any>;
  risk: {
    probability: number; // 0.0 to 1.0
    severity: number;    // 0.0 to 1.0
  };
  position: {
    x: number;
    y: number;
  };
}

// Extended research node with state information
export interface ResearchNodeState extends ResearchNode {
  status: ResearchStatus;
  progress: number; // 0.0 to 1.0
  computeAllocated: number;
  startTurn?: number;
  completionTurn?: number;
}

// Research state in the game state tree
export interface ResearchState {
  nodes: Record<string, ResearchNodeState>;
  activeResearch: string[];
  totalCompute: number;
  allocatedCompute: number;
  completedNodes: string[];
}

// Research events
export enum ResearchEventType {
  RESEARCH_STARTED = 'research_started',
  RESEARCH_PROGRESS = 'research_progress',
  RESEARCH_COMPLETED = 'research_completed',
  BREAKTHROUGH_ACHIEVED = 'breakthrough_achieved',
  RESEARCH_FAILED = 'research_failed',
  UNEXPECTED_DISCOVERY = 'unexpected_discovery'
}

// Research event data
export interface ResearchEvent {
  type: ResearchEventType;
  nodeId: string;
  turn: number;
  data?: any;
}

// Research-related actions
export enum ResearchActionType {
  START_RESEARCH = 'START_RESEARCH',
  ALLOCATE_COMPUTE = 'ALLOCATE_COMPUTE',
  CANCEL_RESEARCH = 'CANCEL_RESEARCH',
  SET_RESEARCH_PRIORITY = 'SET_RESEARCH_PRIORITY',
  COMPLETE_RESEARCH = 'COMPLETE_RESEARCH' // For admin/debug
}

// Action payloads
export interface StartResearchAction {
  type: ResearchActionType.START_RESEARCH;
  payload: {
    nodeId: string;
    allocatedCompute: number;
  };
}

export interface AllocateComputeAction {
  type: ResearchActionType.ALLOCATE_COMPUTE;
  payload: {
    nodeId: string;
    amount: number;
  };
}

export interface CancelResearchAction {
  type: ResearchActionType.CANCEL_RESEARCH;
  payload: {
    nodeId: string;
  };
}

export interface SetResearchPriorityAction {
  type: ResearchActionType.SET_RESEARCH_PRIORITY;
  payload: {
    nodeId: string;
    priority: number; // 0.0 to 1.0
  };
}

export interface CompleteResearchAction {
  type: ResearchActionType.COMPLETE_RESEARCH;
  payload: {
    nodeId: string;
  };
}

// Union type for all research actions
export type ResearchAction = 
  | StartResearchAction
  | AllocateComputeAction
  | CancelResearchAction
  | SetResearchPriorityAction
  | CompleteResearchAction;