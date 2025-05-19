Please check the ROADMAP.md, and pick something new to work on. Additional ocus suggestion (if any): "$ARGUMENTS". 
If none, pick the highest priority work from the roadmap. 
Check for existence of relevant design documents BEFORE working on any feature.
If this requires further scoping, planning, design, breaking down, then do this first (updating the ROADMAP as we go).
Detailed designs and complex plans must before reviewed by the user before beginning implementation (only if pre-existing and complete, assume approved)
In particular the `ARCHITECTURE.md` should be considered, and should point to relevant detail designs. Keeping this file updated is vital.
You should be on branch main when starting, create a new branch for any major work.
Use browser tools to ensure page loads (user is running `npm run dev` with auto-reload in background), check its console log for errors / details, interact and view screenshots as needed.
If any major / blocking issues, incomplete designs, etc are found, flag with the user and wait for resolution before proceeding.
Always look to cleanup unused code paths and suggest improvements we find along the way.