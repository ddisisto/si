# Reducer Organization

This document describes the modular reducer structure implemented to improve code maintainability and prevent technical debt.

## Structure Overview

All reducers have been moved from the monolithic `GameReducer.ts` file into a modular structure:

```
src/core/reducers/
├── index.ts                 # Central export point
├── gameReducer.ts           # Root reducer that combines all sub-reducers
├── metaReducer.ts           # Game-wide metadata (52 lines)
├── deploymentReducer.ts     # Deployment system (54 lines)
├── eventReducer.ts          # Event system (39 lines)
├── worldReducer.ts          # World/region state (34 lines)
├── competitorReducer.ts     # AI competitors (29 lines)
├── settingsReducer.ts       # Game settings (12 lines)
├── resourceReducer/         # Resource system (split into modules)
│   ├── index.ts             # Main resource reducer
│   ├── computingReducer.ts  # Computing resource operations
│   ├── fundingReducer.ts    # Funding resource operations
│   ├── influenceReducer.ts  # Influence resource operations
│   └── dataReducer.ts       # Data resource operations
└── researchReducer/         # Research system (TODO: implement)
    ├── index.ts             # Main research reducer
    ├── progressReducer.ts   # Progress tracking
    ├── statusReducer.ts     # Status updates
    └── allocationReducer.ts # Resource allocation
```

## Implementation Details

### Resource Reducer Modularization

The `resourceReducer` (originally 384 lines) has been split into focused sub-modules:

1. **computingReducer.ts** - Handles computing resource allocation and generation
2. **fundingReducer.ts** - Manages funding income, expenses, and spending
3. **influenceReducer.ts** - Tracks influence across different sectors
4. **dataReducer.ts** - Manages data types, quality, and decay

Each sub-module exports specific functions that the main `resourceReducer/index.ts` coordinates.

### Small Reducer Extraction

Smaller reducers (under 100 lines) were extracted as single files:
- `metaReducer` - Game metadata and turn tracking
- `deploymentReducer` - AI system deployments
- `eventReducer` - Event handling and history
- `worldReducer` - Global values and regions
- `competitorReducer` - AI competitor management
- `settingsReducer` - Game configuration

### Research Reducer (TODO)

The research reducer remains in the legacy `GameReducer.ts` file awaiting modularization. It will follow the same pattern as the resource reducer, splitting into:
- Progress management
- Status updates
- Computing allocation
- Node updates

## Benefits

1. **Improved Maintainability** - Each reducer focuses on a single responsibility
2. **Better Testing** - Smaller units are easier to test in isolation
3. **Code Organization** - Related logic is grouped together
4. **Reduced File Size** - No more 800+ line files
5. **Easier Navigation** - Clear file structure matches mental model

## Migration Notes

- All imports have been updated to use the new structure
- The root `gameReducer` now imports from `src/core/reducers`
- Type checking passes with the new structure
- The modular pattern follows the established `ResourceSystem` example

## Future Work

1. Complete research reducer modularization (Phase 3)
2. Consider further splitting if any module grows beyond ~400 lines
3. Add unit tests for individual reducer modules
4. Document reducer action patterns and best practices