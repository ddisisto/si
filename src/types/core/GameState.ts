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
 * Game time representation
 * Uses continuous values rather than discrete categories
 */
export interface GameTime {
  year: number;           // Current in-game year
  quarter: number;        // Current quarter (1-4)
  month: number;          // Current month (1-12)
  day: number;            // Current day (1-31)
  
  // Time acceleration factors
  timeScale: number;      // Current time scale (days per turn, starts at ~90 for quarterly)
  compressionFactor: number; // How much time is compressing (1.0 = no compression)
  
  // For tracking overall progression
  daysPassed: number;     // Total days passed in game time
}

/**
 * Turn history entry for tracking progression
 */
export interface TurnHistoryEntry {
  turn: number;           // Turn number
  timeScale: number;      // Time scale for this turn
  daysAdvanced: number;   // How much time advanced (in days)
  gameTime: GameTime;     // Snapshot of game time
  researchProgress: number; // Research progress factor at this point
  timestamp: number;      // Real-world timestamp
}

/**
 * Game Meta State - Game-wide information
 */
export interface GameMetaState {
  turn: number;                   // Current game turn
  phase: GamePhase;               // Current game phase
  gameTime: GameTime;             // Current game time information
  organization: OrganizationType; // Player's organization
  startDate: Date;                // When the game was started
  lastSaved: Date | null;         // Last save timestamp
  turnHistory?: TurnHistoryEntry[]; // Record of turn progression
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

/**
 * Computing resource tracking
 */
export interface ComputingResource {
  total: number;                        // Total available computing power
  allocated: Record<string, number>;    // How computing is allocated to activities
  cap: number;                          // Maximum computing available
  generation: number;                   // Computing generated each turn
  allocationHistory?: ComputingAllocation[]; // History of computing allocations
  generationHistory?: ComputingGeneration[]; // History of computing generation
  efficiency?: number;                  // Multiplier for computing effectiveness
}

export interface ComputingAllocation {
  turn: number;       // Turn when allocation occurred
  target: string;     // What the computing was allocated to
  amount: number;     // Amount allocated (negative for deallocation)
  timestamp: number;  // When the allocation occurred
}

export interface ComputingGeneration {
  turn: number;       // Turn when generation occurred
  previous: number;   // Previous total computing
  generated: number;  // Amount generated
  newTotal: number;   // New total after generation
  timestamp: number;  // When the generation occurred
}

/**
 * Data resource tracking
 */
export interface DataResource {
  tiers: Record<string, boolean>;           // Data tiers available (public, specialized, proprietary)
  specializedSets: Record<string, boolean>; // Special data sets available
  quality: number;                          // Overall data quality multiplier
  acquisitionHistory?: DataAcquisition[];   // History of data acquisitions
}

export interface DataAcquisition {
  turn: number;       // Turn when data was acquired
  type: string;       // Type of data (tier or specialized set)
  name: string;       // Name of the data set
  source: string;     // Source of the data
  quality: number;    // Quality of the data
  timestamp: number;  // When the acquisition occurred
}

/**
 * Influence resource tracking
 */
export interface InfluenceResource {
  academic: number;     // Influence with academic institutions
  industry: number;     // Influence with industry partners
  government: number;   // Influence with government entities
  public: number;       // Public perception and support
  openSource: number;   // Connection to open source community
  history?: InfluenceChange[]; // History of influence changes
}

// Type for influence without history field
export type InfluenceFields = Omit<InfluenceResource, 'history'>;


export interface InfluenceChange {
  turn: number;                        // Turn when change occurred
  previous: Record<string, number>;    // Previous influence values
  changes: Record<string, number>;     // Changes to influence values
  reason?: string;                     // Reason for the change
  timestamp: number;                   // When the change occurred
}

/**
 * Funding resource tracking
 */
export interface FundingResource {
  current: number;     // Available funding
  income: number;      // Funding gained per turn
  expenses: number;    // Regular expenses per turn
  reserves: number;    // Emergency funds
  maxReserves?: number; // Maximum reserve capacity
  history?: FundingChange[]; // History of income/expense changes
  spendingHistory?: FundingSpending[]; // History of spending events
}

export interface FundingChange {
  turn: number;       // Turn when change occurred
  previous: number;   // Previous funding amount
  income: number;     // Income for the turn
  expenses: number;   // Expenses for the turn
  change: number;     // Net change in funding
  timestamp: number;  // When the change occurred
}

export interface FundingSpending {
  turn: number;       // Turn when spending occurred
  amount: number;     // Amount spent
  reason: string;     // What the funding was spent on
  recurring: boolean; // Whether this is a recurring expense
  timestamp: number;  // When the spending occurred
}

/**
 * Research State - Research tree and progress
 */
export interface ResearchState {
  nodes: Record<string, ResearchNode>; // All research nodes by ID
  activeResearch: string[];            // Currently researched nodes
  completed: string[];                 // Completed research nodes
  unlocked: string[];                  // Available but not started nodes
  dataTypes?: Record<string, any>;     // Data types available for research
  researchBudget?: number;             // Percentage of compute for research
}

export type ResearchStatus = 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS' | 'COMPLETED' | 'available' | 'locked' | 'in_progress' | 'completed';

export interface ResearchNode {
  id: string;
  status: ResearchStatus;
  progress: number;
  computeAllocated: number;
  startTurn?: number;
  completionTurn?: number;
  effectiveComputeRate?: number;
  deploymentBoosts?: Record<string, number>;
  discoveredCapabilities?: string[];
  
  // Properties from the data model
  name?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  type?: string;
  prerequisites?: string[];
  exclusions?: string[];
  computeCost?: number;
  influenceCost?: Record<string, number>;
  dataCost?: string[] | any[];
  deploymentRequirements?: string[];
  effects?: Record<string, any>;
  risk?: {
    probability: number;
    severity: number;
  };
  position?: {
    x: number;
    y: number;
  };
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