import React from 'react'

export interface ItemCarrinho {
  id: string
  nome: string
  precoUnitario: number
  quantidade: number
}

interface CartItemProps {
  item: ItemCarrinho
}

export default function CartItem({ item }: CartItemProps) {
  const getProductTotal = (price: number, quantity: number): number =>
    price * quantity

  return (
    <tr>
      <td>{item.nome}</td>
      <td>R$ {item.precoUnitario.toFixed(2)}</td>
      <td>{item.quantidade}</td>
      <td>R$ {getProductTotal(item.precoUnitario, item.quantidade).toFixed(2)}</td>
      <td>
        <button className='btn btn-danger btn-sm'>
          Remover
        </button>
      </td>
    </tr>
  )
}
