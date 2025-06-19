# Git Worktree PR Workflow Guide

**Created:** June 19, 2025 at 17:30  
**Context:** Google Cloud Run deployment feature development  
**Team:** Development workflow optimization

## Overview

This guide establishes best practices for using git worktrees with Pull Request workflows, especially when working with branch protections and complex deployment features.

## Current Project Context

- **Main Repository**: `/Users/paulbonneville/Developer/arrgh-excalidraw` (main branch)
- **Deployment Worktree**: `/Users/paulbonneville/Developer/arrgh-excalidraw-deploy` (feature/google-cloud-deployment)
- **Challenge**: Branch protections prevent direct merge to main
- **Solution**: Worktree-based PR workflow

## 🔄 Complete Worktree PR Workflow

### 1. Initial Worktree Setup
```bash
# Create worktree for new feature
git worktree add -b feature/your-feature-name ../project-feature-name

# Verify worktree creation
git worktree list
```

### 2. Development Phase
```bash
# Work in worktree directory
cd ../project-feature-name

# Make your changes, commits as normal
git add .
git commit -m "Implement feature"

# Continue main development in parallel (different terminal/IDE)
cd /path/to/main/repo
# Work on other features without conflicts
```

### 3. Push and Create PR
```bash
# Push feature branch to remote
git push -u origin feature/your-feature-name

# Create PR using GitHub CLI
gh pr create \
  --title "Add [Feature Name]" \
  --body-file PR_DESCRIPTION.md \
  --base main \
  --head feature/your-feature-name

# Or create PR via GitHub web interface
```

### 4. PR Review Cycle
```bash
# Address feedback in worktree
cd ../project-feature-name
# Make requested changes
git add .
git commit -m "Address PR feedback: fix validation logic"
git push origin feature/your-feature-name
# PR automatically updates
```

### 5. Post-Merge Cleanup
```bash
# After PR is merged
git worktree remove ../project-feature-name
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name

# Update main repo
cd /path/to/main/repo
git pull origin main
```

## 🏗️ Worktree Patterns for Different Use Cases

### Pattern A: Feature-Specific Worktrees
**Use Case:** Large features that take days/weeks to develop

```bash
# Examples
git worktree add -b feature/auth-system ../arrgh-auth
git worktree add -b feature/database-migration ../arrgh-db
git worktree add -b feature/ui-redesign ../arrgh-ui
git worktree add -b feature/payment-integration ../arrgh-payments
```

**Advantages:**
- Parallel feature development
- Independent testing environments
- No context switching overhead

### Pattern B: Environment-Specific Worktrees
**Use Case:** Deployment and configuration management

```bash
# Examples
git worktree add -b deploy/staging ../arrgh-staging
git worktree add -b deploy/production ../arrgh-production
git worktree add -b config/kubernetes ../arrgh-k8s
git worktree add -b hotfix/urgent-security-patch ../arrgh-hotfix
```

**Advantages:**
- Environment isolation
- Quick deployment testing
- Emergency hotfix capabilities

### Pattern C: Review-Friendly Worktrees
**Use Case:** Code review and collaboration

```bash
# Review someone else's PR
git fetch origin
git worktree add ../review-pr-123 origin/feature/colleague-feature

# Test and review
cd ../review-pr-123
npm install && npm test
# Provide feedback

# Cleanup after review
cd ../main-repo
git worktree remove ../review-pr-123
```

**Advantages:**
- Thorough testing of PRs
- Side-by-side comparison
- Safe experimentation

## 🛡️ Branch Protection Compliance

### Required Elements for Protected Branches

1. **✅ Required Reviews**
   ```bash
   # PR workflow ensures code review
   gh pr create --reviewer @team-lead,@senior-dev
   ```

2. **✅ Status Checks**
   ```bash
   # CI/CD runs automatically on feature branch
   # Wait for all checks to pass before merge
   ```

3. **✅ Up-to-date Branches**
   ```bash
   # Easy to rebase from worktree
   cd ../project-feature-name
   git fetch origin
   git rebase origin/main
   git push --force-with-lease origin feature/your-feature-name
   ```

4. **✅ Linear History**
   ```bash
   # Squash merge for clean history
   gh pr merge --squash
   ```

## 🚀 Advanced Worktree Management

### Managing Multiple Worktrees
```bash
# List all worktrees
git worktree list

# Prune removed worktrees
git worktree prune

# Move a worktree
git worktree move ../old-location ../new-location

# Lock a worktree (prevent accidental removal)
git worktree lock ../important-feature
```

### Worktree Naming Conventions
```bash
# Feature worktrees
../[project-name]-[feature-type]
../arrgh-auth, ../arrgh-deploy, ../arrgh-ui

# Review worktrees
../review-pr-[number]
../review-pr-123, ../review-pr-456

# Environment worktrees
../[project-name]-[environment]
../arrgh-staging, ../arrgh-prod
```

## 📊 Workflow Advantages

### Development Benefits
- **🔄 Parallel Development**: Work on multiple features simultaneously
- **🧪 Isolated Testing**: Test different branches without affecting main work
- **🚀 Fast Context Switching**: No need to stash/unstash changes
- **📊 Easy Comparison**: Compare implementations side-by-side
- **🛡️ Risk Mitigation**: Experimental changes don't affect stable work

### Team Collaboration Benefits
- **👥 Better Code Reviews**: Easier to test and review PRs
- **🔒 Security**: Protected branches ensure quality gates
- **📈 Productivity**: Reduced waiting time for CI/CD
- **🧠 Mental Context**: Maintain focus on specific features
- **🔧 Flexibility**: Easy to switch priorities without losing work

## 🆘 Troubleshooting Common Issues

### Issue 1: Worktree Directory Already Exists
```bash
# Error: 'path/to/worktree' already exists
rm -rf ../existing-directory
git worktree add -b feature/new-feature ../existing-directory
```

### Issue 2: Branch Already Exists
```bash
# Error: branch 'feature-name' already exists
git branch -d feature-name  # Delete local branch
git push origin --delete feature-name  # Delete remote branch
git worktree add -b feature-name ../new-worktree
```

### Issue 3: Worktree Out of Sync
```bash
# Sync worktree with latest main
cd ../worktree-directory
git fetch origin
git rebase origin/main
```

### Issue 4: Cannot Remove Worktree
```bash
# Force remove if locked or corrupted
git worktree remove --force ../problematic-worktree
git worktree prune
```

## 📝 Quick Reference Commands

### Daily Workflow
```bash
# Create new feature worktree
git worktree add -b feature/name ../project-name

# Push and create PR
git push -u origin feature/name
gh pr create --title "Feature: Description"

# Address PR feedback
git add . && git commit -m "Address feedback"
git push origin feature/name

# Cleanup after merge
git worktree remove ../project-name
git branch -d feature/name
```

### Management Commands
```bash
# List all worktrees
git worktree list

# Clean up removed worktrees
git worktree prune

# Check worktree status
git status --porcelain --branch
```

## 🔮 Future Workflow Enhancements

### Automation Opportunities
1. **Script Worktree Creation**: Automate naming and setup
2. **PR Templates**: Standardize PR descriptions
3. **Cleanup Automation**: Auto-remove merged worktrees
4. **CI/CD Integration**: Worktree-aware build pipelines

### Team Standards
1. **Worktree Guidelines**: When to use vs regular branching
2. **Naming Conventions**: Consistent directory and branch naming
3. **Review Process**: Worktree-specific review workflows
4. **Documentation**: Keep this guide updated with team learnings

## 📚 Related Resources

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests)

---

**Last Updated:** June 19, 2025  
**Next Review:** After first month of team adoption  
**Maintained By:** Development Team