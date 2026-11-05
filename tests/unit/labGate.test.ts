import { describe, expect, it } from 'vitest'
import { isExemptPath, isLabAuthorized, passcodeToken, safeNextPath } from '@/lib/labGate'

describe('passcodeToken', () => {
  it('is stable and case/whitespace-insensitive', async () => {
    expect(await passcodeToken('  Ave Maria ')).toBe(await passcodeToken('ave maria'))
  })
  it('differs for different passcodes', async () => {
    expect(await passcodeToken('a')).not.toBe(await passcodeToken('b'))
  })
})

describe('isLabAuthorized', () => {
  it('accepts the token of the configured passcode', async () => {
    expect(await isLabAuthorized(await passcodeToken('pass'), 'pass')).toBe(true)
  })
  it('rejects a missing or wrong cookie', async () => {
    expect(await isLabAuthorized(undefined, 'pass')).toBe(false)
    expect(await isLabAuthorized('garbage', 'pass')).toBe(false)
  })
  it('fails closed when no passcode is configured', async () => {
    expect(await isLabAuthorized(await passcodeToken(''), undefined)).toBe(false)
    expect(await isLabAuthorized(await passcodeToken(''), '')).toBe(false)
  })
})

describe('isExemptPath', () => {
  it.each(['/admin', '/admin/collections/users', '/api/users/me', '/_next/static/x.js', '/lab-access', '/lab-access/submit', '/robots.txt', '/favicon.ico', '/test-fixtures/tone.mp3'])(
    'exempts %s',
    (p) => expect(isExemptPath(p)).toBe(true),
  )
  it.each(['/', '/listen', '/player', '/administrator'])('gates %s', (p) => expect(isExemptPath(p)).toBe(false))
})

describe('safeNextPath', () => {
  it('keeps same-site paths', () => {
    expect(safeNextPath('/listen?x=1')).toBe('/listen?x=1')
  })
  it('rejects external or protocol-relative targets', () => {
    expect(safeNextPath('https://evil.example')).toBe('/')
    expect(safeNextPath('//evil.example')).toBe('/')
    expect(safeNextPath('/\\evil.example')).toBe('/')
    expect(safeNextPath(null)).toBe('/')
  })
})
