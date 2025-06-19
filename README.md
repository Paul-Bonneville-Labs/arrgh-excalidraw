# AI Diagram Generator with Excalidraw

A Next.js application that uses AI to generate diagrams and renders them in Excalidraw for editing.

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
# Start the Next.js development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 4. Cloud Run Deployment

#### Deploy FastAPI Service (if not already deployed)
```bash
# In your arrgh-fastapi directory
gcloud run deploy arrgh-fastapi \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

#### Deploy Next.js Application
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

## Next Steps

1. Integrate with your existing LLM service in the FastAPI endpoint
2. Add authentication if needed
3. Implement diagram saving/loading
4. Add more diagram templates
5. Enhance the AI prompts for better diagram generation