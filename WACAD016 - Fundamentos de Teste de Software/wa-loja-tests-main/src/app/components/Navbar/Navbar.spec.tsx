import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import Navbar from './Navbar'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    children: ReactNode
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}))

describe('Navbar', () => {
  it('renders the brand and navigation links', () => {
    render(<Navbar />)

    const navigation = screen.getByRole('navigation')
    const homeLink = screen.getByRole('link', { name: /início/i })
    const favoritesLink = screen.getByRole('link', { name: /lista de favoritos/i })

    expect(navigation).toHaveClass(
      'navbar',
      'navbar-expand-md',
      'bg-light',
      'border-bottom',
      'border-body',
      'sticky-top'
    )
    expect(screen.getByText('Vitrine WA')).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
    expect(homeLink).toHaveAccessibleName('Início')
    expect(favoritesLink).toHaveAttribute('href', '/favorites')
    expect(favoritesLink).toHaveAccessibleName('Lista de Favoritos')
  })

  it('renders the mobile menu toggle button with the expected accessibility attributes', () => {
    render(<Navbar />)

    const button = screen.getByRole('button', { name: /abrir menu/i })

    expect(button).toHaveClass('navbar-toggler')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-controls', 'navbarCollapse')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-label', 'Abrir menu')
    expect(button).toHaveAccessibleName('Abrir menu')
  })

  it('renders the collapse container that wraps the navigation items', () => {
    render(<Navbar />)

    const container = document.getElementById('navbarCollapse')

    expect(container).toHaveClass('collapse', 'navbar-collapse')
    expect(container).toContainElement(screen.getByRole('link', { name: /início/i }))
    expect(container).toContainElement(screen.getByRole('link', { name: /lista de favoritos/i }))
  })

  it('renders the mobile menu button and responds to a click without breaking accessibility', async () => {
    render(<Navbar />)

    const button = screen.getByRole('button', { name: /abrir menu/i })

    expect(button).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(button)

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-controls', 'navbarCollapse')
  })
})
