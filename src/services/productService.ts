import { ProductsResponse } from '../types'

const API_URL = 'https://dummyjson.com/products?limit=20'
const FALLBACK_URL = '/data/products.json'

export const fetchProducts = async (): Promise<ProductsResponse> => {
  try {
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.warn('Error fetching from API, trying local fallback:', error)
    
    try {
      const response = await fetch(FALLBACK_URL)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (fallbackError) {
      console.error('Error fetching from fallback:', fallbackError)
      throw new Error('No se pudieron cargar los productos')
    }
  }
} 