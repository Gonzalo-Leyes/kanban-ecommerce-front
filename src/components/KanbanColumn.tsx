import React, { useMemo } from 'react'
import styled from 'styled-components'
import { SortableContext } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { Task } from '../types'
import TaskCard from './TaskCard'

const ColumnContainer = styled(motion.div)`
  background-color: var(--bg-secondary);
  border-radius: 12px;
  padding: 20px;
  min-height: 500px;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: var(--shadow-md);
  }
`

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
`

const ColumnTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`

const TaskCount = styled.span`
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`

const StatusIndicator = styled.div<{ status: Task['status'] }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 8px;
  
  ${({ status }) => {
    switch (status) {
      case 'todo':
        return 'background-color: var(--color-warning);'
      case 'in-progress':
        return 'background-color: var(--color-primary);'
      case 'done':
        return 'background-color: var(--color-success);'
      default:
        return 'background-color: var(--color-secondary);'
    }
  }}
`

const TaskList = styled.div<{ isDraggingOver: boolean }>`
  min-height: 400px;
  transition: background-color 0.2s ease;
  border-radius: 8px;
  padding: 8px;
  
  ${({ isDraggingOver }) =>
    isDraggingOver &&
    `
    background-color: var(--bg-tertiary);
    border: 2px dashed var(--color-primary);
  `}
`

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-muted);
  text-align: center;
`

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
`

interface KanbanColumnProps {
  title: string
  tasks: Task[]
  status: Task['status']
  droppableId: string
}

const KanbanColumnComponent: React.FC<KanbanColumnProps> = ({
  title,
  tasks,
  status,
  droppableId
}) => {
  const getEmptyMessage = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return { icon: '📝', message: 'No hay tareas pendientes' }
      case 'in-progress':
        return { icon: '⚡', message: 'No hay tareas en progreso' }
      case 'done':
        return { icon: '✅', message: 'No hay tareas completadas' }
      default:
        return { icon: '📋', message: 'No hay tareas' }
    }
  }


  const { setNodeRef, isOver } = useDroppable({ 
    id: droppableId,
    data: {
      type: 'column',
      status: status,
      accepts: ['todo', 'in-progress', 'done']
    }
  });
  

  const columnStyle = useMemo<React.CSSProperties>(() => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '400px',
    backgroundColor: isOver ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
    borderRadius: '8px',
    padding: '8px',
    transition: 'background-color 0.2s ease',
    border: isOver ? '2px dashed var(--color-primary)' : '1px solid var(--border-color)'
  }), [isOver]);
  

  const itemIds = useMemo(() => tasks.map(task => task.id), [tasks]);
  

  const taskList = useMemo(() => {
    if (tasks.length === 0) {
      return (
        <EmptyState
          key="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <EmptyIcon>{getEmptyMessage(status).icon}</EmptyIcon>
          <p>{getEmptyMessage(status).message}</p>
        </EmptyState>
      );
    }
    
    return tasks.map((task, index) => (
      <TaskCard
        key={task.id}
        task={task}
        index={index}
      />
    ));
  }, [tasks, status]);
  return (
    <ColumnContainer
      ref={setNodeRef}
      style={columnStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ColumnHeader>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ColumnTitle>{title}</ColumnTitle>
          <StatusIndicator status={status} />
        </div>
        <TaskCount>{tasks.length}</TaskCount>
      </ColumnHeader>
      <SortableContext items={itemIds}>
        <TaskList isDraggingOver={isOver}>
          {taskList}
        </TaskList>
      </SortableContext>
    </ColumnContainer>
  )
};

const KanbanColumn = React.memo(KanbanColumnComponent, (prevProps, nextProps) => {

  return (
    prevProps.tasks === nextProps.tasks &&
    prevProps.title === nextProps.title &&
    prevProps.status === nextProps.status
  );
});

KanbanColumn.displayName = 'KanbanColumn';

export default KanbanColumn;