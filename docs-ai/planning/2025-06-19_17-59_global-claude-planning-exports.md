 Claude Code Global Planning Export Configuration Plan

     Research Findings

     Based on the Claude Code configuration system investigation:
     - Global config location: ~/.claude/settings.local.json (currently only has permissions)
     - Project-level config: Each project has .claude/settings.local.json
     - Project documentation: CLAUDE.md files provide guidance to Claude Code
     - No existing global prompt system for planning export automation

     Proposed Solution: Multi-Level Configuration

     1. Create Global CLAUDE.md Template

     - Create ~/.claude/CLAUDE.md as a global prompt template
     - Include automatic planning export instructions
     - Define standard docs-ai folder structure and naming conventions

     2. Update Global Settings

     - Enhance ~/.claude/settings.local.json to include custom prompts/behaviors
     - Add docs-ai folder creation permissions globally

     3. Create Planning Export Automation Prompt

     Content to add:
     ## Planning Session Export Protocol

     When exiting plan mode, automatically:
     1. Create `docs-ai/planning/` folder if it doesn't exist
     2. Export planning session content to: `docs-ai/planning/YYYY-MM-DD_HH-MM_[descriptive-keywords].md`
     3. Use format: ISO date, time, and 2-4 keywords describing the planning topic
     4. Include complete planning context, decisions, and next steps
     5. Structure as searchable markdown with clear sections

     This ensures all planning sessions are preserved for team reference and knowledge management.

     4. Implementation Strategy

     - Test global CLAUDE.md approach first
     - If global prompts don't work, create project template that can be copied
     - Document the workflow for consistent team adoption

     This approach will ensure planning sessions are automatically documented without manual intervention.