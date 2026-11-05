import type { Endpoint } from 'payload'
import { jobSucceeded } from '@/lib/cronResult'
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
    try {
      const job = await req.payload.jobs.queue({ task: task as (typeof ALLOWED_TASKS)[number], input: {} })
      const result = await req.payload.jobs.runByID({ id: job.id })
      if (!jobSucceeded(result.jobStatus, job.id)) {
        req.payload.logger.error({ task, jobId: job.id, jobStatus: result.jobStatus }, 'lab cron job failed')
        return Response.json({ ok: false, task, error: 'job failed' }, { status: 500 })
      }
    } catch (err) {
      req.payload.logger.error({ err, task }, 'lab cron failed')
      return Response.json({ ok: false, task, error: (err as Error).message ?? 'cron error' }, { status: 500 })
    }
    return Response.json({ ok: true, task })
  },
}
