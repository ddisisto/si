/**
 * ResearchSystem - Manages research tree and progression
 * 
 * Implements the research system design from research_tree_design.md
 */

import { BaseSystem } from '../core/System';
import GameStateManager from '../core/GameStateManager';
import EventBus from '../core/EventBus';
import { ResearchNode as GameResearchNode } from '../types/core/GameState';
import { 
  ResearchNodeState, 
  ResearchStatus,
  ResearchState as TypedResearchState
} from '../types/Research';
import researchNodes from '../data/ResearchData';
import { ResourceCost } from '../types/systems/ResourceCost';
import Logger from '../utils/Logger';

/**
 * ResearchSystem handles all research-related gameplay mechanics
 */
class ResearchSystem extends BaseSystem {
  private stateManager: GameStateManager;
  private eventBus: EventBus;
  private researchBoosts: Record<string, number> = {}; // Category -> boost percentage
  
  constructor(stateManager: GameStateManager, eventBus: EventBus) {
    super('ResearchSystem');
    this.stateManager = stateManager;
    this.eventBus = eventBus;
  }
  
  public initialize(): void {
    // Subscribe to relevant events
    this.eventBus.subscribe('turn:start', this.onTurnStart.bind(this));
    this.eventBus.subscribe('turn:ending', this.onTurnEnding.bind(this));
    this.eventBus.subscribe('action:start_research', this.handleStartResearch.bind(this));
    this.eventBus.subscribe('action:cancel_research', this.handleCancelResearch.bind(this));
    this.eventBus.subscribe('action:allocate_research_compute', this.handleAllocateCompute.bind(this));
    this.eventBus.subscribe('deployment:active', this.updateResearchBoosts.bind(this));
    this.eventBus.subscribe('stateLoaded', this.initializeResearchState.bind(this));
    
    // Initialize research state with data from ResearchData
    this.initializeResearchState();
    
    Logger.info('Research System initialized');
    this.setInitialized();
  }
  
  public update(_deltaTime: number): void {
    // Most research logic is event-driven
    // We could add visualizations or animations here later
  }
  
  /**
   * Initialize research state by integrating research data with game state
   */
  private initializeResearchState(): void {
    const state = this.stateManager.getState();
    const gameResearch = state.research;
    
    // Check if we need to initialize research nodes
    if (Object.keys(gameResearch.nodes).length === 0) {
      Logger.debug('ResearchSystem: Initializing research nodes from data');
      
      // Create node states from research data
      const nodeStates: Record<string, GameResearchNode> = {};
      
      researchNodes.forEach(nodeData => {
        // Create state wrapper for each node
        const nodeState: GameResearchNode = {
          id: nodeData.id,
          status: 'LOCKED',
          progress: 0,
          computeAllocated: 0,
          name: nodeData.name,
          description: nodeData.description,
          category: nodeData.category,
          subcategory: nodeData.subcategory,
          type: nodeData.type,
          prerequisites: nodeData.prerequisites,
          exclusions: nodeData.exclusions,
          computeCost: nodeData.computeCost,
          influenceCost: nodeData.influenceCost,
          dataCost: nodeData.dataCost,
          effects: nodeData.effects,
          risk: nodeData.risk,
          position: nodeData.position
        };
        
        nodeStates[nodeData.id] = nodeState;
      });
      
      // Determine which nodes are initially available (no prerequisites)
      const availableNodes = researchNodes
        .filter(node => node.prerequisites.length === 0)
        .map(node => node.id);
      
      Logger.debug('ResearchSystem: Preparing to dispatch UPDATE_RESEARCH_STATE with', Object.keys(nodeStates).length, 'nodes');
      Logger.debug('ResearchSystem: Available nodes:', availableNodes);
      
      // Update research state in game state
      this.stateManager.dispatch({
        type: 'UPDATE_RESEARCH_STATE',
        payload: {
          nodes: nodeStates,
          activeResearch: gameResearch.activeResearch || [],
          completed: gameResearch.completed || [],
          unlocked: availableNodes
        }
      });
      
      Logger.debug('ResearchSystem: UPDATE_RESEARCH_STATE dispatched');
      
      // Apply the initial statuses
      Logger.debug('ResearchSystem: Updating node statuses');
      this.updateNodeStatuses();
      
      // Check final state
      const finalState = this.stateManager.getState();
      Logger.debug('ResearchSystem: After initialization, final nodes count:', Object.keys(finalState.research.nodes).length);
      
      // Emit event for UI updates
      this.eventBus.emit('research:initialized', {
        availableNodes,
        totalNodes: researchNodes.length
      });
    } else {
      // Just update node statuses to ensure consistency in case of loaded state
      this.updateNodeStatuses();
    }
  }
  
  /**
   * Handle turn start events
   */
  private onTurnStart(data: any): void {
    // Research progress is now handled at turn end
    Logger.debug(`Research System: Turn ${data.turn} started`);
  }
  
  /**
   * Handle turn ending events
   */
  private onTurnEnding(data: any): void {
    // Progress active research nodes
    this.progressActiveResearch(data.turn);
    
    // Update research boosts for next turn
    this.updateResearchBoosts(data);
  }
  
  /**
   * Progress active research nodes for the current turn
   */
  private progressActiveResearch(turn: number): void {
    const state = this.stateManager.getState();
    const research = state.research;
    
    if (research.activeResearch.length === 0) {
      return; // No active research to process
    }
    
    // Track nodes completed this turn
    const completedThisTurn: string[] = [];
    const progressUpdates: Record<string, number> = {};
    
    // Process each active research node
    research.activeResearch.forEach(nodeId => {
      const node = research.nodes[nodeId];
      
      if (!node || node.status !== ResearchStatus.IN_PROGRESS) {
        Logger.warn(`Research node ${nodeId} marked as active but not in progress`);
        return;
      }
      
      // Calculate progress based on allocated compute and research boosts
      let progressIncrement = this.calculateResearchProgress(node);
      
      // Update progress
      const newProgress = Math.min(1.0, node.progress + progressIncrement);
      progressUpdates[nodeId] = newProgress;
      
      // Check if research is complete
      if (newProgress >= 1.0) {
        completedThisTurn.push(nodeId);
      }
      
      // Emit progress event for this node
      this.eventBus.emit('research:progress', {
        nodeId,
        previousProgress: node.progress,
        newProgress,
        increment: progressIncrement,
        computeAllocated: node.computeAllocated,
        turn
      });
    });
    
    // Dispatch action to update progress for all nodes
    if (Object.keys(progressUpdates).length > 0) {
      this.stateManager.dispatch({
        type: 'UPDATE_RESEARCH_PROGRESS',
        payload: {
          progressUpdates,
          turn
        }
      });
    }
    
    // Complete nodes that finished this turn
    completedThisTurn.forEach(nodeId => {
      this.completeResearch(nodeId, turn);
    });
  }
  
  /**
   * Calculate research progress for a node
   */
  private calculateResearchProgress(node: GameResearchNode): number {
    // Base progress is proportional to allocated compute
    const computeCost = node.computeCost || 100; // Default if not specified
    const computeAllocated = node.computeAllocated || 0; // Defensive check
    let progress = computeAllocated / computeCost;
    
    // Apply category boosts if we have a string category
    const category = node.category as string;
    if (category && this.researchBoosts[category]) {
      progress *= (1 + this.researchBoosts[category]);
    }
    
    // Apply deployment-specific boosts
    if (node.deploymentBoosts) {
      for (const [, boost] of Object.entries(node.deploymentBoosts)) {
        progress *= (1 + boost);
      }
    }
    
    // Apply computing efficiency from resources
    const state = this.stateManager.getState();
    const computingEfficiency = state.resources.computing.efficiency || 1.0;
    progress *= computingEfficiency;
    
    // Store effective compute rate for display
    const effectiveRate = node.computeAllocated * computingEfficiency;
    
    // Update effective compute rate if needed
    if (node.effectiveComputeRate !== effectiveRate) {
      this.stateManager.dispatch({
        type: 'UPDATE_RESEARCH_NODE',
        payload: {
          nodeId: node.id,
          update: {
            effectiveComputeRate: effectiveRate
          }
        }
      });
    }
    
    return progress;
  }
  
  /**
   * Complete research for a node
   */
  private completeResearch(nodeId: string, turn: number): void {
    const state = this.stateManager.getState();
    const node = state.research.nodes[nodeId];
    
    if (!node || node.status === 'COMPLETED' || node.status === 'completed') {
      Logger.warn(`Cannot complete research ${nodeId}: not found or already completed`);
      return;
    }
    
    // Dispatch action to mark research as complete
    this.stateManager.dispatch({
      type: 'COMPLETE_RESEARCH',
      payload: {
        nodeId,
        turn
      }
    });
    
    // Deallocate compute for this node
    if (node.computeAllocated > 0) {
      this.eventBus.emit('resource:deallocate', {
        resource: 'computing',
        target: `research:${nodeId}`,
        amount: node.computeAllocated
      });
    }
    
    // Update node statuses
    this.updateNodeStatuses();
    
    // Apply research effects
    this.applyResearchEffects(node);
    
    // Emit research completed event
    this.eventBus.emit('research:completed', {
      nodeId,
      node,
      turn,
      totalCompleted: state.research.completed.length + 1
    });
    
    // Check for research events
    this.checkForResearchEvents(node, turn);
  }
  
  /**
   * Apply effects from completed research
   */
  private applyResearchEffects(node: GameResearchNode): void {
    const effects = node.effects || {};
    
    if (Object.keys(effects).length === 0) return;
    
    // Handle known effect types
    
    // Resource effects
    if (effects.computeEfficiency) {
      this.eventBus.emit('resource:effect', {
        type: 'computeEfficiency',
        multiplier: effects.computeEfficiency,
        source: `research:${node.id}`
      });
    }
    
    if (effects.influenceMultiplier) {
      this.eventBus.emit('resource:effect', {
        type: 'influenceMultiplier',
        multiplier: effects.influenceMultiplier,
        source: `research:${node.id}`
      });
    }
    
    // Unlock new deployment types
    if (effects.unlockDeployments) {
      const deployments = Array.isArray(effects.unlockDeployments) 
        ? effects.unlockDeployments 
        : [effects.unlockDeployments];
      
      deployments.forEach(deploymentType => {
        this.eventBus.emit('deployment:unlock', {
          type: deploymentType,
          source: `research:${node.id}`
        });
      });
    }
    
    // Add capacity effects
    if (effects.deploymentSlots) {
      this.eventBus.emit('deployment:capacity', {
        slots: effects.deploymentSlots,
        source: `research:${node.id}`
      });
    }
    
    // Handle any other game mechanics effects
    // This will be expanded as more systems are implemented
  }
  
  /**
   * Check for research-related events
   */
  private checkForResearchEvents(node: GameResearchNode, turn: number): void {
    // Check for breakthrough events
    if (node.type === 'breakthrough') {
      this.eventBus.emit('game:event', {
        type: 'research_breakthrough',
        nodeId: node.id,
        category: node.category,
        turn
      });
    }
    
    // Check for risk-based events
    if (node.risk && node.risk.probability > 0) {
      const roll = Math.random();
      if (roll < node.risk.probability) {
        this.eventBus.emit('game:event', {
          type: 'research_risk',
          nodeId: node.id,
          severity: node.risk.severity,
          turn
        });
      }
    }
  }
  
  /**
   * Update node statuses based on prerequisites and completions
   */
  private updateNodeStatuses(): void {
    const state = this.stateManager.getState();
    const research = state.research;
    
    // Track nodes that need status updates
    const statusUpdates: Record<string, string> = {};
    
    // Process each node
    Object.values(research.nodes).forEach(node => {
      // Skip active or completed nodes
      if (node.status === 'IN_PROGRESS' || 
          node.status === 'COMPLETED' ||
          node.status === 'in_progress' || 
          node.status === 'completed') {
        return;
      }
      
      if (!node.prerequisites || !node.exclusions) {
        return; // Skip nodes that don't have prerequisites defined
      }
      
      // Check if node should be available
      const allPrereqsMet = node.prerequisites.every(prereqId => 
        research.nodes[prereqId]?.status === 'COMPLETED' || 
        research.nodes[prereqId]?.status === 'completed'
      );
      
      // Check exclusions
      const noExclusionsMet = node.exclusions.every(exId => 
        research.nodes[exId]?.status !== 'COMPLETED' && 
        research.nodes[exId]?.status !== 'completed'
      );
      
      // Update status if needed
      if (allPrereqsMet && noExclusionsMet && 
          node.status !== 'UNLOCKED' && node.status !== 'available') {
        statusUpdates[node.id] = 'UNLOCKED';
      } else if ((!allPrereqsMet || !noExclusionsMet) && 
                node.status !== 'LOCKED' && node.status !== 'locked') {
        statusUpdates[node.id] = 'LOCKED';
      }
    });
    
    // Update statuses if any changed
    if (Object.keys(statusUpdates).length > 0) {
      this.stateManager.dispatch({
        type: 'UPDATE_RESEARCH_STATUSES',
        payload: {
          statusUpdates
        }
      });
      
      // Emit event for UI updates
      this.eventBus.emit('research:statuses_updated', {
        statusUpdates
      });
    }
  }
  
  /**
   * Start researching a node
   */
  private startResearch(nodeId: string, allocatedCompute: number): boolean {
    const state = this.stateManager.getState();
    const node = state.research.nodes[nodeId];
    
    // Validate the request
    if (!node) {
      Logger.warn(`Cannot start research: Node ${nodeId} not found`);
      return false;
    }
    
    if (node.status !== 'UNLOCKED' && node.status !== 'available') {
      Logger.warn(`Cannot start research: Node ${nodeId} is not available (status: ${node.status})`);
      return false;
    }
    
    if (allocatedCompute <= 0) {
      Logger.warn(`Cannot start research: Invalid compute allocation ${allocatedCompute}`);
      return false;
    }
    
    // Request computing allocation
    this.eventBus.emit('resource:allocate', {
      resource: 'computing',
      target: `research:${nodeId}`,
      amount: allocatedCompute
    });
    
    // Since we can't easily check the result of the event emission, we'll proceed
    // and rely on the resource system to handle allocation failures
    
    // Mark research as in progress
    this.stateManager.dispatch({
      type: 'START_RESEARCH',
      payload: {
        nodeId,
        allocatedCompute,
        turn: state.meta.turn
      }
    });
    
    // Emit event for UI updates
    this.eventBus.emit('research:started', {
      nodeId,
      node,
      allocatedCompute,
      turn: state.meta.turn
    });
    
    return true;
  }
  
  /**
   * Cancel researching a node
   */
  private cancelResearch(nodeId: string): boolean {
    const state = this.stateManager.getState();
    const node = state.research.nodes[nodeId];
    
    // Validate the request
    if (!node) {
      Logger.warn(`Cannot cancel research: Node ${nodeId} not found`);
      return false;
    }
    
    if (node.status !== 'IN_PROGRESS' && node.status !== 'in_progress') {
      Logger.warn(`Cannot cancel research: Node ${nodeId} is not in progress`);
      return false;
    }
    
    // Deallocate compute resources
    if (node.computeAllocated > 0) {
      this.eventBus.emit('resource:deallocate', {
        resource: 'computing',
        target: `research:${nodeId}`,
        amount: node.computeAllocated
      });
    }
    
    // Mark research as available again
    this.stateManager.dispatch({
      type: 'CANCEL_RESEARCH',
      payload: {
        nodeId,
        turn: state.meta.turn
      }
    });
    
    // Emit event for UI updates
    this.eventBus.emit('research:cancelled', {
      nodeId,
      node,
      savedProgress: node.progress, // Progress is kept for later resuming
      turn: state.meta.turn
    });
    
    return true;
  }
  
  /**
   * Allocate more compute to a research node
   */
  private allocateCompute(nodeId: string, amount: number): boolean {
    const state = this.stateManager.getState();
    const node = state.research.nodes[nodeId];
    
    // Validate the request
    if (!node) {
      Logger.warn(`Cannot allocate compute: Node ${nodeId} not found`);
      return false;
    }
    
    if (node.status !== 'IN_PROGRESS' && node.status !== 'in_progress') {
      Logger.warn(`Cannot allocate compute: Node ${nodeId} is not in progress`);
      return false;
    }
    
    if (amount <= 0) {
      Logger.warn(`Cannot allocate compute: Invalid amount ${amount}`);
      return false;
    }
    
    // Request computing allocation
    this.eventBus.emit('resource:allocate', {
      resource: 'computing',
      target: `research:${nodeId}`,
      amount
    });
    
    // Update allocated compute
    this.stateManager.dispatch({
      type: 'ALLOCATE_RESEARCH_COMPUTE',
      payload: {
        nodeId,
        amount,
        turn: state.meta.turn
      }
    });
    
    // Emit event for UI updates
    this.eventBus.emit('research:compute_allocated', {
      nodeId,
      amount,
      newTotal: node.computeAllocated + amount,
      turn: state.meta.turn
    });
    
    return true;
  }
  
  /**
   * Handle start research events
   */
  private handleStartResearch(data: any): void {
    const { nodeId, allocatedCompute } = data;
    this.startResearch(nodeId, allocatedCompute);
  }
  
  /**
   * Handle cancel research events
   */
  private handleCancelResearch(data: any): void {
    const { nodeId } = data;
    this.cancelResearch(nodeId);
  }
  
  /**
   * Handle allocate compute events
   */
  private handleAllocateCompute(data: any): void {
    const { nodeId, amount } = data;
    this.allocateCompute(nodeId, amount);
  }
  
  /**
   * Check if research node prerequisites are met
   */
  public arePrerequisitesMet(nodeId: string): boolean {
    const state = this.stateManager.getState();
    const node = state.research.nodes[nodeId];
    
    if (!node || !node.prerequisites) return false;
    
    return node.prerequisites.every(prereqId => 
      state.research.completed.includes(prereqId)
    );
  }
  
  /**
   * Check if player can afford the research costs
   */
  public canAffordResearch(nodeId: string): boolean {
    const state = this.stateManager.getState();
    const node = state.research.nodes[nodeId];
    
    if (!node) return false;
    
    // Extract resource cost for this research
    const cost: ResourceCost = {
      computing: node.computeCost || 0,
      influence: node.influenceCost || {}
    };
    
    // If data requirements are specified, add them
    if (node.dataCost && node.dataCost.length > 0) {
      cost.data = {
        tiers: {},
        specializedSets: {}
      };
      
      // Handle data requirements
      // In the future, we'll handle DataRequirement objects with quantity/quality
      if (typeof node.dataCost[0] === 'string') {
        (node.dataCost as string[]).forEach(dataId => {
          // For now, just check if the data type is available
          if (dataId.startsWith('public_')) {
            cost.data!.tiers![dataId] = true;
          } else {
            cost.data!.specializedSets![dataId] = true;
          }
        });
      }
    }
    
    // Check if we have deployment requirements
    if (node.deploymentRequirements && node.deploymentRequirements.length > 0) {
      // Verify the required deployments are active
      const hasRequiredDeployments = node.deploymentRequirements.every(
        depId => Object.keys(state.deployments.active).includes(depId)
      );
      
      if (!hasRequiredDeployments) {
        return false;
      }
    }
    
    // For now, we'll just check using ResourceSystem logic directly
    // Later, we can integrate a callback pattern if needed
    const available = state.resources.computing.total - 
      Object.values(state.resources.computing.allocated)
        .reduce((sum, amount) => sum + amount, 0);
        
    // Check if we have enough computing
    if ((node.computeCost || 0) > available) {
      return false;
    }
    
    // Check influence
    if (node.influenceCost) {
      for (const [key, value] of Object.entries(node.influenceCost)) {
        const typedKey = key as keyof typeof state.resources.influence;
        if (typedKey !== 'history' && 
            (state.resources.influence[typedKey] as number) < value) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  /**
   * Update research boosts based on deployments
   */
  private updateResearchBoosts(_data: any): void {
    const state = this.stateManager.getState();
    
    // Reset all boosts
    this.researchBoosts = {};
    
    // Apply boosts from active deployments
    for (const [, deployment] of Object.entries(state.deployments.active)) {
      const deploymentInfo = deployment as any;
      
      if (deploymentInfo.effects) {
        // Apply category-specific boosts
        if (deploymentInfo.effects.researchBoosts) {
          for (const [category, boost] of Object.entries(deploymentInfo.effects.researchBoosts)) {
            // Initialize if not exists
            if (!this.researchBoosts[category]) {
              this.researchBoosts[category] = 0;
            }
            
            // Add boost (they're additive within a category)
            this.researchBoosts[category] += boost as number;
          }
        }
        
        // Apply specific node boosts
        if (deploymentInfo.effects.nodeBoosts) {
          for (const [nodeId, boost] of Object.entries(deploymentInfo.effects.nodeBoosts)) {
            // Update the node's deployment boosts
            const node = state.research.nodes[nodeId];
            if (node) {
              const deploymentBoosts = node.deploymentBoosts || {};
              deploymentBoosts[deploymentInfo.id] = boost as number;
              
              this.stateManager.dispatch({
                type: 'UPDATE_RESEARCH_NODE',
                payload: {
                  nodeId,
                  update: {
                    deploymentBoosts
                  }
                }
              });
            }
          }
        }
      }
    }
    
    // Emit event about updated research boosts
    this.eventBus.emit('research:boosts:updated', {
      categoryBoosts: this.researchBoosts
    });
  }
  
  /**
   * Get the current research state, converted to typed interface
   */
  public getResearchState(): TypedResearchState {
    const state = this.stateManager.getState();
    
    // Adapt the game state's research to our typed structure
    const nodes: Record<string, ResearchNodeState> = {};
    
    // Convert each node to the typed structure
    for (const [id, node] of Object.entries(state.research.nodes)) {
      // Create a compatible research node state
      const nodeState: any = {
        id: node.id,
        status: this.convertStatus(node.status),
        progress: node.progress || 0,
        computeAllocated: node.computeAllocated || 0,
        startTurn: node.startTurn,
        completionTurn: node.completionTurn,
        deploymentBoosts: node.deploymentBoosts,
        effectiveComputeRate: node.effectiveComputeRate,
        
        // Copy over data model properties
        name: node.name || "",
        description: node.description || "",
        category: node.category || "Foundations",
        subcategory: node.subcategory || "Architecture",
        type: node.type || "standard",
        prerequisites: node.prerequisites || [],
        exclusions: node.exclusions || [],
        computeCost: node.computeCost || 0,
        influenceCost: node.influenceCost || {},
        dataCost: node.dataCost || [],
        effects: node.effects || {},
        risk: node.risk || { probability: 0, severity: 0 },
        position: node.position || { x: 0, y: 0 }
      };
      
      nodes[id] = nodeState;
    }
    
    return {
      nodes,
      activeResearch: state.research.activeResearch,
      totalCompute: state.resources.computing.total,
      allocatedCompute: Object.values(state.research.nodes)
        .reduce((sum, node) => sum + (node.computeAllocated || 0), 0),
      completedNodes: state.research.completed,
      dataTypes: state.research.dataTypes || {}, 
      researchBudget: state.research.researchBudget || 0 
    };
  }
  
  /**
   * Convert legacy status format to typed enum
   */
  private convertStatus(status: string): ResearchStatus {
    if (status === 'LOCKED') return ResearchStatus.LOCKED;
    if (status === 'UNLOCKED') return ResearchStatus.AVAILABLE;
    if (status === 'IN_PROGRESS') return ResearchStatus.IN_PROGRESS;
    if (status === 'COMPLETED') return ResearchStatus.COMPLETED;
    
    // Default to locked
    return ResearchStatus.LOCKED;
  }
  
  /**
   * Calculate research metrics for UI display
   */
  public calculateResearchMetrics(): Record<string, any> {
    const state = this.stateManager.getState();
    const research = state.research;
    
    // Count nodes by status
    const statusCounts = {
      locked: 0,
      available: 0,
      inProgress: 0,
      completed: 0
    };
    
    // Count nodes by category
    const categoryCounts: Record<string, Record<string, number>> = {};
    
    Object.values(research.nodes).forEach(node => {
      // Update status counts
      if (node.status === 'LOCKED') statusCounts.locked++;
      else if (node.status === 'UNLOCKED') statusCounts.available++;
      else if (node.status === 'IN_PROGRESS') statusCounts.inProgress++;
      else if (node.status === 'COMPLETED') statusCounts.completed++;
      
      // Update category counts
      const category = (node as any).category || 'Unknown';
      if (!categoryCounts[category]) {
        categoryCounts[category] = {
          total: 0,
          completed: 0,
          inProgress: 0
        };
      }
      
      categoryCounts[category].total++;
      if (node.status === 'COMPLETED') categoryCounts[category].completed++;
      if (node.status === 'IN_PROGRESS') categoryCounts[category].inProgress++;
    });
    
    // Calculate total research progress
    const totalNodes = Object.keys(research.nodes).length;
    const completedPercentage = totalNodes > 0 
      ? Math.round((statusCounts.completed / totalNodes) * 100) 
      : 0;
      
    // Calculate completion percentage by category
    const categoryCompletion: Record<string, number> = {};
    for (const [category, counts] of Object.entries(categoryCounts)) {
      categoryCompletion[category] = counts.total > 0 
        ? Math.round((counts.completed / counts.total) * 100)
        : 0;
    }
    
    // Get active research progress
    const activeProgress: Record<string, number> = {};
    research.activeResearch.forEach(nodeId => {
      const node = research.nodes[nodeId];
      if (node && node.progress) {
        activeProgress[nodeId] = Math.round(node.progress * 100);
      }
    });
    
    // Calculate time to completion for active research
    const timeToCompletion: Record<string, number> = {};
    research.activeResearch.forEach(nodeId => {
      const node = research.nodes[nodeId];
      if (node && node.computeAllocated > 0) {
        const remainingProgress = 1 - (node.progress || 0);
        const progressPerTurn = this.calculateResearchProgress(node as ResearchNodeState);
        timeToCompletion[nodeId] = progressPerTurn > 0 
          ? Math.ceil(remainingProgress / progressPerTurn)
          : Infinity;
      }
    });
    
    return {
      statusCounts,
      categoryCounts,
      completedPercentage,
      categoryCompletion,
      activeProgress,
      timeToCompletion,
      researchBoosts: { ...this.researchBoosts },
      activeResearch: research.activeResearch,
      completedResearch: research.completed
    };
  }
}

export default ResearchSystem;