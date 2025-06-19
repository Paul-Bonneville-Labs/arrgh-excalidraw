# Secure GitHub Token Storage Guide

This guide provides multiple secure methods for storing your GitHub Personal Access Token (PAT) without risking accidental commit to the repository.

## ⚠️ Security First

**NEVER commit tokens to git repositories!** This guide shows you secure alternatives.

## Option 1: Local Secure Storage (Recommended for Development)

### Method A: GitHub CLI Keychain (Recommended)

```bash
# The safest method - GitHub CLI handles secure storage
gh auth login --with-token

# When prompted, paste your token
# GitHub CLI will store it securely in your system keychain
```

**Benefits:**
- ✅ Uses system keychain/credential manager
- ✅ Encrypted storage
- ✅ No files to manage
- ✅ Cross-platform support

### Method B: Local File with Secure Permissions

```bash
# Create secure directory
mkdir -p ~/.config/gh
chmod 700 ~/.config/gh

# Save token with restricted permissions
echo "ghp_your_token_here" > ~/.config/gh/token
chmod 600 ~/.config/gh/token

# Configure GitHub CLI
gh auth login --with-token < ~/.config/gh/token

# Verify
gh auth status
```

**Security notes:**
- File is only readable by your user (`chmod 600`)
- Stored outside the repository
- Automatically ignored by .gitignore patterns

### Method C: Environment Variable

```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export GITHUB_TOKEN="ghp_your_token_here"

# Or use it temporarily
export GITHUB_TOKEN="ghp_your_token_here"
echo $GITHUB_TOKEN | gh auth login --with-token
```

**Security notes:**
- Not persisted in repository
- Available to all processes (less secure)
- Good for temporary use

## Option 2: Google Secret Manager (Recommended for Production)

For production environments or shared access, use Google Secret Manager:

### Setup Google Secret Manager

```bash
# 1. Create the secret
gcloud secrets create github-token-claude-code \
  --data-file=- <<< "ghp_your_token_here"

# 2. Grant access to your service account (if needed)
gcloud secrets add-iam-policy-binding github-token-claude-code \
  --member="serviceAccount:github-actions@paulbonneville-com.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# 3. Verify the secret
gcloud secrets versions access latest --secret="github-token-claude-code"
```

### Using the Secret in Scripts

```bash
#!/bin/bash
# get-github-token.sh

# Retrieve token from Google Secret Manager
TOKEN=$(gcloud secrets versions access latest --secret="github-token-claude-code")

# Use with GitHub CLI
echo "$TOKEN" | gh auth login --with-token

# Verify authentication
gh auth status
```

### Integration with CI/CD

Add to your GitHub Actions workflow:

```yaml
# .github/workflows/example.yml
- name: Setup GitHub CLI from Secret Manager
  run: |
    # Get token from Secret Manager
    TOKEN=$(gcloud secrets versions access latest --secret="github-token-claude-code")
    
    # Configure GitHub CLI
    echo "$TOKEN" | gh auth login --with-token
    
    # Verify setup
    gh auth status
```

## Option 3: Hybrid Approach (Recommended)

Combine local development with cloud storage:

```bash
# Local development script
#!/bin/bash
# setup-github-auth.sh

if command -v gcloud &> /dev/null && gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "Using Google Secret Manager..."
    TOKEN=$(gcloud secrets versions access latest --secret="github-token-claude-code" 2>/dev/null)
    if [ $? -eq 0 ] && [ ! -z "$TOKEN" ]; then
        echo "$TOKEN" | gh auth login --with-token
        echo "✅ Authenticated via Secret Manager"
        exit 0
    fi
fi

echo "Falling back to local token..."
if [ -f ~/.config/gh/token ]; then
    gh auth login --with-token < ~/.config/gh/token
    echo "✅ Authenticated via local token"
elif [ ! -z "$GITHUB_TOKEN" ]; then
    echo "$GITHUB_TOKEN" | gh auth login --with-token
    echo "✅ Authenticated via environment variable"
else
    echo "❌ No token found. Please run setup:"
    echo "  1. Create PAT: https://github.com/settings/tokens"
    echo "  2. Store securely using one of the methods in docs-ai/SECURE-TOKEN-SETUP.md"
    exit 1
fi
```

## Security Best Practices

### ✅ Do's

- **Use GitHub CLI keychain storage** (most secure)
- **Store in Google Secret Manager** for production
- **Use proper file permissions** (`chmod 600`)
- **Store outside repository directory**
- **Set expiration reminders** for token renewal
- **Use minimal required scopes** only

### ❌ Don'ts

- **Never commit tokens to git**
- **Don't use world-readable files**
- **Don't share tokens via insecure channels**
- **Don't use overly broad token scopes**
- **Don't store in browser or clipboard managers**

## Token Rotation Process

### Monthly Token Rotation (Recommended)

```bash
#!/bin/bash
# rotate-github-token.sh

echo "🔄 GitHub Token Rotation Process"
echo "1. Create new PAT: https://github.com/settings/tokens"
echo "2. Required scopes: repo, project, workflow, read:org"
echo "3. Copy new token"
read -s -p "Enter new token: " NEW_TOKEN
echo

# Update Secret Manager
gcloud secrets versions add github-token-claude-code --data-file=- <<< "$NEW_TOKEN"

# Update local storage
echo "$NEW_TOKEN" > ~/.config/gh/token
chmod 600 ~/.config/gh/token

# Re-authenticate
echo "$NEW_TOKEN" | gh auth login --with-token

# Verify
gh auth status

echo "✅ Token rotation complete!"
echo "🗑️  Remember to delete old token from GitHub settings"
```

## Verification Scripts

### Check Current Setup

```bash
#!/bin/bash
# verify-github-setup.sh

echo "🔍 Verifying GitHub CLI setup..."

# Check authentication
if ! gh auth status > /dev/null 2>&1; then
    echo "❌ Not authenticated"
    exit 1
fi

echo "✅ Authenticated"

# Check scopes
echo "📋 Checking scopes..."
gh auth status 2>&1 | grep -q "repo" && echo "  ✅ repo" || echo "  ❌ repo"
gh auth status 2>&1 | grep -q "project" && echo "  ✅ project" || echo "  ❌ project"
gh auth status 2>&1 | grep -q "workflow" && echo "  ✅ workflow" || echo "  ❌ workflow"

# Test functionality
echo "🧪 Testing functionality..."
gh project list --owner pbonneville > /dev/null 2>&1 && echo "  ✅ Projects" || echo "  ❌ Projects"
gh repo view pbonneville/arrgh-excalidraw > /dev/null 2>&1 && echo "  ✅ Repository" || echo "  ❌ Repository"
gh run list --limit 1 > /dev/null 2>&1 && echo "  ✅ Workflows" || echo "  ❌ Workflows"

echo "✅ Verification complete!"
```

## Emergency Recovery

If you lose access or tokens expire:

```bash
# Quick recovery process
# 1. Create new PAT with required scopes
# 2. Use emergency authentication
gh auth login --with-token  # Paste new token when prompted

# 3. Verify access
gh auth status
gh project list --owner pbonneville

# 4. Update secure storage
echo "new_token_here" > ~/.config/gh/token
chmod 600 ~/.config/gh/token

# Or update Secret Manager
gcloud secrets versions add github-token-claude-code --data-file=- <<< "new_token_here"
```

## Quick Reference

```bash
# Setup (choose one)
gh auth login --with-token  # Keychain (recommended)
# OR
echo "token" > ~/.config/gh/token && chmod 600 ~/.config/gh/token && gh auth login --with-token < ~/.config/gh/token
# OR  
gcloud secrets create github-token-claude-code --data-file=- <<< "token"

# Verify
gh auth status

# Test
gh project list --owner pbonneville

# Emergency restore
gh auth login --with-token  # Paste new token
```

## Files Protected by .gitignore

The following patterns are automatically ignored to prevent accidental commits:

```
.github-token
.github-token.txt
github-token*
.gh-token*
*.token
credentials/
```

This ensures your tokens stay secure and never accidentally get committed to the repository.