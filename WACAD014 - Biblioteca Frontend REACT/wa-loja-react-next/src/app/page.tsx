'use client'
import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import CartSummary from './components/CartSummary/CartSummary'
import ProductList from './components/ProductList/ProductList'
import { mockProducts } from './mocks/products'
import { Product } from './types/product'

export default function Products() {
  const [totalQuantity, setTotalQuantity] = useState<number>(0)
  const [totalValue, setTotalValue] = useState<number>(0)

  const addToCart = (product: Product) => {
    setTotalQuantity((prev) => prev + 1)
    setTotalValue((prev) => prev + Number(product.price))
  }

  return (
    <>
      <Navbar />

      <main>
        <div className='container p-5'>
          <CartSummary totalQuantity={totalQuantity} totalValue={totalValue} />

          <h5 className='mb-3'>Produtos disponíveis:</h5>

          <ProductList products={mockProducts} onAddToCart={addToCart} />
        </div>
      </main>
    </>
  )
}
