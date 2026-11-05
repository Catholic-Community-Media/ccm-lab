import type { GlobalConfig } from 'payload'
import { isEditorOrAdmin } from '@/access/roles'
import { safeRevalidate } from '@/lib/revalidate'

export const Markets: GlobalConfig = {
  slug: 'markets',
  label: 'Radio markets',
  access: { read: () => true, update: isEditorOrAdmin },
  fields: [
    {
      name: 'items',
      label: 'Markets',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      admin: { initCollapsed: false },
      fields: [
        { name: 'key', type: 'select', required: true, options: [{ label: 'Baton Rouge', value: 'br' }, { label: 'New Orleans', value: 'nola' }] },
        { name: 'name', type: 'text', required: true },
        { name: 'frequencies', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
        { name: 'streamUrl', label: 'Stream URL (direct HTTPS)', type: 'text', required: true },
        { name: 'metadataUrl', label: 'Now-playing metadata URL', type: 'text' },
        { name: 'backupPlayerUrl', label: 'Backup player URL', type: 'text', required: true },
        { name: 'pledgePhone', label: 'Pledge phone number', type: 'text' },
      ],
    },
  ],
  hooks: { afterChange: [() => safeRevalidate('/')] },
}
