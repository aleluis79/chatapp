import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    return saved || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    const effectiveTheme = saved || 'system'
    
    if (effectiveTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return effectiveTheme as 'light' | 'dark'
  })

  // Update theme class on DOM and resolvedTheme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateTheme = () => {
      let isDark = false
      
      if (theme === 'system') {
        isDark = mediaQuery.matches
      } else {
        isDark = theme === 'dark'
      }
      
      setResolvedTheme(isDark ? 'dark' : 'light')
      
      // Apply class immediately
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    updateTheme()
    mediaQuery.addEventListener('change', updateTheme)
    
    return () => mediaQuery.removeEventListener('change', updateTheme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
