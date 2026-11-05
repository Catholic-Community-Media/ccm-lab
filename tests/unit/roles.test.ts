import { describe, expect, it } from 'vitest'
import { ROLES, hasRole } from '@/access/roles'

describe('roles', () => {
  it('lists exactly the four roles', () => {
    expect(ROLES).toEqual(['admin', 'editor', 'events', 'volunteer'])
  })
  it('matches any of the given roles', () => {
    expect(hasRole({ role: 'editor' }, 'admin', 'editor')).toBe(true)
    expect(hasRole({ role: 'volunteer' }, 'admin', 'editor')).toBe(false)
  })
  it('is false for missing users or roles', () => {
    expect(hasRole(null, 'admin')).toBe(false)
    expect(hasRole(undefined, 'admin')).toBe(false)
    expect(hasRole({ role: null }, 'admin')).toBe(false)
  })
})
