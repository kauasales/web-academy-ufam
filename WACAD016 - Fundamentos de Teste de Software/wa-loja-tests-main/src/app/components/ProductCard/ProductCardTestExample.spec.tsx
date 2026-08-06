import { calculatePriceWithDiscount } from '@/app/helpers'
import { useIsProductFavorite } from '@/app/hooks/useIsProductFavorite'
import { mockProducts } from '@/app/mocks/products'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FavoritesProvider } from '../../State/FavoritesProvider'
import ProductCard from './ProductCard'

jest.mock('../../hooks/useIsProductFavorite', () => ({
  useIsProductFavorite: jest.fn()
}))

describe('ProductCard', () => {
  it('should render product information correctly', () => {
    const useIsProductFavoriteMock = useIsProductFavorite as jest.Mock
    useIsProductFavoriteMock.mockReturnValue(false)

    const mockedProduct = mockProducts[0]
    const { nome, preco, fotos, desconto } = mockedProduct

    const priceWithDiscount = calculatePriceWithDiscount(
      Number(mockedProduct.preco),
      mockedProduct.desconto
    )

    render(
      <FavoritesProvider>
        <ProductCard product={mockedProduct} setFavorites={() => {}} />
      </FavoritesProvider>
    )

    expect(screen.getByText(`${desconto}% de desconto`)).toBeInTheDocument()
    expect(screen.getByText(nome)).toBeInTheDocument()
    expect(screen.getByText(`De R$ ${preco}`)).toBeInTheDocument()
    expect(screen.getByText(`Por R$ ${priceWithDiscount}`)).toBeInTheDocument()
    expect(screen.getByAltText(fotos[0].titulo)).toBeInTheDocument()
  })

  it('should allow clicking the add to favorites button', async () => {
    const setFavorites = jest.fn()
    const useIsProductFavoriteMock = useIsProductFavorite as jest.Mock
    useIsProductFavoriteMock.mockReturnValue(false)

    render(
      <FavoritesProvider>
        <ProductCard product={mockProducts[0]} setFavorites={setFavorites} />
      </FavoritesProvider>
    )

    const button = screen.getByRole('button', {
      name: /Adicionar aos favoritos/i
    })

    await userEvent.click(button)

    expect(setFavorites).toHaveBeenCalledTimes(1)
  })

  it('should not allow clicking the add to favorites button when already favorited', async () => {
    const setFavorites = jest.fn()
    const useIsProductFavoriteMock = useIsProductFavorite as jest.Mock
    useIsProductFavoriteMock.mockReturnValue(true)

    render(
      <FavoritesProvider>
        <ProductCard product={mockProducts[0]} setFavorites={setFavorites} />
      </FavoritesProvider>
    )

    const button = screen.getByRole('button', {
      name: /Adicionado/i
    })

    await userEvent.click(button)

    expect(setFavorites).not.toHaveBeenCalled()
  })
})
