#!/bin/bash
# GitHub Authentication Setup Script
# This script helps you set up secure GitHub CLI authentication

set -e

echo "🔐 GitHub CLI Authentication Setup"
echo "=================================="
echo

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Please install it first:"
    echo "   brew install gh"
    echo "   Or visit: https://cli.github.com/"
    exit 1
fi

echo "✅ GitHub CLI found"

# Check if already authenticated
if gh auth status > /dev/null 2>&1; then
    echo "ℹ️  Already authenticated with GitHub CLI"
    gh auth status
    echo
    read -p "Do you want to re-authenticate? [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Exiting. Current authentication preserved."
        exit 0
    fi
fi

echo
echo "Choose your authentication method:"
echo "1. 🔐 GitHub CLI Keychain (Recommended - most secure)"
echo "2. 📁 Local file storage"
echo "3. ☁️  Google Secret Manager"
echo "4. 🔄 Hybrid (Secret Manager + local fallback)"
echo

read -p "Select option [1-4]: " -n 1 -r
echo
echo

case $REPLY in
    1)
        echo "🔐 Setting up GitHub CLI Keychain authentication..."
        echo
        echo "You'll be prompted to paste your Personal Access Token."
        echo "Required scopes: repo, project, workflow, read:org"
        echo
        echo "Create your PAT here: https://github.com/settings/tokens"
        echo "Press Enter when ready..."
        read
        
        gh auth login --with-token
        ;;
        
    2)
        echo "📁 Setting up local file storage..."
        echo
        
        # Create secure directory
        mkdir -p ~/.config/gh
        chmod 700 ~/.config/gh
        
        echo "Enter your GitHub Personal Access Token:"
        echo "Required scopes: repo, project, workflow, read:org"
        echo "Create here: https://github.com/settings/tokens"
        echo
        read -s -p "Token: " TOKEN
        echo
        
        # Save with secure permissions
        echo "$TOKEN" > ~/.config/gh/token
        chmod 600 ~/.config/gh/token
        
        # Authenticate
        gh auth login --with-token < ~/.config/gh/token
        
        echo "✅ Token saved to ~/.config/gh/token with secure permissions"
        ;;
        
    3)
        echo "☁️  Setting up Google Secret Manager..."
        echo
        
        # Check gcloud
        if ! command -v gcloud &> /dev/null; then
            echo "❌ gcloud CLI not found. Please install Google Cloud CLI first."
            exit 1
        fi
        
        # Check authentication
        if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
            echo "❌ Not authenticated with Google Cloud. Run: gcloud auth login"
            exit 1
        fi
        
        echo "Enter your GitHub Personal Access Token:"
        read -s -p "Token: " TOKEN
        echo
        
        # Create secret
        gcloud secrets create github-token-claude-code \
            --data-file=- <<< "$TOKEN"
        
        # Authenticate GitHub CLI
        echo "$TOKEN" | gh auth login --with-token
        
        echo "✅ Token stored in Google Secret Manager as 'github-token-claude-code'"
        ;;
        
    4)
        echo "🔄 Setting up hybrid authentication..."
        echo
        
        # First set up Secret Manager
        if command -v gcloud &> /dev/null && gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
            echo "Setting up Google Secret Manager..."
            read -s -p "Enter GitHub token: " TOKEN
            echo
            
            gcloud secrets create github-token-claude-code \
                --data-file=- <<< "$TOKEN" 2>/dev/null || \
            gcloud secrets versions add github-token-claude-code \
                --data-file=- <<< "$TOKEN"
            
            echo "$TOKEN" | gh auth login --with-token
            echo "✅ Primary: Google Secret Manager"
        fi
        
        # Also set up local fallback
        mkdir -p ~/.config/gh
        chmod 700 ~/.config/gh
        echo "$TOKEN" > ~/.config/gh/token
        chmod 600 ~/.config/gh/token
        
        echo "✅ Fallback: Local file (~/.config/gh/token)"
        ;;
        
    *)
        echo "❌ Invalid selection"
        exit 1
        ;;
esac

echo
echo "🧪 Testing authentication..."

# Verify authentication
if ! gh auth status > /dev/null 2>&1; then
    echo "❌ Authentication failed"
    exit 1
fi

echo "✅ Authentication successful"

# Check scopes
echo "📋 Checking scopes..."
SCOPES=$(gh auth status 2>&1)

echo "$SCOPES" | grep -q "repo" && echo "  ✅ repo" || echo "  ❌ repo (required)"
echo "$SCOPES" | grep -q "project" && echo "  ✅ project" || echo "  ❌ project (required)"
echo "$SCOPES" | grep -q "workflow" && echo "  ✅ workflow" || echo "  ❌ workflow (required)"
echo "$SCOPES" | grep -q "read:org" && echo "  ✅ read:org" || echo "  ❌ read:org (recommended)"

# Test functionality
echo
echo "🧪 Testing functionality..."
gh project list --owner pbonneville > /dev/null 2>&1 && echo "  ✅ Projects access" || echo "  ❌ Projects access (check permissions)"
gh repo view pbonneville/arrgh-excalidraw > /dev/null 2>&1 && echo "  ✅ Repository access" || echo "  ❌ Repository access"

echo
echo "🎉 GitHub CLI authentication setup complete!"
echo
echo "💡 Tips:"
echo "  - Set a calendar reminder to renew your token before expiration"
echo "  - Run 'gh auth status' to check your authentication anytime"
echo "  - See docs-ai/SECURE-TOKEN-SETUP.md for advanced configuration"
echo
echo "📚 Quick commands:"
echo "  gh auth status                    # Check authentication"
echo "  gh project list --owner pbonneville  # List projects"
echo "  gh auth refresh -s repo -s project -s workflow  # Refresh scopes"