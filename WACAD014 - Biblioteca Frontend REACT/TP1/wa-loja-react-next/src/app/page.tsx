'use client'
import Navbar from './components/Navbar/Navbar'
import CartSummary from './components/CartSummary/CartSummary'
import ProductList from './components/ProductList/ProductList'
import { Product } from './components/ProductCard/ProductCard'

const mockProducts: Product[] = [
  { id: '1', nome: 'Notebook Pro', preco: 5499, fotos: ['/placeholder.png'] },
  { id: '2', nome: 'Smartphone Premium', preco: 4399, fotos: ['/placeholder.png'] },
  { id: '3', nome: 'Smartwatch Sport', preco: 1899, fotos: ['/placeholder.png'] },
  { id: '4', nome: 'Fone Bluetooth ANC', preco: 999, fotos: ['/placeholder.png'] },
]

export default function Products() {
  return (
    <>
      <Navbar />

      <main>
        <div className='container p-5'>
          <CartSummary totalQuantity={3} totalValue={1350} />

          <h5 className='mb-3'>Produtos disponíveis:</h5>

          <ProductList products={mockProducts} />
        </div>
      </main>
    </>
  )
}
