import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ChatProvider, useChat } from '../context/ChatContext'

function TestComponent() {
  const { messages, addMessage, clearMessages, isLoading } = useChat()

  return (
    <div>
      <div data-testid="message-count">{messages.length}</div>
      <div data-testid="loading-status">{isLoading ? 'loading' : 'ready'}</div>
      <button onClick={() => addMessage({ role: 'user', content: 'Hello' })}>
        Add Message
      </button>
      <button onClick={() => clearMessages()}>Clear</button>
      <div data-testid="messages">
        {messages.map(msg => (
          <div key={msg.id} data-testid={`message-${msg.id}`}>
            {msg.role}: {msg.content}
          </div>
        ))}
      </div>
    </div>
  )
}

describe('ChatContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide initial empty messages', () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    )

    expect(screen.getByTestId('message-count')).toHaveTextContent('0')
  })

  it('should add messages to the context', async () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    )

    const addButton = screen.getByText('Add Message')
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByTestId('message-count')).toHaveTextContent('1')
    })
  })

  it('should clear all messages', async () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    )

    const addButton = screen.getByText('Add Message')
    fireEvent.click(addButton)
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByTestId('message-count')).toHaveTextContent('2')
    })

    const clearButton = screen.getByText('Clear')
    fireEvent.click(clearButton)

    await waitFor(() => {
      expect(screen.getByTestId('message-count')).toHaveTextContent('0')
    })
  })

  it('should assign unique ids to messages', async () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    )

    const addButton = screen.getByText('Add Message')
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByTestId('message-count')).toHaveTextContent('1')
    })

    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByTestId('message-count')).toHaveTextContent('2')
    })

    const messagesContainer = screen.getByTestId('messages')
    const messageElements = messagesContainer.querySelectorAll('[data-testid^="message-"]')
    expect(messageElements).toHaveLength(2)
  })

  it('should throw error when useChat is used outside provider', () => {
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useChat must be used within ChatProvider')
  })
})
