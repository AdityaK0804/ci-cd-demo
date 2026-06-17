import { describe, expect, it } from 'vitest'
import { runPipeline } from './pipeline'

describe('runPipeline', () => {
  it('passes all stages when every outcome succeeds', () => {
    const result = runPipeline({ Lint: true, Tests: true, Build: true })

    expect(result.overallStatus).toBe('passed')
    expect(result.blockedStage).toBeNull()
    expect(result.stageResults).toEqual([
      { stage: 'Lint', status: 'passed' },
      { stage: 'Tests', status: 'passed' },
      { stage: 'Build', status: 'passed' },
    ])
  })

  it('skips remaining stages when lint fails', () => {
    const result = runPipeline({ Lint: false, Tests: true, Build: true })

    expect(result.overallStatus).toBe('failed')
    expect(result.blockedStage).toBe('Lint')
    expect(result.stageResults).toEqual([
      { stage: 'Lint', status: 'failed' },
      { stage: 'Tests', status: 'skipped' },
      { stage: 'Build', status: 'skipped' },
    ])
  })

  it('skips build when tests fail', () => {
    const result = runPipeline({ Lint: true, Tests: false, Build: true })

    expect(result.overallStatus).toBe('failed')
    expect(result.blockedStage).toBe('Tests')
    expect(result.stageResults).toEqual([
      { stage: 'Lint', status: 'passed' },
      { stage: 'Tests', status: 'failed' },
      { stage: 'Build', status: 'skipped' },
    ])
  })

  it('fails on build without skipping earlier stages', () => {
    const result = runPipeline({ Lint: true, Tests: true, Build: false })

    expect(result.overallStatus).toBe('failed')
    expect(result.blockedStage).toBe('Build')
    expect(result.stageResults).toEqual([
      { stage: 'Lint', status: 'passed' },
      { stage: 'Tests', status: 'passed' },
      { stage: 'Build', status: 'failed' },
    ])
  })
})
