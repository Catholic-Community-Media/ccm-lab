import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 3600

export default async function HomePage() {
  const payload = await getPayload({ config })
  const status = await payload.findGlobal({ slug: 'labStatus' })
  return (
    <main className="page">
      <h1>Catholic Community Media — Lab</h1>
      <p data-testid="lab-message">{status.message}</p>
      <p className="muted">
        Last heartbeat:{' '}
        <time data-testid="heartbeat">
          {status.lastHeartbeat
            ? new Date(status.lastHeartbeat).toLocaleString('en-US', { timeZone: 'America/Chicago' })
            : 'never'}
        </time>
      </p>
    </main>
  )
}
