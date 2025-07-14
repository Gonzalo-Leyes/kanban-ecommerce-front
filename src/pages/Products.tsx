import React, { useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useProductStore } from '../store/useProductStore'
import { useToast } from '../hooks/useToast'
import { fetchProducts } from '../services/productService'
import ProductFilters from '../components/ProductFilters'
import ProductCard from '../components/ProductCard'
import Pagination from '../components/ui/Pagination'
import LoadingSpinner from '../components/LoadingSpinner'

const ProductsContainer = styled.div`
  min-height: calc(100vh - 200px);
`

const ProductsHeader = styled(motion.div)`
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
    content: '🛍️';
    font-size: 28px;
  }
`

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin: 0;
  font-size: 16px;
`

const ProductsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
  
  @media (min-width: 641px) and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1025px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  color: var(--text-secondary);
`

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
`

const EmptyMessage = styled.p`
  font-size: 16px;
  margin: 0;
  max-width: 400px;
`

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
`

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`

const ErrorTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--color-danger);
  margin: 0 0 8px 0;
`

const ErrorMessage = styled.p`
  color: var(--text-secondary);
  margin: 0 0 20px 0;
`

const RetryButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--color-primary-hover);
    transform: translateY(-1px);
  }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`

const Products: React.FC = () => {
  const {
    products,
    filteredProducts,
    loading,
    error,
    filters,
    currentPage,
    itemsPerPage,
    setProducts,
    setLoading,
    setError,
    setFilters,
    setCurrentPage
  } = useProductStore()

  const { addToast } = useToast()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProducts()
        setProducts(data.products)
      } catch (err) {
        const errorMessage = 'Error al cargar los productos. Por favor, intenta nuevamente.'
        setError(errorMessage)
        addToast({
          type: 'error',
          title: 'Error de carga',
          message: errorMessage
        })
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [setProducts, setLoading, setError, addToast])

  const handleAddToCart = (productId: number) => {
    // Aquí se implementaría la lógica del carrito
    console.log('Producto agregado al carrito:', productId)
  }

  const handleRetry = () => {
    window.location.reload()
  }

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const categories = Array.from(new Set(products.map(p => p.category)))

  if (loading) {
    return (
      <ProductsContainer>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </ProductsContainer>
    )
  }

  if (error) {
    return (
      <ProductsContainer>
        <ErrorState>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Error al cargar productos</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={handleRetry}>
            Reintentar
          </RetryButton>
        </ErrorState>
      </ProductsContainer>
    )
  }

  return (
    <ProductsContainer>
      <ProductsHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <HeaderContent>
          <Title>Catálogo de Productos</Title>
          <Subtitle>
            Descubre nuestra selección de productos de alta calidad
          </Subtitle>
        </HeaderContent>
      </ProductsHeader>

      <ProductFilters
        filters={filters}
        categories={categories}
        onFiltersChange={setFilters}
        totalProducts={products.length}
        filteredCount={filteredProducts.length}
      />

      {filteredProducts.length === 0 ? (
        <EmptyState
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <EmptyIcon>🔍</EmptyIcon>
          <EmptyTitle>No se encontraron productos</EmptyTitle>
          <EmptyMessage>
            No hay productos que coincidan con los filtros aplicados.
            Intenta ajustar los criterios de búsqueda.
          </EmptyMessage>
        </EmptyState>
      ) : (
        <>
          <ProductsGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, staggerChildren: 0.1 }}
          >
            {currentProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </motion.div>
            ))}
          </ProductsGrid>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredProducts.length}
          />
        </>
      )}
    </ProductsContainer>
  )
}

export default Products