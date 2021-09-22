import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the name of the company', () => {
  render(<App />)
  const linkElement = screen.getByText(/Air up/i)
  expect(linkElement).toBeInTheDocument()
})
