import React from 'react'
import ProductCard, { Product } from '../ProductCard/ProductCard'

interface ProductListProps {
  products: Product[]
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className='row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
