import { calculateDiscountedPrice } from '@/app/helpers'
import { Product } from '@/app/types/product'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  favorites: Product[]
  setFavorites: React.Dispatch<React.SetStateAction<Product[]>>
  showImage?: boolean
  showButton?: boolean
}

export default function ProductCard({
  product,
  favorites,
  setFavorites,
  showImage = true,
  showButton = true
}: ProductCardProps) {
  const addToFavorites = (productToAdd: Product) => {
    setFavorites((currentFavorites) => [...currentFavorites, productToAdd])
  }

  const isFavorite = favorites.some((item) => item.id === product.id)

  return (
    <div className='col'>
      <div className='card shadow-sm h-100'>
        {showImage ? (
          <Image
            src={product.fotos[0].src}
            className='card-img-top'
            alt={product.fotos[0].titulo}
            width={150}
            height={180}
          />
        ) : null}

        <div className='card-body bg-ligth'>
          <span className='badge text-bg-success text-white mb-2 '>
            {product.desconto}% de desconto
          </span>

          <h5 className='card-title fw-bold'>{product.nome}</h5>
          <span className='text-secondary'>De R$ {product.preco}</span>
          <h5 className='card-text'>
            Por R${' '}
            {calculateDiscountedPrice(Number(product.preco), product.desconto)}
          </h5>
          {showButton ? (
            <button
              className={
                isFavorite
                  ? 'btn btn-success d-block w-100'
                  : 'btn btn-secondary d-block w-100'
              }
              type='button'
              onClick={() => addToFavorites(product)}
              disabled={isFavorite}
            >
              {isFavorite ? 'Favoritado' : 'Favoritar'}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
