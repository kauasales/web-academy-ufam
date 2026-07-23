import React from 'react'
import { CartItems } from '../../types/cart'

interface CartItemProps {
  item: CartItems
  onRemoveItem: (id: string) => void
}

export default function CartItem({ item, onRemoveItem }: CartItemProps) {
  const getProductTotal = (price: number, quantity: number): number =>
    price * quantity

  return (
    <tr>
      <td>{item.name}</td>
      <td>R$ {item.price.toFixed(2)}</td>
      <td>{item.quantity}</td>
      <td>R$ {getProductTotal(item.price, item.quantity).toFixed(2)}</td>
      <td>
        <button
          className='btn btn-danger btn-sm'
          onClick={() => onRemoveItem(item.id)}
        >
          Remover
        </button>
      </td>
    </tr>
  )
}
