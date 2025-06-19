'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import '@excalidraw/excalidraw/index.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Loader2, Sparkles, Download, Share2 } from 'lucide-react';

interface ExcalidrawScene {
  elements: unknown[];
  appState: Record<string, unknown>;
}

const Excalidraw = dynamic(
  async () => {
    const mod = await import('@excalidraw/excalidraw');
    return mod.Excalidraw;
  },
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-lg text-gray-600">Loading Excalidraw...</div>
      </div>
    )
  }
);

export default function DiagramGenerator() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<unknown>(null);
  const [prompt, setPrompt] = useState('');
  const [diagramType, setDiagramType] = useState('flowchart');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const diagramTypes = [
    { value: 'flowchart', label: 'Flowchart' },
    { value: 'architecture', label: 'System Architecture' },
    { value: 'mindmap', label: 'Mind Map' },
    { value: 'process', label: 'Process Flow' },
    { value: 'entity', label: 'Entity Relationship' }
  ];

  const generateDiagram = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, diagram_type: diagramType })
      });
      
      const data = await response.json();
      
      if (data.success && excalidrawAPI && typeof excalidrawAPI === 'object' && excalidrawAPI !== null) {
        (excalidrawAPI as { updateScene: (scene: ExcalidrawScene) => void }).updateScene({
          elements: data.elements,
          appState: data.appState
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateDiagram();
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-lg text-muted-foreground">Initializing...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header Controls */}
      <Card className="m-4 shadow-lg border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Diagram Generator
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">Beta</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your diagram in detail (e.g., 'Create a user authentication flow with database validation and error handling')"
                className="min-h-[80px] resize-none"
                onKeyPress={handleKeyPress}
              />
            </div>
            <div>
              <Select value={diagramType} onValueChange={setDiagramType}>
                <SelectTrigger>
                  <SelectValue placeholder="Diagram Type" />
                </SelectTrigger>
                <SelectContent>
                  {diagramTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button 
                onClick={generateDiagram}
                disabled={loading || !prompt.trim()}
                className="w-full h-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Press Enter to generate • Shift+Enter for new line</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Excalidraw Canvas */}
      <div className="flex-1 mx-4 mb-4">
        <Card className="h-full overflow-hidden border-border">
          <Excalidraw
            excalidrawAPI={(api: unknown) => setExcalidrawAPI(api)}
            theme="light"
            initialData={{
              appState: {
                viewBackgroundColor: "#ffffff",
                gridSize: 20
              }
            }}
          />
        </Card>
      </div>
    </div>
  );
}