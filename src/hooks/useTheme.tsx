import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { Theme } from '../types'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme
      }
      
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  const toggleTheme = useCallback(() => {
    setTheme(current => current === 'light' ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
    } catch (error) {
      console.warn('Failed to save theme preference:', error)
    }
  }, [theme])

  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
} 