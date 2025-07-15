import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { Task } from '../types'
import { useTaskStore } from '../store/useTaskStore'
import { useToast } from '../hooks/useToast'

const CardContainer = styled(motion.div)<{ isDragging: boolean }>`
  background-color: var(--bg-primary);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  ${({ isDragging }) =>
    isDragging
      ? `
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        transform: rotate(5deg);
        background-color: var(--bg-secondary);
      `
      : `
        &:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
      `}
`

const TaskHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`

const TaskTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
  flex: 1;
  margin-right: 8px;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${CardContainer}:hover & {
    opacity: 1;
  }
`

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--bg-tertiary);
    transform: scale(1.1);
  }
`

const TaskDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const TaskFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`

const PriorityBadge = styled.span<{ priority: Task['priority'] }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ priority }) => {
    switch (priority) {
      case 'high':
        return `
          background-color: var(--color-danger);
          color: white;
        `
      case 'medium':
        return `
          background-color: var(--color-warning);
          color: white;
        `
      case 'low':
        return `
          background-color: var(--color-success);
          color: white;
        `
      default:
        return `
          background-color: var(--color-secondary);
          color: white;
        `
    }
  }}
`

const TaskDate = styled.div`
  font-size: 11px;
  color: var(--text-muted);
`

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  resize: none;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ variant = 'secondary' }) =>
    variant === 'primary'
      ? `
        background-color: var(--color-primary);
        color: white;
        
        &:hover {
          background-color: var(--color-primary-hover);
        }
      `
      : `
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        
        &:hover {
          background-color: var(--bg-tertiary);
        }
      `}
`

interface TaskCardProps {
  task: Task
  index: number
}

const TaskCardComponent: React.FC<TaskCardProps> = ({ task, index }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description)
  
  const { updateTask, deleteTask } = useTaskStore()
  const { addToast } = useToast()

  const priorityLabels = useMemo(() => ({
    high: 'Alta',
    medium: 'Media',
    low: 'Baja'
  }), [])

  const handleSave = useCallback(() => {
    if (!editTitle.trim()) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'El título no puede estar vacío'
      })
      return
    }

    updateTask(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim()
    })
    
    setIsEditing(false)
    addToast({
      type: 'success',
      title: 'Tarea actualizada',
      message: 'Los cambios se han guardado correctamente'
    })
  }, [editTitle, editDescription, task.id, updateTask, addToast])

  const handleCancel = useCallback(() => {
    setEditTitle(task.title)
    setEditDescription(task.description)
    setIsEditing(false)
  }, [task.title, task.description])

  const handleDelete = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      deleteTask(task.id)
      addToast({
        type: 'success',
        title: 'Tarea eliminada',
        message: 'La tarea se ha eliminado correctamente'
      })
    }
  }, [task.id, deleteTask, addToast])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return (
    <CardContainer
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...attributes}
      {...listeners}
    >
      {isEditing ? (
        <EditForm>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Título de la tarea"
            autoFocus
          />
          <TextArea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Descripción de la tarea"
          />
          <ButtonGroup>
            <Button variant="primary" onClick={handleSave}>
              Guardar
            </Button>
            <Button onClick={handleCancel}>
              Cancelar
            </Button>
          </ButtonGroup>
        </EditForm>
      ) :
        (<>
          <TaskHeader>
            <TaskTitle>{task.title}</TaskTitle>
            <ActionButtons>
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                title="Editar tarea"
              >
                ✏️
              </ActionButton>
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
                title="Eliminar tarea"
              >
                🗑️
              </ActionButton>
            </ActionButtons>
          </TaskHeader>
          {task.description && (
            <TaskDescription>{task.description}</TaskDescription>
          )}
          <TaskFooter>
            <PriorityBadge priority={task.priority}>
              {priorityLabels[task.priority]}
            </PriorityBadge>
            <TaskDate>
              {new Date(task.createdAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short'
              })}
            </TaskDate>
          </TaskFooter>
        </>)
      }
    </CardContainer>
  )
}

const TaskCard = React.memo(TaskCardComponent)
export default TaskCard