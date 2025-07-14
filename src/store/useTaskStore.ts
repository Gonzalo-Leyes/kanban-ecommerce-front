import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task } from '../types'

interface TaskState {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (taskId: string, newStatus: Task['status']) => void
  reorderTasks: (tasks: Task[]) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [
        {
          id: '1',
          title: 'Diseñar mockups',
          description: 'Crear mockups para la nueva funcionalidad del dashboard',
          status: 'todo',
          priority: 'high',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: '2',
          title: 'Implementar API REST',
          description: 'Desarrollar endpoints para el backend con autenticación JWT',
          status: 'in-progress',
          priority: 'medium',
          createdAt: new Date('2024-01-14'),
          updatedAt: new Date('2024-01-16')
        },
        {
          id: '3',
          title: 'Testing unitario',
          description: 'Realizar pruebas unitarias con Jest y Testing Library',
          status: 'done',
          priority: 'low',
          createdAt: new Date('2024-01-13'),
          updatedAt: new Date('2024-01-17')
        }
      ],

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          )
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }))
      },

      moveTask: (taskId, newStatus) => {
        const { updateTask } = get()
        updateTask(taskId, { status: newStatus })
      },

      reorderTasks: (newTasks) => {
        set({ tasks: newTasks })
      }
    }),
    {
      name: 'kanban-tasks'
    }
  )
)