import { calculateDiscountedPrice } from '@/app/helpers'
import { Product } from '@/app/types/product'
import FavoriteItem from '../FavoriteItem/FavoriteItem'

interface FavoritesListProps {
  favoriteProducts: Product[]
  setFavorites: React.Dispatch<React.SetStateAction<Product[]>>
}

export default function FavoritesList({
  favoriteProducts,
  setFavorites
}: FavoritesListProps) {
  const totalFavoriteValue = favoriteProducts.reduce((acc, product) => {
    return (
      acc + calculateDiscountedPrice(Number(product.preco), product.desconto)
    )
  }, 0)

  return (
    <div className='card mb-4'>
      <div className='row card-body'>
        <h5 className='card-title mb-4 fw-bold'>Lista de favoritos:</h5>

        {favoriteProducts.length > 0 ? (
          <div className='table-responsive'>
            <table className='table table-borderless'>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Preço</th>
                  <th>Desconto</th>
                  <th>Opções</th>
                </tr>
              </thead>
              <tbody>
                {favoriteProducts.map((item) => (
                  <FavoriteItem
                    key={item.id}
                    favoriteItem={item}
                    setFavorites={setFavorites}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Sua lista de favoritos está vazia.</p>
        )}
      </div>
      <div className='card-footer d-flex flex-column'>
        <small className='text-muted'>
          Quantidade de produtos: {favoriteProducts.length}
        </small>

        <small className='text-muted'>
          Valor total: R$ {totalFavoriteValue}
        </small>
      </div>
    </div>
  )
}
