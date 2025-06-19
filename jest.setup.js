import '@testing-library/jest-dom'
import React from 'react'

// Mock Excalidraw to prevent SSR issues in tests
jest.mock('@excalidraw/excalidraw', () => ({
  Excalidraw: () => React.createElement('div', { 'data-testid': 'excalidraw-mock' }, 'Excalidraw Mock'),
}))

// Mock Next.js dynamic imports
jest.mock('next/dynamic', () => (func) => {
  const DynamicComponent = (props) => {
    const Component = func()
    if (Component && typeof Component === 'function') {
      return React.createElement(Component, props)
    }
    return React.createElement('div', { 'data-testid': 'dynamic-mock' }, 'Dynamic Component Mock')
  }
  DynamicComponent.displayName = 'DynamicComponent'
  return DynamicComponent
})

// Add Node.js globals for Next.js API routes
global.Request = require('node:http').IncomingMessage
global.Response = class Response {
  constructor(body, init) {
    this.body = body
    this.status = init?.status || 200
    this.headers = new Map(Object.entries(init?.headers || {}))
  }
  json() { return Promise.resolve(JSON.parse(this.body)) }
}

// Mock fetch for API tests
global.fetch = jest.fn()

beforeEach(() => {
  fetch.mockClear()
})