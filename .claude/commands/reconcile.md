Initiate document reconciliation process using essence-hierarchy approach. The core vision must flow through all documents while allowing for practical evolution.

## Document Hierarchy (Essence → Implementation)
1. **CONCEPT.md** - Immutable core vision (AI development game, competitive landscape, inflection points)
2. **PHILOSOPHY.md** - Design principles (tensions, continuous systems, feedback loops)
3. **PLAN.md** - Game mechanics translation of concept+philosophy
4. **ARCHITECTURE.md** - Technical implementation of the plan
5. **ROADMAP.md** - Current development priorities
6. **CLAUDE.md** - Working instructions and patterns
7. **CREATIVE_IDEAS.md** - Future possibilities (doesn't constrain others)

## Reconciliation Process

### Step 1: Identify Documents to Compare
```bash
STATIC=$(ls -t *.md | grep -E "CONCEPT|PHILOSOPHY" | tail -1)
DYNAMIC=$(ls -t *.md | grep -E "ROADMAP|CLAUDE" | head -1)
```

### Step 2: Extract Essence Violations
Check if dynamic documents still embody the essence of static ones:
- Does ROADMAP still aim toward the core vision from CONCEPT?
- Do current features embrace PHILOSOPHY's continuous systems?
- Does ARCHITECTURE support PLAN's mechanics?

### Step 3: Cascade Updates
When misalignment found, updates flow DOWN the hierarchy:
- If ROADMAP drifts from CONCEPT → adjust ROADMAP priorities
- If implementation violates PHILOSOPHY → update ARCHITECTURE patterns
- If PLAN proves impractical → propose PLAN adjustments (rare)
- If CONCEPT/PHILOSOPHY need change → require explicit approval (very rare)

### Step 4: Document Reconciliation
```yaml
last_reconciled: $(date '+%Y-%m-%d %H:%M:%S')
essence_check: CONCEPT→PHILOSOPHY→PLAN→ROADMAP
violations_found: [list specific items]
actions_taken: [updates made]
```

### Step 5: Trigger Implementation
Based on reconciliation findings:
- Create new ROADMAP items
- Update CLAUDE.md instructions
- Refactor code to match ARCHITECTURE
- Generate issues for major pivots

## Example Flow
"CONCEPT says AI takeover is major inflection, but ROADMAP has no tasks for this → Add inflection mechanics to ROADMAP Phase 3"

Focus area (if provided): "$ARGUMENTS"