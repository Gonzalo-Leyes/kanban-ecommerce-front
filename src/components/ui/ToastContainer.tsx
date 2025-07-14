import React from 'react'
import { AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { useToast } from '../../hooks/useToast'
import Toast from './Toast'

const Container = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast()

  return (
    <Container>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={removeToast}
          />
        ))}
      </AnimatePresence>
    </Container>
  )
}

export default ToastContainer