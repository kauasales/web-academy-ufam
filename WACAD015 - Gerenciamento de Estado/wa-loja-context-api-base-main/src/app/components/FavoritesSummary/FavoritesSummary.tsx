import { Product } from '@/app/types/product'
import ProductCard from '../ProductCard/ProductCard'

interface FavoritesSummaryProps {
  favorites: Product[]
  setFavorites: React.Dispatch<React.SetStateAction<Product[]>>
}

export default function FavoritesSummary({
  favorites,
  setFavorites
}: FavoritesSummaryProps) {
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
              favorites={favorites}
              setFavorites={setFavorites}
              showImage={false}
              showButton={false}
            />
          ))
        )}
      </div>
    </>
  )
}
