import React from 'react'
import ProductCard from '../ProductCard/ProductCard'
import { Product } from '../../types/product'

interface ProductListProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

export default function ProductList({ products, onAddToCart }: ProductListProps) {
  return (
    <div className='row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  )
}
