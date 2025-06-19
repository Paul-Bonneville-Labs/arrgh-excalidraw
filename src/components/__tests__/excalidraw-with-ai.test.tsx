import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

// Mock fetch for API calls
const mockFetch = jest.fn()
global.fetch = mockFetch

// Import after mocks are set up
let ExcalidrawWithAI: React.ComponentType

beforeAll(async () => {
  const moduleImport = await import('../excalidraw-with-ai')
  ExcalidrawWithAI = moduleImport.default
})

describe('ExcalidrawWithAI', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('shows the Generate with AI button', () => {
    render(<ExcalidrawWithAI />)
    expect(screen.getByRole('button', { name: /generate with ai/i })).toBeInTheDocument()
  })

  it('opens modal when Generate with AI button is clicked', async () => {
    const user = userEvent.setup()
    render(<ExcalidrawWithAI />)
    
    const generateButton = screen.getByRole('button', { name: /generate with ai/i })
    await user.click(generateButton)
    
    expect(screen.getByText('AI Diagram Generator')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/describe your diagram/i)).toBeInTheDocument()
  })

  it('enables generate button when text is entered', async () => {
    const user = userEvent.setup()
    render(<ExcalidrawWithAI />)
    
    // Open modal
    const generateButton = screen.getByRole('button', { name: /generate with ai/i })
    await user.click(generateButton)
    
    // Type in textarea
    const textarea = screen.getByPlaceholderText(/describe your diagram/i)
    await user.type(textarea, 'Create a flowchart')
    
    // Generate button should be enabled
    const modalGenerateButton = screen.getByRole('button', { name: /^generate$/i })
    expect(modalGenerateButton).not.toBeDisabled()
  })

  it('calls API when generate is clicked with prompt', async () => {
    const user = userEvent.setup()
    
    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        elements: [],
        appState: { viewBackgroundColor: '#ffffff' }
      })
    })
    
    render(<ExcalidrawWithAI />)
    
    // Open modal and enter prompt
    const generateButton = screen.getByRole('button', { name: /generate with ai/i })
    await user.click(generateButton)
    
    const textarea = screen.getByPlaceholderText(/describe your diagram/i)
    await user.type(textarea, 'Create a user flow diagram')
    
    // Click generate
    const modalGenerateButton = screen.getByRole('button', { name: /^generate$/i })
    await user.click(modalGenerateButton)
    
    // Verify API call
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Create a user flow diagram' })
      })
    })
  })

  it('shows loading state during generation', async () => {
    const user = userEvent.setup()
    
    // Mock delayed API response
    mockFetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true, elements: [], appState: {} })
      }), 100))
    )
    
    render(<ExcalidrawWithAI />)
    
    // Open modal and generate
    const generateButton = screen.getByRole('button', { name: /generate with ai/i })
    await user.click(generateButton)
    
    const textarea = screen.getByPlaceholderText(/describe your diagram/i)
    await user.type(textarea, 'Test')
    
    const modalGenerateButton = screen.getByRole('button', { name: /^generate$/i })
    await user.click(modalGenerateButton)
    
    // Should show loading state
    expect(screen.getByText('Generating...')).toBeInTheDocument()
    expect(modalGenerateButton).toBeDisabled()
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.queryByText('Generating...')).not.toBeInTheDocument()
    }, { timeout: 200 })
  })
})