'use client'

import { calculateDiscountedPrice } from '@/app/helpers'
import { Product } from '@/app/types/product'
import { useFavoritesContext } from '@/app/context/FavoritesContext'
import Image from 'next/image'

interface FavoriteItemProps {
  favoriteItem: Product
}

export default function FavoriteItem({
  favoriteItem
}: FavoriteItemProps) {
  const { removeFavorite } = useFavoritesContext()

  return (
    <tr key={favoriteItem.id}>
      <td className='d-flex flex-row'>
        <Image
          className='rounded'
          src={favoriteItem.fotos[0].src}
          alt={favoriteItem.fotos[0].titulo}
          width={50}
          height={50}
        />
        <div className='d-flex flex-column ms-2'>
          <span className=''>{favoriteItem.nome}</span>
          <small className='text-muted'>{favoriteItem.descricao}</small>
        </div>
      </td>

      <td>
        R${' '}
        {calculateDiscountedPrice(
          Number(favoriteItem.preco),
          favoriteItem.desconto
        ).toFixed(2)}
      </td>

      <td>{favoriteItem.desconto}%</td>

      <td>
        <button
          onClick={() => removeFavorite(favoriteItem.id)}
          className='btn btn-outline-danger btn-sm'
        >
          Remover
        </button>
      </td>
    </tr>
  )
}

