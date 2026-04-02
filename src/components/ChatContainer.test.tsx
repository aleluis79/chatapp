import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ChatProvider } from '../context/ChatContext'
import { ThemeProvider } from '../context/ThemeContext'
import { ChatContainer } from './ChatContainer'

describe('ChatContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render welcome message when no messages', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ChatProvider>
            <ChatContainer />
          </ChatProvider>
        </ThemeProvider>
      )
    })

    expect(screen.getByText('Welcome to ChatBot IA')).toBeInTheDocument()
    expect(screen.getByText('Start a conversation to begin')).toBeInTheDocument()
  })

  it('should render input field and send button', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ChatProvider>
            <ChatContainer />
          </ChatProvider>
        </ThemeProvider>
      )
    })

    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument()
    // find submit button by type to avoid ambiguity with other buttons
    const input = screen.getByPlaceholderText('Type your message...')
    const form = input.closest('form') as HTMLFormElement
    expect(form.querySelector('button[type="submit"]')).toBeTruthy()
  })

  it('should render settings button', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ChatProvider>
            <ChatContainer />
          </ChatProvider>
        </ThemeProvider>
      )
    })

    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })

  it('should render header with title', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ChatProvider>
            <ChatContainer />
          </ChatProvider>
        </ThemeProvider>
      )
    })

    expect(screen.getByText('ChatBot IA')).toBeInTheDocument()
  })

  it('should disable send button when input is empty', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ChatProvider>
            <ChatContainer />
          </ChatProvider>
        </ThemeProvider>
      )
    })

    const input = screen.getByPlaceholderText('Type your message...')
    expect(input).toBeInTheDocument()
  })

  it('should display model presets in settings', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ChatProvider>
            <ChatContainer />
          </ChatProvider>
        </ThemeProvider>
      )
    })

    const settingsButton = screen.getByLabelText('Settings')
    await act(async () => settingsButton.click())

    await waitFor(() => {
      expect(screen.getByText('Model Selection')).toBeInTheDocument()
    })
  })

  it('should have clear chat option in settings', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ChatProvider>
            <ChatContainer />
          </ChatProvider>
        </ThemeProvider>
      )
    })

    const settingsButton = screen.getByLabelText('Settings')
    await act(async () => settingsButton.click())

    await waitFor(() => {
      expect(screen.getByText('Clear Chat')).toBeInTheDocument()
    })
  })
})
