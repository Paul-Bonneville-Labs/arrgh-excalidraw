# CLAUDE.md Updates - 2025-06-19

## Problem Statement
The CLAUDE.md file needed updates to reflect current project state, including missing development commands, custom domain configuration, and more generic examples.

## Changes Made

### 1. Added Test Commands
- Added `npm run test` - Run tests
- Added `npm run test:watch` - Run tests in watch mode  
- Added `npm run test:coverage` - Run tests with coverage report

### 2. Updated Deployment Architecture
- Added production URL: https://excalidraw.paulbonneville.com
- Documented custom domain configuration via DNS
- Added note about deployment workflow testing both URLs
- Clarified DNS vs Cloud Run domain mapping approach

### 3. Enhanced Environment Variables Section
- Added production notes section
- Clarified custom domain handled via DNS (no env vars needed)
- Maintained existing FASTAPI_URL and FASTAPI_TOKEN documentation

### 4. Made GitHub CLI Examples More Generic
- Added clarifying comments about replacing 'pbonneville' with actual username
- Kept working examples while making documentation more reusable

## Files Modified
- `CLAUDE.md` - Updated with all four improvements

## Outcome
- Complete development command reference including tests
- Accurate deployment architecture documentation
- Clear custom domain setup explanation
- More generic and reusable GitHub CLI examples

## Success Metrics
- ✅ All npm scripts from package.json documented
- ✅ Custom domain properly documented
- ✅ Production deployment architecture clear
- ✅ GitHub CLI examples improved for reusability