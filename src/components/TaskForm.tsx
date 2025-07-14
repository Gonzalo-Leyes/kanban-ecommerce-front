import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Task } from '../types'
import { useTaskStore } from '../store/useTaskStore'
import { useToast } from '../hooks/useToast'

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  backdrop-filter: blur(4px);
`

const Modal = styled(motion.div)`
  background-color: var(--bg-primary);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border-color);
`

const ModalHeader = styled.div`
  margin-bottom: 24px;
`

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
`

const ModalSubtitle = styled.p`
  color: var(--text-secondary);
  margin: 0;
  font-size: 14px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  
  &::after {
    content: ${({ required }: { required?: boolean }) => required ? '" *"' : '""'};
    color: var(--color-danger);
  }
`

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 16px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ variant = 'secondary' }) =>
    variant === 'primary'
      ? `
        background-color: var(--color-primary);
        color: white;
        
        &:hover {
          background-color: var(--color-primary-hover);
          transform: translateY(-1px);
        }
        
        &:active {
          transform: translateY(0);
        }
      `
      : `
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        border: 2px solid var(--border-color);
        
        &:hover {
          background-color: var(--bg-tertiary);
          border-color: var(--border-color-hover);
        }
      `}
`

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  
  const { addTask } = useTaskStore()
  const { addToast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'El título es requerido'
      })
      return
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      status: 'todo'
    })

    addToast({
      type: 'success',
      title: 'Tarea creada',
      message: 'La nueva tarea se ha agregado correctamente'
    })

    // Reset form
    setTitle('')
    setDescription('')
    setPriority('medium')
    onClose()
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <Modal
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Nueva Tarea</ModalTitle>
              <ModalSubtitle>
                Crea una nueva tarea para tu tablero Kanban
              </ModalSubtitle>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="title" required>
                  Título
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Implementar nueva funcionalidad"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="description">
                  Descripción
                </Label>
                <TextArea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe los detalles de la tarea..."
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="priority">
                  Prioridad
                </Label>
                <Select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Task['priority'])}
                >
                  <option value="low">🟢 Baja</option>
                  <option value="medium">🟡 Media</option>
                  <option value="high">🔴 Alta</option>
                </Select>
              </FormGroup>
              
              <ButtonGroup>
                <Button variant="primary" type="submit">
                  Crear Tarea
                </Button>
                <Button type="button" onClick={handleClose}>
                  Cancelar
                </Button>
              </ButtonGroup>
            </Form>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  )
}

export default TaskForm