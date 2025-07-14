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
    let result = [...products]

    // Filtro por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por categoría
    if (filters.category) {
      result = result.filter(product => product.category === filters.category)
    }

    // Filtro por precio
    if (filters.minPrice !== undefined) {
      result = result.filter(product => product.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter(product => product.price <= filters.maxPrice!)
    }

    // Filtro por rating
    if (filters.minRating !== undefined) {
      result = result.filter(product => product.rating >= filters.minRating!)
    }

    // Ordenamiento
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    set({ filteredProducts: result })
  }
}))