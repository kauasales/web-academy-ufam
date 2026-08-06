import { render } from '@testing-library/react'
import BootstrapClient from './BootstrapClient'

// Mocka o pacote do Bootstrap
jest.mock('bootstrap/dist/js/bootstrap.bundle.min.js', () => ({
  __esModule: true,
  default: { version: '5.3.3' },
}))

describe('BootstrapClient', () => {
  it('renders nothing and loads the bootstrap bundle', () => {
    const { container } = render(<BootstrapClient />)

    expect(container).toBeEmptyDOMElement()
    expect(container.firstChild).toBeNull()

    const bootstrapModule = jest.requireMock(
      'bootstrap/dist/js/bootstrap.bundle.min.js'
    )
    expect(bootstrapModule).toBeDefined()
    expect(bootstrapModule.default).toEqual({ version: '5.3.3' })
  })
})