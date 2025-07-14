import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
  padding: 20px 0;
`

const PaginationButton = styled(motion.button)<{ active?: boolean; disabled?: boolean }>`
  padding: 8px 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;
  
  ${({ active }) =>
    active &&
    `
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  `}
  
  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background-color: var(--bg-secondary);
      transform: none;
    }
  `}
  
  &:hover:not(:disabled) {
    background-color: ${({ active }) => active ? 'var(--color-primary-hover)' : 'var(--bg-tertiary)'};
    transform: translateY(-1px);
  }
`

const PaginationInfo = styled.div`
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0 16px;
`

const PaginationDots = styled.span`
  color: var(--text-muted);
  padding: 8px 4px;
`

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  totalItems: number
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}) => {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <PaginationContainer>
      <PaginationButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Anterior
      </PaginationButton>

      {visiblePages.map((page, index) => (
        page === '...' ? (
          <PaginationDots key={`dots-${index}`}>...</PaginationDots>
        ) : (
          <PaginationButton
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page as number)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {page}
          </PaginationButton>
        )
      ))}

      <PaginationButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Siguiente →
      </PaginationButton>

      <PaginationInfo>
        Mostrando {startItem}-{endItem} de {totalItems} productos
      </PaginationInfo>
    </PaginationContainer>
  )
}

export default Pagination