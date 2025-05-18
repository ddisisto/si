Initiate intelligent project reconciliation - the universal entry point for understanding what needs attention across the entire project.

## Core Philosophy
Reconciliation is state-aware: it reads the project's current position and suggests the most relevant next actions. This isn't just document alignment but comprehensive project state assessment.

## Document Hierarchy (Essence → Implementation)
1. **CONCEPT.md** - Immutable core vision (AI development game, competitive landscape, inflection points)
2. **PHILOSOPHY.md** - Design principles (tensions, continuous systems, feedback loops)
3. **PLAN.md** - Game mechanics translation of concept+philosophy
4. **ARCHITECTURE.md** - Technical implementation of the plan
5. **ROADMAP.md** - Current development priorities
6. **README.md** - Bridge document: public face + developer onboarding
7. **CLAUDE.md** - Working instructions and patterns
8. **CREATIVE_IDEAS.md** - Future possibilities (doesn't constrain others)

## Change-Driven Reconciliation Process

### Step 1: Identify What Changed
```bash
# Start from recent changes, not arbitrary oldest/newest
git log --oneline -10 -- "*.md" "src/**" "docs/**"
```

### Step 2: Trace Impact Upward
Starting from actual changes, work backwards through hierarchy:
- Did implementation reveal issues with ARCHITECTURE?
- Does ARCHITECTURE still align with PLAN?
- Does PLAN still embody PHILOSOPHY?
- Only elevate to CONCEPT if fundamental assumptions challenged

### Step 3: Natural Cascading
Follow document links to detailed designs/implementations:
- ARCHITECTURE → `/docs/design/*.md`
- ROADMAP → current implementation tasks
- Changes cascade through natural references, not forced traversal

### Step 4: Context-Aware Actions
Based on findings, initiate appropriate actions:
- Update downstream docs if upstream vision clarified
- Implement features if alignment confirmed
- Refactor code if architecture violated
- Create issues for significant pivots

### Step 5: README Synthesis (Final Step)
After internal reconciliation, ask: "Does our public face reflect reality?"
- Update status if significantly shifted
- Revise architecture description if evolved
- Ensure setup process still accurate
- Bridge internal state to external understanding

## Reconciliation Meanings by Context

The command adapts to current project state:
- **Post-feature**: Check if implementation aligns with design
- **Pre-planning**: Ensure new features fit core vision
- **Post-refactor**: Update docs to reflect new patterns
- **Milestone**: Deep review including foundational docs

## Example Flows

**Implementation Drift**:
"Recent commits added caching to ResourceSystem → Check if this aligns with ARCHITECTURE patterns → Update architecture if new pattern emerged → Ensure PLAN's resource mechanics still accurate"

**Feature Planning**:
"ROADMAP shows AI takeover mechanics next → Verify this matches CONCEPT's inflection point → Check PHILOSOPHY for relevant tensions → Review PLAN for mechanics guidance"

Focus area (if provided): "$ARGUMENTS"