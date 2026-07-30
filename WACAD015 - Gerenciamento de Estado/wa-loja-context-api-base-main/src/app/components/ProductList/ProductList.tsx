import { Product } from '@/app/types/product'
import FavoritesSummary from '../FavoritesSummary/FavoritesSummary'
import ProductCard from '../ProductCard/ProductCard'

interface ProductListProps {
  products: Product[]
}

export default function ProductList({
  products
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
            />
          ))}
        </div>
      </div>

      <div className='col-lg-3'>
        <FavoritesSummary />
      </div>
    </div>
  )
}

