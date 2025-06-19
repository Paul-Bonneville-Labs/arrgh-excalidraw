# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture Overview

This is a **Next.js 15 application** that integrates **AI-powered diagram generation with Excalidraw**. The system has two main components:

### Frontend (Next.js)
- **Main Component**: `src/components/excalidraw-with-ai.tsx` - Excalidraw canvas with AI generation modal
- **API Route**: `src/app/api/generate/route.ts` - Proxy to FastAPI backend
- **UI Components**: shadcn/ui components in `src/components/ui/`

### Backend Integration
- **FastAPI Service**: Separate service with `/api/generate-excalidraw` endpoint
- **Reference Implementation**: `fastapi-endpoint-simplified.py` shows the required FastAPI endpoint structure

## Key Technical Details

### Excalidraw Integration
- Excalidraw is **dynamically imported** (`ssr: false`) to prevent SSR issues
- Components must handle the `mounted` state before rendering Excalidraw
- API responses must contain `elements` array and `appState` object in Excalidraw JSON format

### Environment Variables
- `FASTAPI_URL`: Backend service URL (defaults to `http://localhost:8000`)
- `FASTAPI_TOKEN`: Optional bearer token for backend authentication

### AI Generation Flow
1. User enters prompt in modal dialog
2. Frontend sends POST to `/api/generate`
3. Next.js API route proxies to FastAPI backend
4. FastAPI returns Excalidraw JSON elements
5. Frontend updates Excalidraw scene with generated elements

## Deployment Architecture
- **Frontend**: Next.js app on Google Cloud Run
- **Backend**: Existing arrgh-fastapi service with new diagram endpoint
- Both services deployed independently, connected via `FASTAPI_URL`

## Technology Stack
- Next.js 15 with React 19 and TypeScript
- Excalidraw for diagram editing
- shadcn/ui + Tailwind CSS for UI
- Lucide React for icons