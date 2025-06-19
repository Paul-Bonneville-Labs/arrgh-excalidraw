'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import '@excalidraw/excalidraw/index.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Loader2 } from 'lucide-react';

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

export default function ExcalidrawWithAI() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<unknown>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateDiagram = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      const data = await response.json();
      
      if (data.success && excalidrawAPI && typeof excalidrawAPI === 'object' && excalidrawAPI !== null) {
        (excalidrawAPI as { updateScene: (scene: ExcalidrawScene) => void }).updateScene({
          elements: data.elements,
          appState: data.appState
        });
        // Close modal after successful generation
        setModalOpen(false);
        setPrompt(''); // Clear the prompt
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
    <div className="h-screen relative">
      {/* Main Excalidraw Canvas */}
      <Excalidraw
        excalidrawAPI={(api: unknown) => setExcalidrawAPI(api)}
        theme="light"
        initialData={{
          elements: [],
          appState: {
            viewBackgroundColor: "#ffffff",
            gridSize: 20
          }
        }}
      />

      {/* Floating Action Button */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 h-12 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Generate with AI</span>
          </Button>
        </DialogTrigger>
        
        {/* AI Diagram Generator Modal */}
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Diagram Generator
              <Badge variant="secondary" className="ml-2">Beta</Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <label className="text-sm font-medium mb-3 block">
                Describe your diagram
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your diagram in detail (e.g., 'Create a user authentication flow with database validation and error handling')"
                className="min-h-[120px] resize-none"
                onKeyPress={handleKeyPress}
              />
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Press Enter to generate • Shift+Enter for new line
              </p>
              
              <Button 
                onClick={generateDiagram}
                disabled={loading || !prompt.trim()}
                size="lg"
                className="min-w-[120px]"
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
        </DialogContent>
      </Dialog>
    </div>
  );
}