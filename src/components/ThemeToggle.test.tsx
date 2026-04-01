import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '../context/ThemeContext'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('should render all theme buttons', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    expect(screen.getByLabelText('Light theme')).toBeInTheDocument()
    expect(screen.getByLabelText('Dark theme')).toBeInTheDocument()
    expect(screen.getByLabelText('System theme')).toBeInTheDocument()
  })

  it('should change theme when button is clicked', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const darkButton = screen.getByLabelText('Dark theme')
    fireEvent.click(darkButton)

    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('should highlight the active theme button', () => {
    localStorage.setItem('theme', 'light')

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    )

    const lightButton = screen.getByLabelText('Light theme')
    expect(lightButton.parentElement).toHaveClass('rounded-lg')
  })
})
