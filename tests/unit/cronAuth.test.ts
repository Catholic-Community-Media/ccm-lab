import { describe, expect, it } from 'vitest'
import { isCronAuthorized } from '@/lib/cronAuth'

describe('isCronAuthorized', () => {
  it('accepts the exact bearer secret', () => {
    expect(isCronAuthorized('Bearer s3cret', 's3cret')).toBe(true)
  })
  it('rejects a wrong secret', () => {
    expect(isCronAuthorized('Bearer nope', 's3cret')).toBe(false)
  })
  it('rejects a missing header', () => {
    expect(isCronAuthorized(null, 's3cret')).toBe(false)
  })
  it('fails closed when no secret is configured', () => {
    expect(isCronAuthorized('Bearer ', undefined)).toBe(false)
    expect(isCronAuthorized('Bearer ', '')).toBe(false)
  })
})
