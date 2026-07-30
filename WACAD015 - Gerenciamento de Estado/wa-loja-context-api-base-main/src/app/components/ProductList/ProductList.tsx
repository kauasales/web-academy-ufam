import { Product } from '@/app/types/product'
import FavoritesSummary from '../FavoritesSummary/FavoritesSummary'
import ProductCard from '../ProductCard/ProductCard'

interface ProductListProps {
  products: Product[]
  favorites: Product[]
  setFavorites: React.Dispatch<React.SetStateAction<Product[]>>
}

export default function ProductList({
  products,
  favorites,
  setFavorites
}: ProductListProps) {
  return (
    <div className='row row-cols-1 row-cols-lg-2'>
      <div className='col-lg-9'>
        <h5 className='mb-3'>Produtos disponíveis:</h5>

        <div className='row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3'>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              setFavorites={setFavorites}
              favorites={favorites}
            />
          ))}
        </div>
      </div>

      <div className='col-lg-3'>
        <FavoritesSummary favorites={favorites} setFavorites={setFavorites} />
      </div>
    </div>
  )
}
