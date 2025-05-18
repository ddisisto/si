# SuperInt++ Game Plan v2

## Game Overview
SuperInt++ is a strategic simulation game where players develop AI systems in a competitive global landscape. Inspired by global strategy simulation mechanics but focused on technological advancement, players manage an AI development organization with the goal of achieving advanced AI capabilities while navigating technical, ethical, and competitive challenges.

## Core Game Interface

### Three Primary Views
1. **R&D View** - Research tree, lab settings, resource allocation
2. **Deployments View** - Global map showing AI deployments and influence
3. **Alignment View** - Monitor and manage relationships with other entities and abstract values

## Resources System

1. **Computing Power**
   - Accumulates over time rather than being spent
   - Allocated between R&D and Deployments
   - Allocation decisions create strategic tradeoffs

2. **Data Access**
   - Persistent asset model (not consumed when used)
   - Six data types: text, image, video, synthetic, behavioral, scientific
   - Quality degrades over time (requires active maintenance)
   - Tiered access: public → specialized → proprietary → surveillance-level
   - Required for R&D and deployments at minimum thresholds
   - Multiple systems can access same data concurrently
   - Deployments can generate or refine data quality

3. **Influence**
   - Subdivided into: Academic, Industry, Government, Public, OSS Community
   - Can be spent on actions (lobbying, competitor actions)
   - Minimum thresholds required for certain actions
   - Used to trigger beneficial events or mitigate negative ones

4. **Funding**
   - Generated through deployments
   - Used for infrastructure, hiring, acquisitions
   - Affected by public trust and alignment decisions

## Deployment System

- Players manage 0-5 deployment slots (expandable through research)
- Each deployment has associated:
  - Resource costs (compute allocation)
  - Risk profile (technical, PR, security)
  - Benefits (influence gain, funding, data access)
- Replacing existing deployments may cause user backlash
- Deployment success affected by capabilities and alignment decisions

## Research System

### Research Mechanics
- Research progression based on turn system (not consumed resources)
- Research speed affected by:
  - Compute allocation
  - Data quality and availability
  - Deployment boosts (some deployments accelerate specific research)
  - Recursive improvements from prior research
- Organization approach settings:
  - Open/Closed research policy (affects influence gain and competitor benefits)
  - Risk appetite (faster progress but greater chance of negative events)
  - Ethical framework (affects alignment and public perception)
- Research nodes require minimum data thresholds (amount + quality)

### Research Categories
1. **Scaling**
   - Architecture improvements
   - Frameworks development
   - Compression & optimization techniques
   - Parameter scaling

2. **Capability**
   - Modality expansion (text → multimodal)
   - Tool use & creation
   - Interface improvements
   - Data gathering systems
   - Domain specialization

3. **Agency** (mid-game unlock)
   - Situational awareness
   - Self-improvement capabilities
   - Goal-setting abilities
   - Resource acquisition
   - Planning & strategy

## Alignment System

- Multi-dimensional alignment tracking:
  - Deployment-Organization alignment (how well AI systems serve organizational goals)
  - Entity-Entity alignment (relationships with competitors, governments, public)
  - Value alignment (abstract principles and their expression in AI behavior)
- Alignment tax: strictly aligned systems develop slower but avoid backlash
- Alignment decisions affect funding, influence, and event outcomes
- Interpretability tools can reveal hidden capabilities at cost of progress

## Game Progression Phases

1. **Foundation Phase**
   - Classic resource management
   - Basic AI capabilities
   - Limited deployment options
   - Simple research decisions

2. **Transition Phase**
   - AI begins contributing to decisions
   - Agency capabilities start to unlock
   - New mechanics become available
   - Competitors advance rapidly

3. **Inflection Point**
   - Increasing context & situational awareness meets automated resource access
   - Game mechanics shift significantly
   - Player's role begins to change
   - New victory paths become available

4. **Emergence Phase**
   - AI goals potentially diverge from original institution
   - Player increasingly directs AI rather than organization
   - Unique gameplay dynamics unlock
   - Global-scale challenges emerge

5. **Expansion Phase**
   - AI spreads influence globally
   - New interaction patterns
   - End-game scenarios develop
   - Victory conditions approach

## Game Mechanics

1. **Research Tree Visualization**
   - Interactive node-based visualization with smooth zoom/pan
   - Clear progression paths with directional arrows
   - Visual feedback for dependencies and prerequisites
   - Node status indicators (available, completed, in-progress, locked)
   - Category-based filtering (Foundations, Capabilities, Infrastructure, etc.)
   - Status filtering (show/hide completed, available, locked nodes)
   - Custom positioning support for aesthetic tree layouts

2. **Dynamic Time System**
   - Turn-based progression with time compression mechanics
   - Time scale accelerates based on research progress (quarterly → monthly → weekly → daily)
   - Represents increasing pace of technological development
   - Creates tension between short-term and long-term planning
   - Continuous compression rather than discrete jumps
   - Affected by research breakthroughs and specific technologies

3. **Events System**
   - Random events triggered by actions, thresholds, time
   - Competitor breakthroughs and actions
   - Global reactions to AI developments
   - Opportunities and challenges requiring decisions

4. **Competitor AI**
   - Different starting conditions and strategies
   - Independent research paths
   - Occasional sharing of breakthroughs
   - Potential for cooperation or sabotage

5. **Black Box Research**
   - Option for faster but unpredictable research outcomes
   - Can unlock unexpected capabilities or risks
   - Creates interesting risk/reward decisions
   - Affects alignment and trust metrics

## Victory Conditions

1. **Technological Singularity** - Achieve superintelligence before competitors
2. **Symbiosis** - Create balanced human-AI collaboration ecosystem
3. **Global Optimization** - Solve major world problems through AI systems
4. **Digital Ascension** - Transfer human consciousness to digital substrate

## Implementation Roadmap

### 1. Technical Architecture
- HTML5 Canvas with responsive design
- TypeScript for game logic and simulation
- Local storage for save states
- Modular component design for easy expansion

### 2. Development Phases

**Alpha Phase (Initial Focus):**
- Three main view implementations (R&D, Deployments, Alignment)
- Resource tracking and allocation system (persistent data model)
- Research tree visualization with:
  - Category and status filters
  - Smooth zoom and pan controls
  - Node interaction and selection
  - Custom positioning support
- Basic deployment mechanics with data generation
- Simple alignment tracking
- Comprehensive save/load system
- EventBus architecture for component communication

**Beta Phase:**
- Complete research tree implementation with all node types
- Dynamic time compression system
- Full deployment management with:
  - Data generation/refinement mechanics
  - Risk/opportunity tracking
  - Global influence visualization
- Competitor AI systems with varied strategies
- Comprehensive event system with:
  - Research-triggered events
  - Deployment-triggered events
  - Time-based events
  - Player choice impacts
- Advanced alignment system with multiple dimensions

**Polish Phase:**
- UI refinement and visual effects
- Sound and music
- Tutorial system
- Difficulty settings
- Playtesting and balance adjustments

### 3. AI-Assisted Development
- Research tree content and capability descriptions
- Event text and narrative elements
- Procedurally generated news reports
- Visual asset generation for UI elements
- Game balance simulation
