import { create } from 'zustand'
import { Product, ProductFilters } from '../types'

interface ProductState {
  products: Product[]
  filteredProducts: Product[]
  loading: boolean
  error: string | null
  filters: ProductFilters
  currentPage: number
  itemsPerPage: number
  setProducts: (products: Product[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setFilters: (filters: ProductFilters) => void
  setCurrentPage: (page: number) => void
  applyFilters: () => void
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  loading: true,
  error: null,
  currentPage: 1,
  itemsPerPage: 12,
  filters: {
    category: '',
    sortBy: 'name',
    search: '',
    minPrice: 0,
    maxPrice: 2000,
    minRating: 0
  },

  setProducts: (products) => {
    set({ products })
    get().applyFilters()
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  setFilters: (filters) => {
    set({ filters, currentPage: 1 })
    get().applyFilters()
  },

  applyFilters: () => {
    const { products, filters } = get()
    
    if (!products.length) {
      set({ filteredProducts: [] })
      return
    }
    
    let result = products.filter(product => {
      // Filtro por búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = [
          product.title || '',
          product.description || '',
          product.brand || ''
        ].some(field => field.toLowerCase().includes(searchLower))
        
        if (!matchesSearch) return false
      }

      // Filtro por categoría
      if (filters.category && product.category !== filters.category) {
        return false
      }

      // Filtro por precio
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false
      }
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false
      }

      // Filtro por rating
      if (filters.minRating !== undefined && product.rating < filters.minRating) {
        return false
      }

      return true
    })

    // Ordenamiento
    const sortFunctions = {
      'price-asc': (a: Product, b: Product) => a.price - b.price,
      'price-desc': (a: Product, b: Product) => b.price - a.price,
      'rating': (a: Product, b: Product) => b.rating - a.rating,
      'name': (a: Product, b: Product) => a.title.localeCompare(b.title)
    }
    
    const sortFn = sortFunctions[filters.sortBy]
    if (sortFn) {
      result.sort(sortFn)
    }

    set({ filteredProducts: result })
  }
}))