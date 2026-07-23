'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { favoriteApi } from '../services/api'
import { Product } from '../types/product'
import ProductList from '../components/ProductList/ProductList'

async function fetchFavorites() {
  const { data } = await favoriteApi.get('/')
  return data
}

export default function FavoritesPage() {
  const [totalQuantity, setTotalQuantity] = useState<number>(0)
  const [totalValue, setTotalValue] = useState<number>(0)

  const { data: favorites, isLoading, error } = useQuery<Product[]>({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
  })

  if (isLoading) return <div className='container mt-5'>Carregando favoritos...</div>
  if (error) return <div className='container mt-5'>Erro ao carregar favoritos.</div>

  const addToCart = (product: Product) => {
    setTotalQuantity((prev) => prev + 1)
    setTotalValue((prev) => prev + Number(product.preco))
  }

  return (
    <div className='container p-5'>
      <h5 className='mb-3'>Produtos favoritos:</h5>
          {favorites?.length === 0 ? (
            <p>Você ainda não tem favoritos.</p>
          ) : (
            favorites && <ProductList products={favorites} onAddToCart={addToCart}/>
          )}
    </div>
  )
}