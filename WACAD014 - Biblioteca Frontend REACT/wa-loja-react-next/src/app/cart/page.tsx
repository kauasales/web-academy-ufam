'use client'
import { useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import CartSummary from '../components/CartSummary/CartSummary'
import CartList from '../components/CartList/CartList'
import { mockCartItems } from '../mocks/cartItems'
import { CartItems } from '../types/cart'

export default function Cart() {
  const [items, setItems] = useState<CartItems[]>(mockCartItems)

  const removeItemFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const totalQuantity = items.reduce((acc, item) => acc + item.quantidade, 0)
  const totalValue = items.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  )

  return (
    <>      
      <main>
        <div className='container p-5'>
          <CartList items={items} onRemoveItem={removeItemFromCart} />
          <CartSummary totalQuantity={totalQuantity} totalValue={totalValue} />
        </div>
      </main>
    </>
  )
}
