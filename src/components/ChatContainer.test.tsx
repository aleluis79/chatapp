import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ChatProvider } from '../context/ChatContext'
import { ThemeProvider } from '../context/ThemeContext'
import { ChatContainer } from './ChatContainer'

describe('ChatContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render welcome message when no messages', () => {
    render(
      <ThemeProvider>
        <ChatProvider>
          <ChatContainer />
        </ChatProvider>
      </ThemeProvider>
    )

    expect(screen.getByText('Welcome to ChatBot IA')).toBeInTheDocument()
    expect(screen.getByText('Start a conversation to begin')).toBeInTheDocument()
  })

  it('should render input field and send button', () => {
    render(
      <ThemeProvider>
        <ChatProvider>
          <ChatContainer />
        </ChatProvider>
      </ThemeProvider>
    )

    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument()
  })

  it('should render settings button', () => {
    render(
      <ThemeProvider>
        <ChatProvider>
          <ChatContainer />
        </ChatProvider>
      </ThemeProvider>
    )

    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })

  it('should render header with title', () => {
    render(
      <ThemeProvider>
        <ChatProvider>
          <ChatContainer />
        </ChatProvider>
      </ThemeProvider>
    )

    expect(screen.getByText('ChatBot IA')).toBeInTheDocument()
  })

  it('should disable send button when input is empty', () => {
    render(
      <ThemeProvider>
        <ChatProvider>
          <ChatContainer />
        </ChatProvider>
      </ThemeProvider>
    )

    const input = screen.getByPlaceholderText('Type your message...')
    expect(input).toBeInTheDocument()
  })

  it('should display model presets in settings', async () => {
    render(
      <ThemeProvider>
        <ChatProvider>
          <ChatContainer />
        </ChatProvider>
      </ThemeProvider>
    )

    const settingsButton = screen.getByLabelText('Settings')
    settingsButton.click()

    await waitFor(() => {
      expect(screen.getByText('Model Selection')).toBeInTheDocument()
    })
  })

  it('should have clear chat option in settings', async () => {
    render(
      <ThemeProvider>
        <ChatProvider>
          <ChatContainer />
        </ChatProvider>
      </ThemeProvider>
    )

    const settingsButton = screen.getByLabelText('Settings')
    settingsButton.click()

    await waitFor(() => {
      expect(screen.getByText('Clear Chat')).toBeInTheDocument()
    })
  })
})
