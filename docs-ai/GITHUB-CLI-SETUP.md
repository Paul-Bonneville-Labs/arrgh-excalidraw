# GitHub CLI Setup and Permissions Guide

This guide provides comprehensive instructions for setting up and maintaining GitHub CLI permissions for the arrgh-excalidraw project.

## Overview

The arrgh-excalidraw project requires GitHub CLI access for:
- ✅ Repository management (code, issues, pull requests)
- ✅ GitHub Projects v2 integration
- ✅ GitHub Actions workflow management
- ✅ Organization-level access

## Quick Setup

### Method 1: Standard GitHub CLI Authentication

```bash
# Initial setup
gh auth login

# Refresh with all required scopes
gh auth refresh -s repo -s project -s workflow -s read:org

# Verify setup
gh auth status
```

### Method 2: Personal Access Token (Recommended for Stability)

1. **Create Personal Access Token**
   - Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
   - Click "Generate new token" → "Generate new token (classic)"
   - Set expiration (recommend 90 days or 1 year)
   - Select required scopes (see below)

2. **Configure GitHub CLI**
   ```bash
   # Save token to file (secure location)
   echo "ghp_xxxxxxxxxxxxxxxxxxxx" > ~/.github-token
   chmod 600 ~/.github-token
   
   # Login with token
   gh auth login --with-token < ~/.github-token
   
   # Verify
   gh auth status
   ```

## Required Scopes Explained

| Scope | Purpose | Required For |
|-------|---------|--------------|
| `repo` | Full repository access | Reading/writing code, managing issues/PRs, repository settings |
| `project` | GitHub Projects v2 | Creating project items, managing project boards |
| `workflow` | GitHub Actions | Viewing/triggering workflows, accessing run logs |
| `read:org` | Organization access | Accessing organization-level projects and settings |

## Testing Your Setup

Run these commands to verify everything is working:

```bash
# Test basic repository access
gh repo view pbonneville/arrgh-excalidraw

# Test issue management
gh issue list

# Test project access
gh project list --owner pbonneville

# Test specific project
gh project view 1 --owner pbonneville

# Test workflow access
gh run list --limit 5
```

## Common Issues and Solutions

### Issue: "Permission denied" or "missing required scopes"

**Solution:**
```bash
# Check current scopes
gh auth status

# Refresh with missing scopes
gh auth refresh -s repo -s project -s workflow -s read:org

# For persistent issues, try re-login
gh auth logout
gh auth login
```

### Issue: "Project not found" or "invalid number"

**Solution:**
```bash
# List available projects
gh project list --owner pbonneville

# Use project number (not name) in commands
gh project view 1 --owner pbonneville  # ✅ Correct
gh project view "Project Name"          # ❌ Incorrect
```

### Issue: "Token expired" or authentication failures

**Solution:**
```bash
# For standard auth
gh auth refresh

# For PAT users - create new token and re-login
gh auth login --with-token < new-token.txt
```

## Personal Access Token Management

### Creating a PAT

1. Navigate to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Fill in:
   - **Note**: "Claude Code - arrgh-excalidraw"
   - **Expiration**: 90 days (recommended) or 1 year
   - **Scopes**: Select these checkboxes:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `read:org` (Read org and team membership, read org projects)
     - ✅ `project` (Full control of projects)

4. Click "Generate token"
5. **Important**: Copy the token immediately (you won't see it again)

### Secure Token Storage

```bash
# Create secure token file
echo "ghp_your_token_here" > ~/.config/gh/token
chmod 600 ~/.config/gh/token

# Or use system keychain/credential manager
# GitHub CLI will prompt for secure storage during login
```

### Token Renewal Process

Set a calendar reminder for token expiration and follow these steps:

```bash
# Before expiration
# 1. Create new PAT following the same process
# 2. Update stored token
echo "ghp_new_token_here" > ~/.config/gh/token

# 3. Re-authenticate
gh auth login --with-token < ~/.config/gh/token

# 4. Verify
gh auth status
```

## Automation and Scripts

### Quick Permission Check Script

```bash
#!/bin/bash
# check-gh-permissions.sh

echo "Checking GitHub CLI permissions..."

# Check auth status
if ! gh auth status > /dev/null 2>&1; then
    echo "❌ Not authenticated. Run: gh auth login"
    exit 1
fi

echo "✅ Authenticated"

# Check required scopes
echo "Checking scopes..."
gh auth status 2>&1 | grep -q "repo" && echo "✅ repo scope" || echo "❌ Missing repo scope"
gh auth status 2>&1 | grep -q "project" && echo "✅ project scope" || echo "❌ Missing project scope"
gh auth status 2>&1 | grep -q "workflow" && echo "✅ workflow scope" || echo "❌ Missing workflow scope"

# Test access
echo "Testing access..."
gh project list --owner pbonneville > /dev/null 2>&1 && echo "✅ Project access" || echo "❌ Cannot access projects"
gh repo view pbonneville/arrgh-excalidraw > /dev/null 2>&1 && echo "✅ Repository access" || echo "❌ Cannot access repository"

echo "Permission check complete!"
```

### Emergency Restoration Commands

Keep these commands handy for quick restoration:

```bash
# Full refresh with all scopes
gh auth refresh -s repo -s project -s workflow -s read:org

# Verify everything works
gh auth status && gh project list --owner pbonneville && gh issue list --limit 1
```

## Integration with Claude Code

When working with Claude Code, these permissions enable:

- **Issue Management**: Creating, updating, and linking issues to projects
- **Project Management**: Adding items to GitHub Projects, updating status
- **Workflow Management**: Viewing CI/CD status, triggering deployments
- **Repository Operations**: Reading code, creating branches, managing PRs

## Security Best Practices

1. **Use PATs for long-term stability** (90+ day expiration)
2. **Store tokens securely** (use system keychain/credential manager)
3. **Regular token rotation** (set calendar reminders)
4. **Principle of least privilege** (only required scopes)
5. **Monitor token usage** (GitHub settings show last used dates)

## Support and Troubleshooting

If you encounter issues:

1. **Check this guide first** for common solutions
2. **Run permission check script** to diagnose issues
3. **Review GitHub CLI documentation**: https://cli.github.com/
4. **Check GitHub status**: https://githubstatus.com/

## Quick Reference Commands

```bash
# Setup
gh auth login
gh auth refresh -s repo -s project -s workflow -s read:org

# Verification
gh auth status
gh project list --owner pbonneville

# Emergency restore
gh auth refresh -s repo -s project -s workflow -s read:org

# Project management
gh issue create --title "Title" --body "Description"
gh project item-add 1 --owner pbonneville --url [issue-url]

# Workflow management
gh run list
gh run view [run-id]
```