import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the heading and counter button', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Get started' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Count is 0' })).toBeInTheDocument()
  })

  it('increments the counter when clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Count is 0' }))

    expect(screen.getByRole('button', { name: 'Count is 1' })).toBeInTheDocument()
  })
})
