'use client'
import Navbar from '../components/Navbar/Navbar'
import CartSummary from '../components/CartSummary/CartSummary'
import CartList from '../components/CartList/CartList'
import { ItemCarrinho } from '../components/CartItem/CartItem'

const mockCartItems: ItemCarrinho[] = [
  { id: 'prod-1', nome: 'Monitor UltraWide 34"', precoUnitario: 2200, quantidade: 1 },
  { id: 'prod-2', nome: 'Teclado Mecânico RGB', precoUnitario: 450, quantidade: 2 },
  { id: 'prod-3', nome: 'Mouse Gamer Sem Fio', precoUnitario: 350, quantidade: 2 },
]

export default function Cart() {
  return (
    <>
      <Navbar />
      
      <main>
        <div className='container p-5'>
          <CartList items={mockCartItems} />
          <CartSummary totalQuantity={5} totalValue={3800} />
        </div>
      </main>
    </>
  )
}
