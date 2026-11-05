export type JobStatusMap = Record<string, { status: string }> | undefined

/** Did the job we enqueued run and succeed? runByID records task failures on the job rather than throwing. */
export function jobSucceeded(jobStatus: JobStatusMap, id: number | string): boolean {
  return jobStatus?.[String(id)]?.status === 'success'
}
