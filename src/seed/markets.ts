import { getPayload } from 'payload'
import config from '@payload-config'

const need = (k: string) => {
  const v = process.env[k]
  if (!v) throw new Error(`Set ${k} (from docs/spikes/01-streamguys.md) before seeding`)
  return v
}

const payload = await getPayload({ config })
await payload.updateGlobal({
  slug: 'markets',
  data: {
    items: [
      {
        key: 'br',
        name: 'Baton Rouge',
        frequencies: [{ label: 'WPYR 1380 AM' }, { label: 'WPYR-LP 105.9 FM' }, { label: 'K286CS 105.1 FM (Downtown)' }],
        streamUrl: need('STREAM_URL_BR'),
        metadataUrl: process.env.METADATA_URL_BR || undefined,
        backupPlayerUrl: 'https://player.streamguys.com/ccr/sgplayer3/player.php?l=layout-standard',
      },
      {
        key: 'nola',
        name: 'New Orleans',
        frequencies: [{ label: '690 AM' }, { label: '101.5 FM' }],
        streamUrl: need('STREAM_URL_NOLA'),
        metadataUrl: process.env.METADATA_URL_NOLA || undefined,
        backupPlayerUrl: 'https://player.streamguys.com/ccr/sgplayer3/player.php?l=layout-standard',
      },
    ],
  },
})
console.log('Markets seeded')
process.exit(0)
