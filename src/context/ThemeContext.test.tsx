import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider, useTheme } from '../context/ThemeContext'

// Test component to access context
function TestComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="resolved-theme">{resolvedTheme}</div>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should provide default theme as system', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('system')
  })

  it('should persist theme to localStorage', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const darkButton = screen.getByText('Dark')
    fireEvent.click(darkButton)

    await waitFor(() => {
      expect(localStorage.getItem('theme')).toBe('dark')
    })
  })

  it('should apply dark class when theme is dark', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const darkButton = screen.getByText('Dark')
    fireEvent.click(darkButton)

    await waitFor(() => {
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark')
    })
  })

  it('should switch themes correctly', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const lightButton = screen.getByText('Light')
    fireEvent.click(lightButton)

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    })

    const darkButton = screen.getByText('Dark')
    fireEvent.click(darkButton)

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    })
  })

  it('should load theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'dark')
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })
})
