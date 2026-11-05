import type { Endpoint } from 'payload'
import { ALLOWED_TASKS, isCronAuthorized } from '@/lib/cronAuth'

export const cronEndpoint: Endpoint = {
  path: '/lab/cron',
  method: 'post',
  handler: async (req) => {
    if (!isCronAuthorized(req.headers.get('authorization'), process.env.JOBS_SECRET)) {
      return Response.json({ error: 'unauthorized' }, { status: 401 })
    }
    const task = new URL(req.url ?? '', 'http://localhost').searchParams.get('task') ?? 'heartbeat'
    if (!(ALLOWED_TASKS as readonly string[]).includes(task)) {
      return Response.json({ error: `unknown task ${task}` }, { status: 400 })
    }
    await req.payload.jobs.queue({ task: task as (typeof ALLOWED_TASKS)[number], input: {} })
    await req.payload.jobs.run()
    return Response.json({ ok: true, task })
  },
}
