import { render, screen, within } from '@testing-library/react'
import { mockProducts } from '@/app/mocks/products'
import FavoritesList from './FavoritesList'
import { useFavoriteProducts } from '../../hooks/useFavoriteProducts'
import { useFavoritesTotalValue } from '../../hooks/useFavoritesTotalValue'
import { useFavoritesContext } from '../../hooks/useFavoritesContext'

jest.mock('../../hooks/useFavoriteProducts', () => ({
  useFavoriteProducts: jest.fn()
}))

jest.mock('../../hooks/useFavoritesTotalValue', () => ({
  useFavoritesTotalValue: jest.fn()
}))

jest.mock('../../hooks/useFavoritesContext', () => ({
  useFavoritesContext: jest.fn()
}))

jest.mock('../FavoriteItem/FavoriteItem', () => ({
  __esModule: true,
  default: ({ favoriteItem }: { favoriteItem: Product }) => (
    <tr>
      <td data-testid="favorite-item">{favoriteItem.nome}</td>
    </tr>
  )
}))

const mockUseFavoriteProducts = useFavoriteProducts as jest.Mock
const mockUseFavoritesTotalValue = useFavoritesTotalValue as jest.Mock
const mockUseFavoritesContext = useFavoritesContext as jest.Mock

describe('FavoritesList', () => {
  beforeEach(() => {
    mockUseFavoritesContext.mockReturnValue({ setFavorites: jest.fn() })
  })

  it('renders the empty state when there are no favorites', () => {
    mockUseFavoriteProducts.mockReturnValue([])
    mockUseFavoritesTotalValue.mockReturnValue('0.00')

    render(<FavoritesList />)

    expect(screen.getByText('Lista de favoritos:')).toBeInTheDocument()
    expect(screen.getByText('Sua lista de favoritos está vazia.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByText('Quantidade de produtos: 0')).toBeInTheDocument()
    expect(screen.getByText('Valor total: R$ 0.00')).toBeInTheDocument()
  })

  it('renders a fallback message and no table when the list is empty even if totals are provided', () => {
    mockUseFavoriteProducts.mockReturnValue([])
    mockUseFavoritesTotalValue.mockReturnValue('125.50')

    render(<FavoritesList />)

    expect(screen.getByText('Sua lista de favoritos está vazia.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByText('Quantidade de produtos: 0')).toBeInTheDocument()
    expect(screen.getByText('Valor total: R$ 125.50')).toBeInTheDocument()
  })

  it('renders the favorites table when there are favorites', () => {
    mockUseFavoriteProducts.mockReturnValue(mockProducts.slice(0, 2))
    mockUseFavoritesTotalValue.mockReturnValue('100.00')

    render(<FavoritesList />)

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    expect(within(table).getByText('Produto')).toBeInTheDocument()
    expect(within(table).getByText('Preço')).toBeInTheDocument()
    expect(within(table).getByText('Desconto')).toBeInTheDocument()
    expect(within(table).getByText('Opções')).toBeInTheDocument()
    expect(screen.getAllByTestId('favorite-item')).toHaveLength(2)
    expect(screen.getByText('Quantidade de produtos: 2')).toBeInTheDocument()
    expect(screen.getByText('Valor total: R$ 100.00')).toBeInTheDocument()
  })

  it('renders the correct item count and total value for different favorite inputs', () => {
    mockUseFavoriteProducts.mockReturnValue(mockProducts.slice(0, 3))
    mockUseFavoritesTotalValue.mockReturnValue('3200.00')

    render(<FavoritesList />)

    expect(screen.getAllByTestId('favorite-item')).toHaveLength(3)
    expect(screen.getByText('Quantidade de produtos: 3')).toBeInTheDocument()
    expect(screen.getByText('Valor total: R$ 3200.00')).toBeInTheDocument()
  })

  it('renders the correct totals for a larger list with multiple items and different values', () => {
    const multipleFavorites = mockProducts.slice(0, 4)
    mockUseFavoriteProducts.mockReturnValue(multipleFavorites)
    mockUseFavoritesTotalValue.mockReturnValue('4899.00')

    render(<FavoritesList />)

    expect(screen.getAllByTestId('favorite-item')).toHaveLength(4)
    expect(screen.getByText('Quantidade de produtos: 4')).toBeInTheDocument()
    expect(screen.getByText('Valor total: R$ 4899.00')).toBeInTheDocument()
  })
})