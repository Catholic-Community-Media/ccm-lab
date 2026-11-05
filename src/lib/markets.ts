export type MarketKey = 'br' | 'nola'
export const DEFAULT_MARKET: MarketKey = 'br'

export type Market = {
  key: MarketKey
  name: string
  frequencies: string[]
  streamUrl: string
  metadataUrl?: string
  backupPlayerUrl: string
  pledgePhone?: string
}

type RawItem = {
  key?: string | null
  name?: string | null
  frequencies?: Array<{ label?: string | null }> | null
  streamUrl?: string | null
  metadataUrl?: string | null
  backupPlayerUrl?: string | null
  pledgePhone?: string | null
}

export function validateUniqueMarketKeys(items: unknown): true | string {
  const keys = (Array.isArray(items) ? items : []).map((i) => (i as { key?: string | null } | null)?.key).filter(Boolean)
  return new Set(keys).size === keys.length ? true : 'Each market may appear only once (duplicate key).'
}

const isKey = (k: unknown): k is MarketKey => k === 'br' || k === 'nola'

export function normalizeMarkets(raw: unknown): Market[] {
  const items = (raw as { items?: RawItem[] | null } | null)?.items ?? []
  return items.flatMap((i) => {
    if (!isKey(i.key) || !i.name || !i.streamUrl || !i.backupPlayerUrl) return []
    return [
      {
        key: i.key,
        name: i.name,
        frequencies: (i.frequencies ?? []).map((f) => f.label ?? '').filter(Boolean),
        streamUrl: i.streamUrl,
        metadataUrl: i.metadataUrl || undefined,
        backupPlayerUrl: i.backupPlayerUrl,
        pledgePhone: i.pledgePhone || undefined,
      },
    ]
  })
}

export function pickMarket(markets: Market[], key: string | null | undefined): Market | undefined {
  return markets.find((m) => m.key === key) ?? markets.find((m) => m.key === DEFAULT_MARKET) ?? markets[0]
}
