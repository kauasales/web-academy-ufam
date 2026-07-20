import React from 'react'
import CartItem from '../CartItem/CartItem'
import { CartItems } from '../../types/cart'

interface CartListProps {
  items: CartItems[]
  onRemoveItem: (id: string) => void
}

export default function CartList({ items, onRemoveItem }: CartListProps) {
  return (
    <div className='card mb-4'>
      <div className='row card-body'>
        <h5 className='card-title mb-4 fw-light'>
          Produtos selecionados
        </h5>
        <div className='table-responsive'>
          <table className='table '>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Valor Unitário</th>
                <th>Quantidade</th>
                <th>Valor Total</th>
                <th>Opções</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <CartItem key={item.id} item={item} onRemoveItem={onRemoveItem} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
