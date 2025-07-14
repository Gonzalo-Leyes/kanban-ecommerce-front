import { create } from 'zustand'
import { Toast } from '../types'

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Date.now().toString()
    const newToast: Toast = { ...toast, id }
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }))
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }))
  },

  clearToasts: () => {
    set({ toasts: [] })
  }
}))