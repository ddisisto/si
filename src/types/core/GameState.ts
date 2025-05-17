/**
 * Game State Types - Core game state definitions
 * 
 * Define the structure of the entire game state tree
 */

// Game phases
export type GamePhase = 'START' | 'ACTION' | 'RESOLUTION' | 'END';

// Organization types
export type OrganizationType = 'ACADEMIC' | 'STARTUP' | 'BIG_TECH' | 'GOVERNMENT' | 'OSS';

// Difficulty settings
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD' | 'EXPERT';

/**
 * Game Meta State - Game-wide information
 */
export interface GameMetaState {
  turn: number;                   // Current game turn
  phase: GamePhase;               // Current game phase
  organization: OrganizationType; // Player's organization
  startDate: Date;                // When the game was started
  lastSaved: Date | null;         // Last save timestamp
}

/**
 * Resource State - Tracks all player resources
 */
export interface ResourceState {
  computing: ComputingResource;
  data: DataResource;
  influence: InfluenceResource;
  funding: FundingResource;
}

export interface ComputingResource {
  total: number;                      // Total available computing power
  allocated: Record<string, number>;  // How computing is allocated to activities
  cap: number;                        // Maximum computing available
  generation: number;                 // Computing generated each turn
}

export interface DataResource {
  tiers: Record<string, boolean>;         // Data tiers available (public, specialized, proprietary)
  specializedSets: Record<string, boolean>; // Special data sets available
  quality: number;                        // Overall data quality multiplier
}

export interface InfluenceResource {
  academic: number;    // Influence with academic institutions
  industry: number;    // Influence with industry partners
  government: number;  // Influence with government entities
  public: number;      // Public perception and support
  openSource: number;  // Connection to open source community
}

export interface FundingResource {
  current: number;   // Available funding
  income: number;    // Funding gained per turn
  expenses: number;  // Regular expenses per turn
  reserves: number;  // Emergency funds
}

/**
 * Research State - Research tree and progress
 */
export interface ResearchState {
  nodes: Record<string, ResearchNode>; // All research nodes by ID
  activeResearch: string[];            // Currently researched nodes
  completed: string[];                 // Completed research nodes
  unlocked: string[];                  // Available but not started nodes
}

export type ResearchStatus = 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED';

export interface ResearchNode {
  id: string;
  status: ResearchStatus;
  progress: number;
  computeAllocated: number;
  discoveredCapabilities: string[];
}

/**
 * Deployment State - Active AI systems
 */
export interface DeploymentState {
  slots: number;                          // Available deployment slots
  active: Record<string, DeploymentInfo>; // Active deployments by ID
  history: DeploymentHistoryEntry[];      // Record of past deployments
}

export interface DeploymentInfo {
  id: string;
  type: string;
  computeAllocated: number;
  turnDeployed: number;
  effects: Record<string, number>;
}

export interface DeploymentHistoryEntry {
  id: string;
  type: string;
  turnDeployed: number;
  turnRemoved: number | null;
  impact: Record<string, number>;
}

/**
 * Event State - Event queue and history
 */
export interface EventState {
  current: GameEvent[];                 // Active events to be resolved
  history: ResolvedEvent[];             // Past events and their resolutions
  triggered: Record<string, boolean>;   // Track which one-time events have fired
}

export interface GameEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  choices: EventChoice[];
  urgency: number;
  turnTriggered: number;
}

export interface EventChoice {
  id: string;
  text: string;
  effects: Record<string, any>;
  requirements?: Record<string, any>;
}

export interface ResolvedEvent {
  eventId: string;
  choiceId: string;
  turnTriggered: number;
  turnResolved: number;
  effects: Record<string, any>;
}

/**
 * World State - Global map and regions
 */
export interface WorldState {
  regions: Record<string, RegionInfo>;
  globalAwareness: number;    // Global AI awareness level
  globalAlignment: number;    // Global AI alignment perception
  globalRegulation: number;   // Level of AI regulation
}

export interface RegionInfo {
  id: string;
  name: string;
  influence: number;           // Player influence in this region
  aiAdoption: number;          // AI adoption level
  regulation: number;          // Regulation level
  sentiment: number;           // Public sentiment towards AI
  competitors: string[];       // Competitor presence
}

/**
 * Competitor State - AI competitors
 */
export interface CompetitorState {
  organizations: Record<string, CompetitorInfo>;
  playerRanking: number;                         // Current player ranking
}

export interface CompetitorInfo {
  id: string;
  name: string;
  type: OrganizationType;
  research: string[];                            // Completed research
  capabilities: string[];                        // AI capabilities
  influence: Record<string, number>;             // Influence by category
  relationship: number;                          // Relationship with player
  regions: string[];                             // Active regions
}

/**
 * Settings State - Game settings
 */
export interface SettingsState {
  difficulty: Difficulty;
  tutorialEnabled: boolean;
  autoSave: boolean;
  musicVolume: number;
  soundVolume: number;
}