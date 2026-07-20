import React from 'react'
import Image from 'next/image'

export interface Product {
  id: string
  nome: string
  preco: number
  fotos: string[]
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className='col'>
      <div className='card shadow-sm h-100'>
        <Image
          src={product.fotos[0]}
          className='card-img-top'
          alt={product.nome}
          width={300}
          height={320}
        />
        <div className='card-body bg-light'>
          <h5 className='card-title'>{product.nome}</h5>
          <p className='card-text text-secondary'>R$ {product.preco}</p>
          <button className='btn btn-dark d-block w-100' type='button'>
            Adicionar no carrinho
          </button>
        </div>
      </div>
    </div>
  )
}
