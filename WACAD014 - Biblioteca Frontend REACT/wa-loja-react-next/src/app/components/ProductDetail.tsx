import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '../types/product'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { favoriteApi } from '../services/api'
import { toast } from 'react-toastify'

interface ProductDetailProps {
  product: {
    id: string
    nome: string
    preco: string
    descricao: string
    fotos: { src: string; titulo: string }[]
    usuario_id: string
    desconto: number
    vendido: string
  }
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter()
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
    <div className='row'>
      <div className='col-md-6'>
        <div className='row g-2'>
          {product.fotos?.map((foto, index) => (
            <div key={index} className='col-6'>
              <Image
                src={foto.src}
                alt={`${product.nome} - ${index + 1}`}
                width={300}
                height={300}
                className='img-fluid rounded'
              />
            </div>
          ))}
        </div>
      </div>
      <div className='col-md-6'>
        <h1>{product.nome}</h1>
        <p className='fs-3 text-secondary'>R$ {product.preco}</p>
        <p className='lead'>{product.descricao}</p>
        <p className='text-muted'>Anunciado por: {product.usuario_id}</p>
        <div className='d-flex gap-3 mt-3'>
          <button className='btn btn-dark btn-lg flex-fill'>Adicionar ao Carrinho</button>
          <button
              className={`btn btn-lg flex-fill ${isFavorited ? 'btn-success' : 'btn-outline-dark'}`}
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
