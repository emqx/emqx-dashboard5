import type { DashboardScopes, UnsetScopes } from '@/types/systemModule'

export const UNSET_SCOPES: UnsetScopes = 'unset'

export const isUnsetScopes = (scopes: unknown): scopes is UnsetScopes => scopes === UNSET_SCOPES

export const normalizeScopes = (scopes: DashboardScopes): string[] | undefined =>
  Array.isArray(scopes) ? scopes : undefined

export const hasSelectedScopes = (scopes: DashboardScopes): scopes is string[] =>
  Array.isArray(scopes) && scopes.length > 0
