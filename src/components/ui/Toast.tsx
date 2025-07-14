import React, { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Toast as ToastType } from '../../types'

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const ToastContainer = styled(motion.div)<{ type: ToastType['type'] }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  min-width: 300px;
  max-width: 400px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.3s ease-out;
  
  ${({ type }) => {
    switch (type) {
      case 'success':
        return `
          background-color: #10b981;
          color: white;
        `
      case 'error':
        return `
          background-color: #ef4444;
          color: white;
        `
      case 'warning':
        return `
          background-color: #f59e0b;
          color: white;
        `
      case 'info':
        return `
          background-color: #3b82f6;
          color: white;
        `
      default:
        return `
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        `
    }
  }}
`

const ToastHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`

const ToastTitle = styled.h4`
  font-weight: 600;
  font-size: 14px;
  margin: 0;
`

const ToastMessage = styled.p`
  font-size: 13px;
  margin: 0;
  opacity: 0.9;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`

interface ToastProps {
  toast: ToastType
  onClose: (id: string) => void
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  const getIcon = (type: ToastType['type']) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📢'
    }
  }

  return (
    <ToastContainer
      type={toast.type}
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ToastHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{getIcon(toast.type)}</span>
          <ToastTitle>{toast.title}</ToastTitle>
        </div>
        <CloseButton onClick={() => onClose(toast.id)}>
          ✕
        </CloseButton>
      </ToastHeader>
      {toast.message && <ToastMessage>{toast.message}</ToastMessage>}
    </ToastContainer>
  )
}

export default Toast