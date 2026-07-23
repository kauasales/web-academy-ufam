import React from 'react'
import Image from 'next/image'
import { Product } from '../../types/product'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { favoriteApi } from '../../services/api'
import { toast } from 'react-toastify'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const queryClient = useQueryClient()

  const { data: favorites } = useQuery<Product[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data } = await favoriteApi.get('/')
      return data
    },
  })

  const isFavorited = favorites?.some((fav) => fav.id === product.id)
  const favoriteItem = favorites?.find((fav) => fav.id === product.id)

  const addMutation = useMutation({
    mutationFn: (newFavorite: Product) => favoriteApi.post('/', newFavorite),
    onSuccess: () => {
      toast.success('Produto adicionado aos favoritos!')
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
    onError: () => {
      toast.error('Erro ao adicionar produto aos favoritos.')
    }
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => favoriteApi.delete(`/${id}`),
    onSuccess: () => {
      toast.success('Produto removido dos favoritos!')
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
    onError: () => {
      toast.error('Erro ao remover produto dos favoritos.')
    }
  })

  const handleFavoriteClick = () => {
    if (isFavorited && favoriteItem) {
      removeMutation.mutate(favoriteItem.id)
    } else {
      addMutation.mutate(product)
    }
  }

  return (
    <div className='col'>
      <div className='card shadow-sm h-100'>
        <Image
          src={product.fotos[0].src}
          className='card-img-top'
          alt={product.nome}
          width={300}
          height={320}
        />
        <div className='card-body bg-light'>
          <h5 className='card-title'>{product.nome}</h5>
          <p className='card-text text-secondary'>R$ {product.preco}</p>
          <button
            className='btn btn-dark d-block w-100 mb-2'
            type='button'
            onClick={() => onAddToCart(product)}
          >
            Adicionar no carrinho
          </button>
          <button
            className={`btn d-block w-100 ${isFavorited ? 'btn-success' : 'btn-outline-dark'}`}
            type='button'
            onClick={handleFavoriteClick}
            disabled={addMutation.isPending || removeMutation.isPending}
          >
            {isFavorited ? 'Favoritado' : addMutation.isPending ? 'Favoritando...' : 'Favoritar'}
          </button>
        </div>
      </div>
    </div>
  )
}
