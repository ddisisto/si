Please check the ROADMAP.md, and pick something new to work on. Focus suggestion (if any): "$ARGUMENTS". If none, look at the current branch name and recent commits.
Check for existence of relevant design documents BEFORE working on any feature. For complex features, consider using `/project:plan` to create a structured implementation plan.
If critical design pieces are not covered, work on designing and getting user approval on the design/plan before implementing.
In particular the `docs/technical_architecture.md` should be considered, and should point to relevant detail designs. Keeping this file updated is vital.
You should be on branch main when starting, create a new branch for any major work.
Use browser tools to ensure page loads (user is running `npm run dev` with auto-reload in background), check its console log for errors / details, interact and view screenshots as needed.
If any major / blocking issues are detected, flag with the user, or raise a github issue (`gh` command), and wait for resolution before proceeding.
Always look to cleanup unused code paths and make obvious improvements we find along the way.