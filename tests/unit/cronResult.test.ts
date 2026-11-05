import { describe, expect, it } from 'vitest'
import { jobSucceeded } from '@/lib/cronResult'

describe('jobSucceeded', () => {
  it('true when the job status is success', () => {
    expect(jobSucceeded({ '7': { status: 'success' } }, 7)).toBe(true)
  })
  it('false on error statuses', () => {
    expect(jobSucceeded({ '7': { status: 'error' } }, 7)).toBe(false)
    expect(jobSucceeded({ '7': { status: 'error-reached-max-retries' } }, 7)).toBe(false)
  })
  it('false when the job is missing from the result or no result', () => {
    expect(jobSucceeded({ '8': { status: 'success' } }, 7)).toBe(false)
    expect(jobSucceeded(undefined, 7)).toBe(false)
  })
})
