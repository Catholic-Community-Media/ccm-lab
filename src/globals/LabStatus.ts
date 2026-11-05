import type { GlobalConfig } from 'payload'
import { isEditorOrAdmin } from '@/access/roles'
import { safeRevalidate } from '@/lib/revalidate'

export const LabStatus: GlobalConfig = {
  slug: 'labStatus',
  label: 'Lab status',
  access: { read: () => true, update: isEditorOrAdmin },
  fields: [
    { name: 'message', type: 'text', defaultValue: 'Welcome to the CCM lab.' },
    { name: 'lastHeartbeat', type: 'date', admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
  ],
  hooks: { afterChange: [() => safeRevalidate('/')] },
}
