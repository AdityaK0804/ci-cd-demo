import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the pipeline simulator', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'CI Pipeline Simulator' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Run Pipeline' })).toBeInTheDocument()
  })

  it('shows a passing pipeline result', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Run Pipeline' }))

    const results = screen.getByRole('region', { name: 'Pipeline results' })
    expect(results).toHaveTextContent('Overall status')
    expect(results).toHaveTextContent('passed')
    expect(results).toHaveTextContent('none')
    expect(results).not.toHaveTextContent('skipped')
  })

  it('blocks later stages when lint fails', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('checkbox', { name: 'Lint should pass' }))
    await user.click(screen.getByRole('button', { name: 'Run Pipeline' }))

    const results = screen.getByRole('region', { name: 'Pipeline results' })
    expect(results).toHaveTextContent('failed')
    expect(results).toHaveTextContent('Lint')
    expect(results).toHaveTextContent('skipped')
  })
})
