import { describe, expect, it } from 'vitest'
import { formatCount, incrementCount } from './formatCount'

describe('formatCount', () => {
  it('formats zero', () => {
    expect(formatCount(0)).toBe('Count is 0')
  })

  it('formats positive numbers', () => {
    expect(formatCount(5)).toBe('Count is 5')
  })
})

describe('incrementCount', () => {
  it('increments by one', () => {
    expect(incrementCount(0)).toBe(1)
    expect(incrementCount(10)).toBe(11)
  })
})
