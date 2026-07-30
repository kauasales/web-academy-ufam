'use client'
import { useState } from 'react'
import FavoritesList from '../components/FavoritesList/FavoritesList'
import { Product } from '../types/product'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[] | []>([])

  return (
    <main>
      <div className='container p-5'>
        <FavoritesList
          favoriteProducts={favorites}
          setFavorites={setFavorites}
        />
      </div>
    </main>
  )
}
