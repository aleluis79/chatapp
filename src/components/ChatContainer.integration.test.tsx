import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ChatProvider } from '../context/ChatContext'
import { ThemeProvider } from '../context/ThemeContext'
import { ChatContainer } from './ChatContainer'

describe('ChatContainer integration (streaming)', () => {
  beforeEach(() => {
    // Reset mock control: small delay to simulate streaming but keep real timers
    (globalThis as any).__mlcMockControl__ = {
      delayPerToken: 0,
      shouldError: false,
      replyText: 'hello',
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('streams tokens into the assistant message and focuses input after completion', async () => {
    await act(async () => {
      render(
        <ThemeProvider>
          <ChatProvider>
            <ChatContainer />
          </ChatProvider>
        </ThemeProvider>
      )
    })

    const input = screen.getByPlaceholderText('Type your message...') as HTMLInputElement
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Hi' } })
    })

    // find submit button inside the form
    const form = input.closest('form') as HTMLFormElement
    const sendButton = form.querySelector('button[type="submit"]') as HTMLButtonElement

    await act(async () => {
      fireEvent.click(sendButton)
    })

    // Run all timers so the streaming generator completes
    // Wait for the streaming generator to finish and DOM to update
    await waitFor(() => {
      expect(screen.getByText((globalThis as any).__mlcMockControl__.replyText)).toBeInTheDocument()
    })

    // Input should be focused after completion
    const active = document.activeElement
    expect(active).toBe(input)
  })

  it('handles LLM errors and appends error text', async () => {
    // Make the mock throw
    (globalThis as any).__mlcMockControl__.shouldError = true

    await act(async () => {
      render(
        <ThemeProvider>
          <ChatProvider>
            <ChatContainer />
          </ChatProvider>
        </ThemeProvider>
      )
    })

    const input = screen.getByPlaceholderText('Type your message...') as HTMLInputElement
    const form = input.closest('form') as HTMLFormElement
    const sendButton = form.querySelector('button[type="submit"]') as HTMLButtonElement

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Helo' } })
      fireEvent.click(sendButton)
    })

    // Wait for error to be appended and rendered
    await waitFor(() => {
      expect(screen.getByText(/Error: Mocked LLM error/)).toBeInTheDocument()
    })
  })
})
