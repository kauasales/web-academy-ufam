import React from 'react'

interface CartSummaryProps {
  totalQuantity: number
  totalValue: number
}

export default function CartSummary({ totalQuantity, totalValue }: CartSummaryProps) {
  return (
    <div className='card mb-4'>
      <div className='card-body'>
        <h5 className='card-title mb-4 fw-light'>Resumo do Carrinho</h5>
        <p className='card-text fw-medium'>Quantidade total: {totalQuantity}</p>
        <p className='card-text fw-medium'>
          Valor total: R${totalValue.toFixed(2)}
        </p>
      </div>
    </div>
  )
}
