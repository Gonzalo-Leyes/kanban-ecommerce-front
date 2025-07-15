import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProductCard from '../ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    thumbnail: 'test-image.jpg',
    description: 'Test description',
    rating: 4.5,
    stock: 10,
    category: 'electronics',
    discountPercentage: 0,
    brand: 'Brand',
    images: []
  } as any;

  const mockAdd = vi.fn();

  it('renders product title', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockAdd} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('displays the correct price', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockAdd} />);
    expect(screen.getByText(/99/)).toBeInTheDocument();
  });

  it('shows the product image with alt text', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockAdd} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });
});
