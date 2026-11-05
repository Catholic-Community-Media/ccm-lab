import type { MarketKey } from '@/lib/markets'

const KEY = 'ccm.market'

export function readStoredMarket(): MarketKey | null {
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'br' || v === 'nola' ? v : null
  } catch {
    return null
  }
}

export function storeMarket(key: MarketKey): void {
  try {
    window.localStorage.setItem(KEY, key)
  } catch {
    /* private mode / blocked storage: choice just isn't remembered */
  }
}
