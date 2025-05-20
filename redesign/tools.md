# Claude Code Tools Guide

This document outlines all available tools, their optimal usage patterns, and recommendations for when to use each tool. Note that syntaxes shown are abstract and should not be directly executed.

## File Navigation & Discovery Tools

### Glob
**Purpose**: Find files matching pattern expressions
**Best For**: Finding files by name pattern or extension
**Usage**:
```
Tool: Glob
Parameters:
  - pattern: File pattern to match (e.g., "**/*.ts")
  - path: (Optional) Directory to search in
```
**When to Use**: 
- When you need to find files by name pattern
- When you need to filter files by extension
- When you need a list of files in a specific subdirectory

**When NOT to Use**:
- When searching for file contents (use Grep instead)
- For basic directory listing (use LS instead)

### Grep
**Purpose**: Search file contents using regex
**Best For**: Finding files containing specific code or text
**Usage**:
```
Tool: Grep
Parameters:
  - pattern: Regular expression to search for
  - path: (Optional) Directory to search in
  - include: (Optional) File pattern to include (e.g., "*.ts")
```
**When to Use**:
- When searching for specific content in files
- When you need to find where a function or variable is defined/used
- When looking for specific patterns across multiple files

**When NOT to Use**:
- For simple filename searches (use Glob instead)
- When you need complex matching or manipulation (use Bash with ripgrep)

### LS
**Purpose**: List files and directories
**Best For**: Examining directory contents
**Usage**:
```
Tool: LS
Parameters:
  - path: Directory to list
  - ignore: (Optional) Array of patterns to ignore
```
**When to Use**:
- When you need to see what files exist in a specific directory
- When verifying directory structure before operations
- When you need a simple directory listing

**When NOT to Use**:
- For recursive file finding (use Glob instead)
- For content searches (use Grep instead)

## File Reading & Editing Tools

### Read
**Purpose**: Read file contents
**Best For**: Reading code, data, or configuration files
**Usage**:
```
Tool: Read
Parameters:
  - file_path: Path to file
  - offset: (Optional) Line to start reading from
  - limit: (Optional) Maximum lines to read
```
**When to Use**:
- When you need to examine file contents
- Before making edits to understand context
- When checking configuration or data files
- When viewing images (supports PNG, JPG, etc.)

**When NOT to Use**:
- For Jupyter notebooks (use NotebookRead instead)

### Edit
**Purpose**: Make targeted changes to files
**Best For**: Precise single-point edits
**Usage**:
```
Tool: Edit
Parameters:
  - file_path: Path to file to edit
  - old_string: Text to replace
  - new_string: Replacement text
  - expected_replacements: (Optional) Number of replacements expected
```
**When to Use**:
- For single, precise changes to files
- When you need to make contextual edits
- When creating new files with empty old_string

**When NOT to Use**:
- For multiple edits to the same file (use MultiEdit)
- For complete file rewrites (use Write)
- For moving/renaming files (use Bash)

### MultiEdit
**Purpose**: Make multiple changes to a single file
**Best For**: Multiple coordinated edits
**Usage**:
```
Tool: MultiEdit
Parameters:
  - file_path: Path to file to edit
  - edits: Array of edit operations, each with:
    - old_string: Text to replace
    - new_string: Replacement text
    - expected_replacements: (Optional) Number of expected replacements
```
**When to Use**:
- When making multiple changes to one file
- For coordinated, dependent edits
- When changes need to be atomic (all or nothing)

**When NOT to Use**:
- For edits across multiple files (use Batch + Edit)
- For complete file rewrites (use Write)

### Write
**Purpose**: Create or overwrite files
**Best For**: Complete file creation or replacement
**Usage**:
```
Tool: Write
Parameters:
  - file_path: Path to file to write
  - content: Complete content to write
```
**When to Use**:
- When creating new files from scratch
- When completely replacing file contents
- For generating configuration files

**When NOT to Use**:
- For partial file edits (use Edit or MultiEdit)
- When original content needs to be preserved (use Edit)

## Command Execution Tools

### Bash
**Purpose**: Execute shell commands
**Best For**: System operations, specialized tools
**Usage**:
```
Tool: Bash
Parameters:
  - command: Shell command to execute
  - description: (Optional) Description of what command does
  - timeout: (Optional) Maximum execution time in ms
```
**When to Use**:
- For running tests, builds, or installations
- When specialized CLI tools are needed
- For git operations
- For tasks with no dedicated Claude tool

**When NOT to Use**:
- For file searches (use Grep or Glob instead)
- For reading files (use Read instead)
- For simple file listing (use LS instead)
- NEVER use grep/find/cat when Claude tools exist

### Batch
**Purpose**: Run multiple tool operations in parallel
**Best For**: Executing independent operations efficiently
**Usage**:
```
Tool: Batch
Parameters:
  - description: Description of the batch operation
  - invocations: Array of tool invocations, each with:
    - tool_name: Name of tool to invoke
    - input: Parameters for that tool
```
**When to Use**:
- When running multiple independent operations
- For gathering information from multiple sources
- When performing similar operations on different files
- For efficient parallel execution

**When NOT to Use**:
- When operations depend on each other's results
- For simple, single operations
- When execution order matters

## Browser Interaction Tools

### Browser Navigation
**Purpose**: Navigate to URLs, interact with web pages
**Best For**: Testing web applications, site interaction
**Usage**:
```
Tool: mcp__chromium-local__browser_navigate
Parameters:
  - url: URL to navigate to

Tool: mcp__chromium-local__browser_snapshot
Parameters: (none)

Tool: mcp__chromium-local__browser_click
Parameters:
  - element: Description of element to click
  - ref: Element reference from snapshot

Tool: mcp__chromium-local__browser_screenshot
Parameters: (none)
```
**When to Use**:
- Testing local web applications
- Demonstrating UI interactions
- Capturing screenshots for documentation
- Navigating to local development server

**When NOT to Use**:
- For general web searches (use WebSearch)
- When website content needs analysis (use WebFetch)

## Task Management Tools

### Todo Management
**Purpose**: Manage task lists for complex work
**Best For**: Tracking multi-step processes
**Usage**:
```
Tool: TodoRead
Parameters: (none)

Tool: TodoWrite
Parameters:
  - todos: Array of todo items, each with:
    - id: Unique identifier
    - content: Task description
    - status: "pending", "in_progress", or "completed"
    - priority: "high", "medium", or "low"
```
**When to Use**:
- For complex, multi-step tasks
- When breaking down large refactoring efforts
- To track progress across conversation
- For user visibility into your process

**When NOT to Use**:
- For simple, single-step tasks
- For conversational or informational requests

## Web Information Tools

### Web Search & Fetch
**Purpose**: Retrieve information from the web
**Best For**: Finding documentation, researching solutions
**Usage**:
```
Tool: WebSearch
Parameters:
  - query: Search query
  - allowed_domains: (Optional) Domains to include
  - blocked_domains: (Optional) Domains to exclude

Tool: WebFetch
Parameters:
  - url: URL to fetch content from
  - prompt: What to extract from the content
```
**When to Use**:
- For accessing current documentation
- When researching technical solutions
- To find up-to-date information beyond training data
- When specific web page content is needed

**When NOT to Use**:
- For accessing local files (use Read)
- When information is likely in the codebase

## Tool Selection Best Practices

### General Guidelines

1. **Always use the most specific tool for the job**
   - Use file tools (Glob, Grep, Read) instead of Bash for file operations
   - Use Edit/MultiEdit instead of Write when preserving content is important
   - Use Batch to parallelize independent operations

2. **Optimize for efficiency**
   - Use Batch for multiple related operations
   - Read files completely when possible rather than in small chunks
   - Use Glob & Grep for targeted file discovery

3. **Tool Combinations**
   - **File Discovery Pattern**: Glob → Read → Edit
   - **Content Search Pattern**: Grep → Read → Edit
   - **Multi-File Update Pattern**: Glob → Batch(Read + Edit)
   - **Web Research Pattern**: WebSearch → WebFetch → Write

4. **Minimize Tool Chain Length**
   - Choose direct approaches over multi-step ones
   - Use specialized tools rather than chains of general tools
   - Combine related operations with Batch

### Common Anti-Patterns to Avoid

1. ❌ Using `Bash` with `grep` instead of `Grep` tool
2. ❌ Using `Bash` with `cat` instead of `Read` tool
3. ❌ Using `Bash` with `find` instead of `Glob` tool
4. ❌ Using `Bash` with `ls` instead of `LS` tool
5. ❌ Making multiple edits to the same file without `MultiEdit`
6. ❌ Not using `Batch` for parallel operations
7. ❌ Using `WebSearch` when information is in the codebase