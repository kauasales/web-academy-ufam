'use client'
import { useState } from 'react'
import CartSummary from './components/CartSummary/CartSummary'
import ProductList from './components/ProductList/ProductList'
import { Product } from './types/product'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from './services/api'

export default function Products() {
  const [totalQuantity, setTotalQuantity] = useState<number>(0)
  const [totalValue, setTotalValue] = useState<number>(0)

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts
  })

  const addToCart = (product: Product) => {
    setTotalQuantity((prev) => prev + 1)
    setTotalValue((prev) => prev + Number(product.preco))
  }

  if (isLoading) return <div className='container p-5'>Carregando produtos...</div>
  if (error) return <div className='container p-5'>Erro ao carregar produtos.</div>

  return (
    <>
      <main>
        <div className='container p-5'>
          <CartSummary totalQuantity={totalQuantity} totalValue={totalValue} />

          <h5 className='mb-3'>Produtos disponíveis:</h5>

          {products && <ProductList products={products} onAddToCart={addToCart} />}
        </div>
      </main>
    </>
  )
}

