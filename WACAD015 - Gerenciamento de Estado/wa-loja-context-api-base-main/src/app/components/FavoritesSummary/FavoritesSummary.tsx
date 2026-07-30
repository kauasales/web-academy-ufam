'use client'

import { useFavoritesContext } from '@/app/context/FavoritesContext'
import ProductCard from '../ProductCard/ProductCard'

export default function FavoritesSummary() {
  const { favorites } = useFavoritesContext()
  const recentFavorites = favorites.slice(-3).reverse()

  return (
    <>
      <h5 className='mb-3 mt-4 mt-lg-0 ms-1'>Últimos favoritados:</h5>

      <div className='row row-cols-1 g-3 border rounded-1 pb-3 mt-3 bg-light ms-1'>
        {recentFavorites.length === 0 ? (
          <div>
            <p className='text-muted'>Sua lista está vazia</p>
          </div>
        ) : (
          recentFavorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showImage={false}
              showButton={false}
            />
          ))
        )}
      </div>
    </>
  )
}

