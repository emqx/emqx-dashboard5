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
  const processUserRecordForSubmit = <T extends { namespace?: string; role: string }>(
    user: T,
  ): T => {
    const { namespace, ...record } = user
    if (namespace) {
      return { ...record, role: `ns:${namespace}::${user.role}` } as T
    }
    return user as T
  }

  const processAPIKeyRecordForUpdating = <T extends { namespace?: string; role: string }>(
    data: T,
  ): T => {
    return processUserRecordForSubmit({ ...data })
  }

  return {
    getNamespaceFromRole,
    processUserRecordForSubmit,
    processAPIKeyRecordForUpdating,
  }
}

export default useNamespaceUser
