import type { DashboardScopes, UserFormForUpdate } from '@/types/systemModule'
import { UNSET_SCOPES } from '@/common/scopes'

// Explicitly reset to role defaults on both POST and PUT. An omitted field
// on PUT would preserve the previously stored policy instead.
export const buildUserScopesPayload = ({
  useRoleDefault,
  scopes,
}: {
  useRoleDefault: boolean
  scopes: DashboardScopes
}): Pick<UserFormForUpdate, 'scopes'> => ({
  scopes: useRoleDefault ? UNSET_SCOPES : Array.isArray(scopes) ? [...scopes] : [],
})
