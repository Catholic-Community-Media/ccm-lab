import type { Access, FieldAccess } from 'payload'

export const ROLES = ['admin', 'editor', 'events', 'volunteer'] as const
export type Role = (typeof ROLES)[number]

type MaybeUser = { role?: Role | string | null } | null | undefined

export function hasRole(user: MaybeUser, ...roles: Role[]): boolean {
  return !!user?.role && (roles as string[]).includes(user.role)
}

export const isAdmin: Access = ({ req }) => hasRole(req.user as MaybeUser, 'admin')
export const isEditorOrAdmin: Access = ({ req }) => hasRole(req.user as MaybeUser, 'admin', 'editor')
export const isLoggedIn: Access = ({ req }) => !!req.user
export const adminFieldOnly: FieldAccess = ({ req }) => hasRole(req.user as MaybeUser, 'admin')
