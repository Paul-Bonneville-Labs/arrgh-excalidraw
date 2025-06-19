# AI Diagram Generator with Excalidraw

A Next.js application that uses AI to generate diagrams and renders them in Excalidraw for editing.

**🔗 Live App:** https://excalidraw.paulbonneville.com

## Architecture

- **Next.js Frontend**: React app with shadcn/ui components and Excalidraw integration
- **FastAPI Backend**: Your existing arrgh-fastapi service with new diagram generation endpoint

## Setup Instructions

### 1. Next.js Application Setup

```bash
# Install dependencies (already done)
npm install

# Copy environment file (already exists)
# Edit .env.local to point to your FastAPI service
# FASTAPI_URL=https://your-fastapi-service.run.app
```

### 2. FastAPI Integration

Copy the code from `fastapi-endpoint-example.py` to your existing arrgh-fastapi service:

1. Add the `DiagramRequest` model to your models
2. Add the `/api/generate-excalidraw` endpoint to your FastAPI app
3. Replace the placeholder LLM integration with your actual LLM client
4. Deploy your updated FastAPI service

### 3. Local Development

```bash
# Install dependencies
npm install

# Start the Next.js development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint

# Build for production
npm run build
```

Visit `http://localhost:3000` to see the application.

### 4. Automated Deployment (CI/CD)

This project uses **GitHub Actions** for automated testing and deployment:

#### CI Pipeline (Pull Requests)
- Runs on every pull request to `main`
- Tests on Node.js 18.x and 20.x
- Executes: lint → test → build
- Required to pass before merging

#### CD Pipeline (Production Deployment)
- Automatically triggers on push to `main`
- Runs full test suite and build
- Deploys to Google Cloud Run
- Includes health check verification

#### Setup Requirements
1. **Configure GitHub Secrets** (see `docs-ai/GITHUB-SECRETS-SETUP.md`):
   - `GCP_SA_KEY`: Google Cloud service account credentials
   - `FASTAPI_URL`: Your FastAPI backend URL

2. **Deploy FastAPI Service** (if not already deployed):
   ```bash
   # In your arrgh-fastapi directory
   gcloud run deploy arrgh-fastapi \
     --source . \
     --region us-central1 \
     --allow-unauthenticated
   ```

#### Manual Deployment (if needed)

```bash
# In the arrgh-excalidraw directory
gcloud run deploy excalidraw-nextjs \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FASTAPI_URL=https://your-fastapi-service.run.app
```

## Features

- **AI-Powered Diagram Generation**: Enter a text description and generate diagrams
- **Multiple Diagram Types**: Flowcharts, architecture diagrams, mind maps, etc.
- **Real-time Editing**: Generated diagrams load directly into Excalidraw for editing
- **Beautiful UI**: Modern interface with shadcn/ui components
- **Export Options**: Export diagrams as PNG, SVG, or JSON
- **Responsive Design**: Works on desktop and mobile

## Usage

1. Enter a description of your diagram in the text area
2. Select the diagram type from the dropdown
3. Click "Generate" or press Enter
4. The AI will generate the diagram and load it into Excalidraw
5. Edit, modify, or export your diagram as needed

## Example Prompts

- "Create a user authentication flow with database validation"
- "Design a microservices architecture for an e-commerce platform" 
- "Show the CI/CD pipeline for a web application"
- "Create a mind map for project planning phases"

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (built on Radix UI)
- **Diagram Editor**: Excalidraw
- **Icons**: Lucide React
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions
- **Backend**: FastAPI (your existing service)
- **Deployment**: Google Cloud Run

## Cost Estimates

**Monthly costs for light usage:**
- Next.js app: $10-20
- Existing FastAPI (marginal increase): $2-5
- **Total**: $12-25/month

## Development Notes

- The Excalidraw component is dynamically imported to prevent SSR issues
- All diagram data is processed client-side after generation
- The API route acts as a proxy to your FastAPI service
- Environment variables are used for configuration
- Tests mock Excalidraw and fetch API for reliable testing
- Branch protection requires PR reviews and passing CI checks

## Contributing

### Prerequisites
- Node.js 18+ and npm
- GitHub CLI with proper permissions (see [GitHub CLI Setup Guide](docs-ai/GITHUB-CLI-SETUP.md))

### Required GitHub CLI Scopes
For full project management capabilities, ensure you have these scopes:
```bash
gh auth refresh -s repo -s project -s workflow -s read:org
```

### Workflow
1. **Create a feature branch** from `main`
2. **Make your changes** with appropriate tests
3. **Run tests locally**: `npm test` and `npm run lint`
4. **Create a pull request** - CI will automatically run tests
5. **Get approval** from a reviewer with write access
6. **Merge to main** - CD will automatically deploy to production

### GitHub Projects Integration
This repository is integrated with the "Arrgh! Aggregated Research Repository" project for issue tracking and project management.

## Next Steps

1. Integrate with your existing LLM service in the FastAPI endpoint
2. Add authentication if needed
3. Implement diagram saving/loading
4. Add more diagram templates
5. Enhance the AI prompts for better diagram generation
6. Add deployment monitoring and alerting
7. Implement user feedback collection