import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { ProductFilters as ProductFiltersType } from '../types'

const FiltersContainer = styled(motion.div)`
  background-color: var(--bg-secondary);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  margin-bottom: 24px;
`

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: 20px;
`

const FiltersTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '🔍';
    font-size: 18px;
  }
`

const ClearButton = styled.button`
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
  }
`

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
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
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
`

const RangeGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const RangeInput = styled(Input)`
  flex: 1;
`

const RangeSeparator = styled.span`
  color: var(--text-secondary);
  font-weight: 500;
`

const SearchIcon = styled.span`
  font-size: 16px;
`

const PriceIcon = styled.span`
  font-size: 14px;
`

const CategoryIcon = styled.span`
  font-size: 14px;
`

const SortIcon = styled.span`
  font-size: 14px;
`

const RatingIcon = styled.span`
  font-size: 14px;
`

interface ProductFiltersProps {
  filters: ProductFiltersType
  categories: string[]
  onFiltersChange: (filters: ProductFiltersType) => void
  totalProducts: number
  filteredCount: number
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  categories,
  onFiltersChange,
  totalProducts,
  filteredCount
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search)

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchTerm })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, filters, onFiltersChange])

  const handleFilterChange = useCallback((key: keyof ProductFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }, [filters, onFiltersChange])

  const handleClearFilters = useCallback(() => {
    const clearedFilters: ProductFiltersType = {
      category: '',
      sortBy: 'name',
      search: '',
      minPrice: 0,
      maxPrice: 2000,
      minRating: 0
    }
    setSearchTerm('')
    onFiltersChange(clearedFilters)
  }, [onFiltersChange])

  const formatCategoryName = useCallback((category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
  }, [])

  return (
    <FiltersContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FiltersHeader>
        <FiltersTitle>Filtros</FiltersTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {filteredCount} de {totalProducts} productos
          </span>
          <ClearButton onClick={handleClearFilters}>
            Limpiar filtros
          </ClearButton>
        </div>
      </FiltersHeader>
      
      <FiltersGrid>
        {/* Búsqueda */}
        <FilterGroup>
          <Label htmlFor="search">
            <SearchIcon>🔍</SearchIcon>
            Buscar productos
          </Label>
          <Input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, descripción o marca..."
          />
        </FilterGroup>

        {/* Categoría */}
        <FilterGroup>
          <Label htmlFor="category">
            <CategoryIcon>📂</CategoryIcon>
            Categoría
          </Label>
          <Select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {formatCategoryName(category)}
              </option>
            ))}
          </Select>
        </FilterGroup>

        {/* Rango de precios */}
        <FilterGroup>
          <Label>
            <PriceIcon>💰</PriceIcon>
            Rango de precios
          </Label>
          <RangeGroup>
            <RangeInput
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', Number(e.target.value) || 0)}
              placeholder="Mín"
              min="0"
            />
            <RangeSeparator>-</RangeSeparator>
            <RangeInput
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value) || 2000)}
              placeholder="Máx"
              min="0"
            />
          </RangeGroup>
        </FilterGroup>

        {/* Rating mínimo */}
        <FilterGroup>
          <Label htmlFor="rating">
            <RatingIcon>⭐</RatingIcon>
            Rating mínimo
          </Label>
          <Select
            id="rating"
            value={filters.minRating || 0}
            onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
          >
            <option value={0}>Cualquier rating</option>
            <option value={1}>⭐ 1+ estrellas</option>
            <option value={2}>⭐⭐ 2+ estrellas</option>
            <option value={3}>⭐⭐⭐ 3+ estrellas</option>
            <option value={4}>⭐⭐⭐⭐ 4+ estrellas</option>
            <option value={4.5}>⭐⭐⭐⭐⭐ 4.5+ estrellas</option>
          </Select>
        </FilterGroup>

        {/* Ordenamiento */}
        <FilterGroup>
          <Label htmlFor="sort">
            <SortIcon>🔄</SortIcon>
            Ordenar por
          </Label>
          <Select
            id="sort"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value as ProductFiltersType['sortBy'])}
          >
            <option value="name">Nombre (A-Z)</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating">Rating: Mayor a Menor</option>
          </Select>
        </FilterGroup>
      </FiltersGrid>
    </FiltersContainer>
  )
}

export default ProductFilters