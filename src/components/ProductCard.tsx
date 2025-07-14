import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Product } from '../types'
import { useToast } from '../hooks/useToast'

const Card = styled(motion.article)`
  background-color: var(--bg-secondary);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: var(--color-primary);
  }
`

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  background-color: var(--bg-tertiary);
  overflow: hidden;
`

const ProductImage = styled.img<{ loading: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  opacity: ${({ loading }) => loading ? 0 : 1};
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`

const ImageSkeleton = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-primary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`

const DiscountBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: var(--color-danger);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  z-index: 1;
`

const CardContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ProductTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const ProductDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0;
`

const Price = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
`

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const Stars = styled.div`
  display: flex;
  gap: 1px;
`

const RatingText = styled.span`
  font-size: 12px;
  color: var(--text-secondary);
`

const ProductMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
`

const Brand = styled.span`
  font-weight: 500;
`

const Stock = styled.span<{ lowStock: boolean }>`
  color: ${({ lowStock }) => lowStock ? 'var(--color-danger)' : 'var(--text-secondary)'};
  font-weight: ${({ lowStock }) => lowStock ? '600' : '400'};
`

const AddToCartButton = styled(motion.button)<{ disabled: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  ${({ disabled }) =>
    disabled
      ? `
        background-color: var(--bg-tertiary);
        color: var(--text-muted);
      `
      : `
        background-color: var(--color-primary);
        color: white;
        
        &:hover {
          background-color: var(--color-primary-hover);
          transform: translateY(-1px);
        }
        
        &:active {
          transform: translateY(0);
        }
      `}
`

const ErrorState = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 12px;
  text-align: center;
  padding: 20px;
`

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: number) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const { addToast } = useToast()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i}>⭐</span>)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i}>⭐</span>)
      } else {
        stars.push(<span key={i} style={{ opacity: 0.3 }}>⭐</span>)
      }
    }

    return stars
  }

  const handleAddToCart = () => {
    onAddToCart(product.id)
    addToast({
      type: 'success',
      title: 'Producto agregado',
      message: `${product.title} se agregó al carrito`
    })
  }

  const isLowStock = product.stock <= 10
  const isOutOfStock = product.stock === 0

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <ImageContainer>
        {imageLoading && <ImageSkeleton />}
        {!imageError ? (
          <ProductImage
            src={product.thumbnail}
            alt={product.title}
            loading={imageLoading}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false)
              setImageError(true)
            }}
          />
        ) : (
          <ErrorState>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📷</div>
            <div>Imagen no disponible</div>
          </ErrorState>
        )}
        
        {product.discountPercentage > 0 && (
          <DiscountBadge>
            -{Math.round(product.discountPercentage)}%
          </DiscountBadge>
        )}
      </ImageContainer>

      <CardContent>
        <ProductTitle>{product.title}</ProductTitle>
        <ProductDescription>{product.description}</ProductDescription>
        
        <ProductMeta>
          <Brand>Marca: {product.brand}</Brand>
          <Stock lowStock={isLowStock}>
            Stock: {product.stock}
            {isLowStock && !isOutOfStock && ' (Poco stock)'}
          </Stock>
        </ProductMeta>

        <PriceSection>
          <Price>{formatPrice(product.price)}</Price>
          <Rating>
            <Stars>{renderStars(product.rating)}</Stars>
            <RatingText>({product.rating.toFixed(1)})</RatingText>
          </Rating>
        </PriceSection>

        <AddToCartButton
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          whileTap={{ scale: 0.95 }}
        >
          <span>🛒</span>
          {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </AddToCartButton>
      </CardContent>
    </Card>
  )
}

export default ProductCard