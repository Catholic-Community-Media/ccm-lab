import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { normalizeMarkets, type Market } from './markets'

export const getMarkets = cache(async (): Promise<Market[]> => {
  const payload = await getPayload({ config })
  return normalizeMarkets(await payload.findGlobal({ slug: 'markets' }))
})
