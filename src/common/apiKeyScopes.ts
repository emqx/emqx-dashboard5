import type { DashboardScopes } from '@/types/systemModule'

export enum APIKeyScopeMode {
  RoleDefault = 'role_default',
  System = 'system',
  Custom = 'custom',
}

// EMQX 6.1: NS_ADMIN_COMMON_SCOPES in emqx_api_key_scopes.hrl.
// Login-only scopes are excluded even though the namespace role allows some of them.
export const NAMESPACED_API_KEY_SCOPES: readonly string[] = [
  'connections',
  'monitoring',
  'data_integration',
  'access_control',
  'system',
  'cluster_operations',
  'license',
]

export interface APIKeyScopeState {
  namespace?: string
  role: string
  scopes?: DashboardScopes
}

// A returned namespace is a real namespace, including one named "global".
export const isNamespacedAPIKey = (namespace?: string) => !!namespace

export const isAllowedNamespacedAPIKeyScope = (scope: string) =>
  NAMESPACED_API_KEY_SCOPES.includes(scope)

const isSameScopeSet = (left: string[], right: string[]) => {
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  return leftSet.size === rightSet.size && [...leftSet].every((scope) => rightSet.has(scope))
}

export const getAPIKeyRoleDefaultScopes = (role: string, catalog: string[], namespace?: string) => {
  if (role === 'publisher') {
    return ['publish']
  }
  if (role === 'administrator' && isNamespacedAPIKey(namespace)) {
    return [...NAMESPACED_API_KEY_SCOPES]
  }
  return catalog
}

export const resolveAPIKeyScopeMode = (
  { scopes, role, namespace }: APIKeyScopeState,
  catalog: string[],
): APIKeyScopeMode => {
  if (!Array.isArray(scopes)) {
    return APIKeyScopeMode.RoleDefault
  }
  // Older namespaced publish-only keys cannot be round-tripped as an explicit list.
  if (isNamespacedAPIKey(namespace) && isSameScopeSet(scopes, ['publish'])) {
    return APIKeyScopeMode.Custom
  }
  const defaults = getAPIKeyRoleDefaultScopes(role, catalog, namespace)
  // A failed catalog request must not turn an explicit deny-all list into role defaults.
  if (defaults.length > 0 && isSameScopeSet(scopes, defaults)) {
    return APIKeyScopeMode.RoleDefault
  }
  if (isSameScopeSet(scopes, ['system'])) {
    return APIKeyScopeMode.System
  }
  return APIKeyScopeMode.Custom
}

export const canPreserveNamespacedAPIKeyScopes = (
  current: APIKeyScopeState,
  original?: APIKeyScopeState,
) =>
  !!original &&
  isNamespacedAPIKey(original.namespace) &&
  current.namespace === original.namespace &&
  current.role === original.role &&
  Array.isArray(original.scopes) &&
  Array.isArray(current.scopes) &&
  !isSameScopeSet(current.scopes, ['publish']) &&
  isSameScopeSet(current.scopes, original.scopes)

export const getAPIKeyCustomScopeError = (
  current: APIKeyScopeState,
  original?: APIKeyScopeState,
):
  | 'namespacedPublishOnlyError'
  | 'namespacedScopesError'
  | 'customScopesSystemError'
  | undefined => {
  const scopes = Array.isArray(current.scopes) ? current.scopes : []
  if (isNamespacedAPIKey(current.namespace) && isSameScopeSet(scopes, ['publish'])) {
    return 'namespacedPublishOnlyError'
  }
  // The backend accepts unchanged legacy lists, including mixed System/restricted scopes.
  if (canPreserveNamespacedAPIKeyScopes(current, original)) {
    return undefined
  }
  if (
    isNamespacedAPIKey(current.namespace) &&
    scopes.some((scope) => !isAllowedNamespacedAPIKeyScope(scope))
  ) {
    return 'namespacedScopesError'
  }
  if (scopes.includes('system')) {
    return 'customScopesSystemError'
  }
  return undefined
}

export const getAPIKeyScopesForSubmit = (mode: APIKeyScopeMode, scopes: string[]) =>
  mode === APIKeyScopeMode.RoleDefault
    ? ('unset' as const)
    : mode === APIKeyScopeMode.System
      ? ['system']
      : [...scopes]
