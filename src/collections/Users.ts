import type { CollectionConfig } from 'payload'
import { ROLES, adminFieldOnly, hasRole, isAdmin } from '@/access/roles'

const selfOrAdmin = ({ req }: { req: { user?: unknown } }) => {
  const user = req.user as { id?: number | string; role?: string } | undefined
  if (!user) return false
  if (hasRole(user, 'admin')) return true
  return { id: { equals: user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', defaultColumns: ['name', 'email', 'role'] },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30,
    maxLoginAttempts: 10,
    lockTime: 10 * 60 * 1000,
    cookies: { secure: process.env.NODE_ENV === 'production' },
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: selfOrAdmin,
    update: selfOrAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // The very first account (created via Payload's create-first-user screen) becomes admin.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
          if (totalDocs === 0) return { ...data, role: 'admin' }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: ROLES.map((r) => ({ label: r[0].toUpperCase() + r.slice(1), value: r })),
      access: { create: adminFieldOnly, update: adminFieldOnly },
    },
  ],
}
