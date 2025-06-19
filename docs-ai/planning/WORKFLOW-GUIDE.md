# Claude Code Planning Export Workflow Guide

## Overview
Automatic planning session export system that preserves all planning context for team reference and knowledge management.

## How It Works

### Global Configuration
- **Location**: `~/.claude/CLAUDE.md`
- **Permissions**: `~/.claude/settings.local.json` includes docs-ai folder creation rights
- **Auto-triggers**: When exiting plan mode in any project

### File Structure
```
project-root/
└── docs-ai/
    └── planning/
        ├── YYYY-MM-DD_HH-MM_[keywords].md
        └── YYYY-MM-DD_HH-MM_[keywords].md
```

### Naming Convention
- **Format**: `YYYY-MM-DD_HH-MM_[descriptive-keywords].md`
- **Example**: `2025-06-19_17-59_global-claude-planning-exports.md`
- **Keywords**: 2-4 words describing the planning topic

### Content Structure
Each export includes:
1. **Summary**: 1-3 bullet points of key decisions
2. **Research Findings**: Context discovered during planning
3. **Decisions Made**: Specific choices and rationale
4. **Next Steps**: Clear actionable items
5. **Test Plan**: How to validate the implementation

## Team Adoption

### For Developers
1. Planning sessions automatically export - no action needed
2. Review exported plans before implementation
3. Reference previous planning decisions in docs-ai/planning/

### For Project Leads
1. All planning context is preserved and searchable
2. Track decision history across team members
3. Use exports for sprint planning and retrospectives

## Troubleshooting

### Missing Exports
- Verify `~/.claude/CLAUDE.md` contains Planning Session Export Protocol
- Check permissions in `~/.claude/settings.local.json`

### Wrong Location
- Exports always go to `docs-ai/planning/` in project root
- If project lacks docs-ai folder, it will be created automatically

## Benefits
- ✅ No manual documentation overhead
- ✅ Consistent format across all projects
- ✅ Searchable planning history
- ✅ Team knowledge preservation
- ✅ Decision audit trail