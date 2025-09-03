import { User } from '@/types/systemModule'

const useNamespaceUser = () => {
  /**
   * Role format
   * ns:{namespace name}::{role}
   */
  const namespaceRoleReg = /^ns:(?<namespace>.+)::(?<role>.+)$/
  const getNamespaceFromRole = (role: string) => {
    const match = role.match(namespaceRoleReg)
    if (match?.groups) {
      const { namespace, role } = match.groups
      return { namespace, role }
    }
    return undefined
  }

  /**
   * Role format
   * ns:{namespace name}::{role}
   */
  const processUserRecordForSubmit = (user: User) => {
    const { namespace, ...record } = user
    if (namespace) {
      return { ...record, role: `ns:${namespace}::${user.role}` }
    }
    return user
  }

  return {
    getNamespaceFromRole,
    processUserRecordForSubmit,
  }
}

export default useNamespaceUser
