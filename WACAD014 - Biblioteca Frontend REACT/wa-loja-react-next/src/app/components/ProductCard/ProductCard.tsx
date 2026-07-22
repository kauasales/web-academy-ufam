import React from 'react'
import Image from 'next/image'
import { Product } from '../../types/product'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
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
            className='btn btn-dark d-block w-100'
            type='button'
            onClick={() => onAddToCart(product)}
          >
            Adicionar no carrinho
          </button>
        </div>
      </div>
    </div>
  )
}
