import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
    
    const response = await fetch(`${fastApiUrl}/api/generate-excalidraw`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Add authorization if needed
        ...(process.env.FASTAPI_TOKEN && {
          'Authorization': `Bearer ${process.env.FASTAPI_TOKEN}`
        })
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      console.error('FastAPI request failed:', response.status, response.statusText);
      throw new Error(`FastAPI request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate diagram',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}