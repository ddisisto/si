First run local type-check to make sure everything compiles. Then use the local browser tools to load the game ui page, check the console logs first, try to address any errors found within, or report "UI is alive!" if none. Focus (if none given, ask user if there's any UI interaction specifically to be tested): $ARGUMENTS

When working with browser tools:
- Always check console logs BEFORE taking screenshots or interacting with the UI
- If console logs are excessive (>100 lines) or mostly irrelevant, reload the page with browser_navigate to get a clean log state - this provides better context efficiency than maintaining large logs or taking screenshots
