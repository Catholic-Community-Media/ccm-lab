import { describe, expect, it } from 'vitest'
import { normalizeMarkets, pickMarket, validateMarketItems, validateUniqueMarketKeys, type Market } from '@/lib/markets'

const br: Market = { key: 'br', name: 'Baton Rouge', frequencies: ['WPYR 1380 AM'], streamUrl: 'https://s/br', backupPlayerUrl: 'https://p/br' }
const nola: Market = { key: 'nola', name: 'New Orleans', frequencies: ['690 AM'], streamUrl: 'https://s/nola', backupPlayerUrl: 'https://p/nola' }

describe('normalizeMarkets', () => {
  it('flattens frequencies and drops incomplete rows', () => {
    const raw = {
      items: [
        { key: 'br', name: 'Baton Rouge', frequencies: [{ label: 'WPYR 1380 AM' }], streamUrl: 'https://s/br', backupPlayerUrl: 'https://p/br', metadataUrl: null, pledgePhone: null },
        { key: 'nola', name: 'New Orleans', frequencies: [], streamUrl: '', backupPlayerUrl: 'https://p/nola' },
      ],
    }
    expect(normalizeMarkets(raw)).toEqual([{ ...br, metadataUrl: undefined, pledgePhone: undefined }])
  })
  it('handles an empty or missing global', () => {
    expect(normalizeMarkets(null)).toEqual([])
    expect(normalizeMarkets({ items: null })).toEqual([])
  })
})

describe('pickMarket', () => {
  it('returns the requested market', () => {
    expect(pickMarket([br, nola], 'nola')).toBe(nola)
  })
  it('falls back to Baton Rouge, then the first market', () => {
    expect(pickMarket([nola, br], 'bogus')).toBe(br)
    expect(pickMarket([nola], null)).toBe(nola)
  })
  it('returns undefined when no markets are configured', () => {
    expect(pickMarket([], 'br')).toBeUndefined()
  })
})

describe('validateUniqueMarketKeys', () => {
  it('accepts unique keys and empty values', () => {
    expect(validateUniqueMarketKeys([{ key: 'br' }, { key: 'nola' }])).toBe(true)
    expect(validateUniqueMarketKeys(undefined)).toBe(true)
    expect(validateUniqueMarketKeys(null)).toBe(true)
  })
  it('rejects duplicate keys', () => {
    expect(validateUniqueMarketKeys([{ key: 'br' }, { key: 'br' }])).toMatch(/duplicate/i)
  })
})

describe('validateMarketItems', () => {
  const opts = { minRows: 1, maxRows: 2 }
  it('accepts one or two unique markets', () => {
    expect(validateMarketItems([{ key: 'br' }], opts)).toBe(true)
    expect(validateMarketItems([{ key: 'br' }, { key: 'nola' }], opts)).toBe(true)
  })
  it('rejects an empty or missing list (minRows)', () => {
    expect(validateMarketItems([], opts)).toMatch(/at least 1/i)
    expect(validateMarketItems(undefined, opts)).toMatch(/at least 1/i)
  })
  it('rejects too many rows and duplicate keys', () => {
    expect(validateMarketItems([{ key: 'br' }, { key: 'nola' }, { key: 'br' }], opts)).toMatch(/no more than 2/i)
    expect(validateMarketItems([{ key: 'br' }, { key: 'br' }], opts)).toMatch(/duplicate/i)
  })
})
