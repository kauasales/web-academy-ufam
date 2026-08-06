import { render, screen } from '@testing-library/react'
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
    expect(screen.getByText('Quantidade de produtos: 0')).toBeInTheDocument()
    expect(screen.getByText('Valor total: R$ 0.00')).toBeInTheDocument()
  })

  it('renders the favorites table when there are favorites', () => {
    mockUseFavoriteProducts.mockReturnValue(mockProducts.slice(0, 2))
    mockUseFavoritesTotalValue.mockReturnValue('100.00')

    render(<FavoritesList />)

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Produto')).toBeInTheDocument()
    expect(screen.getByText('Preço')).toBeInTheDocument()
    expect(screen.getByText('Desconto')).toBeInTheDocument()
    expect(screen.getByText('Opções')).toBeInTheDocument()
    expect(screen.getAllByTestId('favorite-item')).toHaveLength(2)
    expect(screen.getByText('Quantidade de produtos: 2')).toBeInTheDocument()
    expect(screen.getByText('Valor total: R$ 100.00')).toBeInTheDocument()
  })
})