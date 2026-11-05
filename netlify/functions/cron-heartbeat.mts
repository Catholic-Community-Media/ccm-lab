import type { Config } from '@netlify/functions'

export default async () => {
  const res = await fetch(`${process.env.URL}/api/lab/cron?task=heartbeat`, {
    method: 'POST',
    headers: { authorization: `Bearer ${process.env.JOBS_SECRET}` },
  })
  console.log('[cron-heartbeat]', res.status, await res.text())
}

export const config: Config = { schedule: '*/30 * * * *' }
