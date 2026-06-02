import type { DashboardScopes, LegacyUnsetScopes } from '@/types/systemModule'

export const LEGACY_UNSET_SCOPES = 'unset'

export const isLegacyUnsetScopes = (scopes: unknown): scopes is LegacyUnsetScopes =>
  scopes === LEGACY_UNSET_SCOPES

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
