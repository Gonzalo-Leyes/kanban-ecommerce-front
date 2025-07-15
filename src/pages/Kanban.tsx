import React, { useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { Task } from '../types'
import { useTaskStore } from '../store/useTaskStore'
import { useToast } from '../hooks/useToast'
import KanbanColumn from '../components/KanbanColumn'
import TaskForm from '../components/TaskForm'

const KanbanContainer = styled.div`
  min-height: calc(100vh - 200px);
`

const KanbanHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
`

const HeaderContent = styled.div`
  flex: 1;
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '📋';
    font-size: 28px;
  }
`

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin: 0;
  font-size: 16px;
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const StatsCard = styled.div`
  background-color: var(--bg-secondary);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  text-align: center;
  min-width: 80px;
`

const StatsNumber = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
`

const StatsLabel = styled.div`
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const AddTaskButton = styled(motion.button)`
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const ColumnsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const Kanban: React.FC = () => {
  const [showForm, setShowForm] = useState(false)
  const { tasks, moveTask, reorderTasks } = useTaskStore()
  const { addToast } = useToast()


  const tasksByStatus = useMemo(() => ({
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    done: tasks.filter(task => task.status === 'done')
  }), [tasks])
  

  const columns = useMemo(() => [
    { 
      id: 'todo', 
      title: 'Por Hacer', 
      tasks: tasksByStatus.todo,
      dataTestId: 'todo-column' 
    },
    { 
      id: 'in-progress', 
      title: 'En Progreso', 
      tasks: tasksByStatus['in-progress'],
      dataTestId: 'in-progress-column' 
    },
    { 
      id: 'done', 
      title: 'Completado', 
      tasks: tasksByStatus.done,
      dataTestId: 'done-column' 
    }
  ], [tasksByStatus])

  const stats = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasksByStatus.done.length
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    return { totalTasks, completedTasks, completionRate }
  }, [tasks.length, tasksByStatus.done.length])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    

    const sourceColumn = columns.find(col => 
      col.tasks.some(task => task.id === active.id)
    );
    

    let destinationColumn = columns.find(col => col.id === over.id);
    

    if (!destinationColumn) {

      const targetTaskColumn = columns.find(col => 
        col.tasks.some(task => task.id === over.id)
      );
      if (targetTaskColumn) {
        destinationColumn = targetTaskColumn;
      } else {
        return;
      }
    }
    

    if (!sourceColumn || !destinationColumn) return;
    

    const taskId = active.id as string;
    

    if (sourceColumn.id !== destinationColumn.id) {
      moveTask(taskId, destinationColumn.id as Task['status']);
      
      addToast({
        type: 'success',
        title: 'Tarea movida',
        message: `Tarea movida a ${destinationColumn.title}`
      });
    } else {

      const columnTasks = [...sourceColumn.tasks];
      const oldIndex = columnTasks.findIndex(task => task.id === taskId);
      

      const overTask = columnTasks.find(task => task.id === over.id);
      let newIndex = columnTasks.length - 1;
      
      if (overTask) {
        newIndex = columnTasks.findIndex(task => task.id === over.id);
      }
      
      if (oldIndex !== -1 && oldIndex !== newIndex) {
        const newTasks = arrayMove(columnTasks, oldIndex, newIndex);
        reorderTasks([
          ...tasks.filter(task => task.status !== sourceColumn.id),
          ...newTasks
        ]);
      }
    }
  }, [columns, moveTask, reorderTasks, addToast, tasks]);

  return (
    <KanbanContainer>
      <KanbanHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <HeaderContent>
          <Title>Dashboard Kanban</Title>
          <Subtitle>
            Organiza y gestiona tus tareas de manera eficiente
          </Subtitle>
        </HeaderContent>
        <HeaderActions>
          <StatsCard>
            <StatsNumber>{stats.totalTasks}</StatsNumber>
            <StatsLabel>Total</StatsLabel>
          </StatsCard>
          <StatsCard>
            <StatsNumber>{stats.completedTasks}</StatsNumber>
            <StatsLabel>Completadas</StatsLabel>
          </StatsCard>
          <StatsCard>
            <StatsNumber>{stats.completionRate}%</StatsNumber>
            <StatsLabel>Progreso</StatsLabel>
          </StatsCard>
          <AddTaskButton
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>➕</span>
            Nueva Tarea
          </AddTaskButton>
        </HeaderActions>
      </KanbanHeader>
      <DndContext onDragEnd={handleDragEnd}>
        <ColumnsContainer>
          {columns.map((column) => {
            return (
              <div 
                key={column.id}
                data-testid={column.dataTestId}
                style={{
                  height: '100%',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <KanbanColumn
                  key={column.id}
                  title={column.title}
                  tasks={column.tasks}
                  status={column.id as Task['status']}
                  droppableId={column.id}
                />
              </div>
            );
          })}
        </ColumnsContainer>
      </DndContext>
      <TaskForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
      />
    </KanbanContainer>
  )
}

export default Kanban