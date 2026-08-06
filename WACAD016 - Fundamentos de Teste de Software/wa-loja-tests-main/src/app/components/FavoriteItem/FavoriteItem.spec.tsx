import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockProducts } from '@/app/mocks/products'
import FavoriteItem from './FavoriteItem'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt={alt} {...props} />
  )
}))

describe('FavoriteItem', () => {
  it('renders product details and the remove button', () => {
    const product = mockProducts[0]
    const setFavorites = jest.fn()

    render(
      <table>
        <tbody>
          <FavoriteItem favoriteItem={product} setFavorites={setFavorites} />
        </tbody>
      </table>
    )

    expect(screen.getByText(product.nome)).toBeInTheDocument()
    expect(screen.getByText(product.descricao)).toBeInTheDocument()
    expect(screen.getByAltText(product.fotos[0].titulo)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /remover/i })).toBeInTheDocument()
  })

  it('calls setFavorites with the filtered list when removing an item', async () => {
    const product = mockProducts[0]
    const setFavorites = jest.fn()
    const user = userEvent.setup()

    render(
      <table>
        <tbody>
          <FavoriteItem favoriteItem={product} setFavorites={setFavorites} />
        </tbody>
      </table>
    )

    await user.click(screen.getByRole('button', { name: /remover/i }))

    expect(setFavorites).toHaveBeenCalledTimes(1)
    const updater = setFavorites.mock.calls[0][0]
    expect(typeof updater).toBe('function')

    const currentFavorites = [product]
    expect(updater(currentFavorites)).toEqual([])
  })
})