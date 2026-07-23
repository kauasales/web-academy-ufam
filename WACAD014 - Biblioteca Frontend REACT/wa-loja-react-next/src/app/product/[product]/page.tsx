'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../../services/api'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ProductDetail from '../../components/ProductDetail'

interface ProductDetail {
  id: string
  nome: string
  preco: string
  descricao: string
  fotos: { src: string; titulo: string }[]
  usuario_id: string
  desconto: number
  vendido: string
}

async function fetchProduct(slug: string) {
  const { data } = await productsApi.get(`/produto/${slug}`)
  return data
}

export default function ProductPage() {
  const router = useRouter()
  const { product } = useParams()
  const slug = Array.isArray(product) ? product[0] : product  

  useEffect(() => {
    if (!slug) {
      router.push('/')
    }
  }, [slug, router])

  const { data, isLoading, error } = useQuery<ProductDetail>({
    queryKey: ['product', slug],
    queryFn: () => fetchProduct(slug!),
    enabled: !!slug,
  })

  if (!slug) return null

  if (isLoading) return <div className='container mt-5'>Carregando produto...</div>
  if (error) return <div className='container mt-5'>Erro ao carregar produto.</div>
  if (!data) return <div className='container mt-5'>Produto não encontrado.</div>

  return (
    <div className='container mt-5'>
      <ProductDetail product={data} />
    </div>
  )
}