import { render, screen } from '@testing-library/react'
import { mockProducts } from '@/app/mocks/products'
import ProductList from './ProductList'
import { useFavoritesContext } from '../../hooks/useFavoritesContext'

jest.mock('../../hooks/useFavoritesContext', () => ({
  useFavoritesContext: jest.fn()
}))

jest.mock('../ProductCard/ProductCard', () => ({
  __esModule: true,
  default: ({
    product,
    setFavorites
  }: {
    product: Product
    setFavorites: React.Dispatch<React.SetStateAction<Product[]>>
  }) => (
    <div
      data-testid="product-card"
      data-has-set-favorites={typeof setFavorites === 'function' ? 'true' : 'false'}
    >
      {product.nome}
    </div>
  )
}))

const mockUseFavoritesContext = useFavoritesContext as jest.Mock

describe('ProductList', () => {
  it('renders the title and one card per product', () => {
    mockUseFavoritesContext.mockReturnValue({ setFavorites: jest.fn() })

    render(<ProductList products={mockProducts.slice(0, 3)} />)

    expect(screen.getByText('Produtos disponíveis:')).toBeInTheDocument()
    expect(screen.getAllByTestId('product-card')).toHaveLength(3)
    expect(screen.getByText('Notebook')).toBeInTheDocument()
    expect(screen.getByText('Smartphone')).toBeInTheDocument()
    expect(screen.getByText('Câmera')).toBeInTheDocument()
  })

  it('passes the favorites setter from the context to each rendered product card', () => {
    const setFavorites = jest.fn()
    mockUseFavoritesContext.mockReturnValue({ setFavorites })

    render(<ProductList products={mockProducts.slice(0, 2)} />)

    const cards = screen.getAllByTestId('product-card')

    expect(cards).toHaveLength(2)
    cards.forEach((card) => {
      expect(card).toHaveAttribute('data-has-set-favorites', 'true')
    })
  })
})