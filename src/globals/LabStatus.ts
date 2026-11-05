import type { GlobalConfig } from 'payload'
import { safeRevalidate } from '@/lib/revalidate'

export const LabStatus: GlobalConfig = {
  slug: 'labStatus',
  label: 'Lab status',
  access: { read: () => true, update: ({ req }) => !!req.user },
  fields: [
    { name: 'message', type: 'text', defaultValue: 'Welcome to the CCM lab.' },
    { name: 'lastHeartbeat', type: 'date', admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
  ],
  hooks: { afterChange: [() => safeRevalidate('/')] },
}
