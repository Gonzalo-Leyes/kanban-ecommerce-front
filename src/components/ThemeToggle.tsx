import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

const ToggleButton = styled(motion.button)`
  position: relative;
  width: 56px;
  height: 28px;
  background-color: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`

const ToggleIndicator = styled(motion.div)`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <ToggleButton
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
      title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      <ToggleIndicator
        animate={{
          x: theme === 'dark' ? 24 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      >
        {theme === 'light' ? '🌞' : '🌚'}
      </ToggleIndicator>
    </ToggleButton>
  )
}

export default ThemeToggle