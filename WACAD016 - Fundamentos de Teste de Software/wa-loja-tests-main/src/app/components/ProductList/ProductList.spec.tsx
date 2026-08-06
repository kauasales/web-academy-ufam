import { render, screen } from '@testing-library/react'
import { mockProducts } from '@/app/mocks/products'
import ProductList from './ProductList'
import { useFavoritesContext } from '../../hooks/useFavoritesContext'

jest.mock('../../hooks/useFavoritesContext', () => ({
  useFavoritesContext: jest.fn()
}))

jest.mock('../ProductCard/ProductCard', () => ({
  __esModule: true,
  default: ({ product }: { product: Product }) => <div data-testid="product-card">{product.nome}</div>
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
})