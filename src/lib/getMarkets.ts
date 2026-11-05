import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { normalizeMarkets, type Market } from './markets'

export async function getMarkets(): Promise<Market[]> {
  const payload = await getPayload({ config })
  return normalizeMarkets(await payload.findGlobal({ slug: 'markets' }))
}
