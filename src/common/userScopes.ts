import type { DashboardScopes } from '@/types/systemModule'

// The 5.10 user API cannot reset an explicit policy. Omitting scopes on PUT
// preserves the stored policy; it is only safe when that policy is already
// implicit or matches the selected role's defaults.
export const canPreserveRoleDefaultScopes = (
  storedScopes: DashboardScopes,
  roleDefaults: string[],
): boolean => {
  if (storedScopes == null || storedScopes === 'unset') {
    return true
  }
  const defaults = new Set(roleDefaults)
  const stored = new Set(storedScopes)
  return (
    defaults.size > 0 &&
    stored.size === defaults.size &&
    [...stored].every((scope) => defaults.has(scope))
  )
}

export const buildUserScopesPayload = ({
  useRoleDefault,
  scopes,
  editing,
  storedScopes,
  roleDefaults,
}: {
  useRoleDefault: boolean
  scopes: DashboardScopes
  editing: boolean
  storedScopes: DashboardScopes
  roleDefaults: string[]
}): { scopes?: string[] } => {
  if (useRoleDefault) {
    if (editing && !canPreserveRoleDefaultScopes(storedScopes, roleDefaults)) {
      throw new Error('Cannot reset explicit user scopes on this server')
    }
    return {}
  }
  return { scopes: Array.isArray(scopes) ? [...scopes] : [] }
}
