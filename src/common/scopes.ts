import type { DashboardScopes, UnsetScopes } from '@/types/systemModule'

export const UNSET_SCOPES: UnsetScopes = 'unset'
export const LEGACY_UNSET_SCOPES = UNSET_SCOPES

export const isUnsetScopes = (scopes: unknown): scopes is UnsetScopes => scopes === UNSET_SCOPES

export const isLegacyUnsetScopes = isUnsetScopes

export const normalizeScopes = (scopes: DashboardScopes): string[] | undefined =>
  Array.isArray(scopes) ? scopes : undefined

export const hasSelectedScopes = (scopes: DashboardScopes): scopes is string[] =>
  Array.isArray(scopes) && scopes.length > 0

export const sanitizeScopesForSubmit = <T extends { scopes?: DashboardScopes }>(data: T): T => {
  if (!Array.isArray(data.scopes) || data.scopes.length === 0) {
    delete data.scopes
  }
  return data
}
