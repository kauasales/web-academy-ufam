import { render, screen } from '@testing-library/react'
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

    expect(screen.getByRole('navigation')).toHaveClass(
      'navbar',
      'navbar-expand-md',
      'bg-light',
      'border-bottom',
      'border-body',
      'sticky-top'
    )
    expect(screen.getByText('Vitrine WA')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /início/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /lista de favoritos/i })).toHaveAttribute(
      'href',
      '/favorites'
    )
  })

  it('renders the mobile menu toggle button with the expected accessibility attributes', () => {
    render(<Navbar />)

    const button = screen.getByRole('button', { name: /abrir menu/i })

    expect(button).toHaveClass('navbar-toggler')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-controls', 'navbarCollapse')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-label', 'Abrir menu')
  })

  it('renders the collapse container that wraps the navigation items', () => {
    render(<Navbar />)

    const container = document.getElementById('navbarCollapse')

    expect(container).toHaveClass('collapse', 'navbar-collapse')
    expect(container).toContainElement(screen.getByRole('link', { name: /início/i }))
    expect(container).toContainElement(screen.getByRole('link', { name: /lista de favoritos/i }))
  })
})
