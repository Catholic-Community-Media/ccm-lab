import type { TaskConfig } from 'payload'
import { safeRevalidate } from '@/lib/revalidate'

export const heartbeatTask: TaskConfig<'heartbeat'> = {
  slug: 'heartbeat',
  handler: async ({ req }) => {
    await req.payload.updateGlobal({
      slug: 'labStatus',
      data: { lastHeartbeat: new Date().toISOString() },
      req,
    })
    safeRevalidate('/')
    return { output: {} }
  },
}
