import { updateAuthn, updateAuthz } from '@/api/auth'

export default (): {
  toggleAuthStatus: (
    authData: AuthnItemInTable | AuthzItemInTable,
    type: 'authn' | 'authz',
  ) => Promise<void>
} => {
  const { tl, t } = useI18nTl('Auth')

  const toggleAuthStatus = async (
    authData: AuthnItemInTable | AuthzItemInTable,
    type: 'authn' | 'authz',
  ) => {
    try {
      const data = omit(authData, ['img', 'metrics'])
      const isAuthn = type === 'authn'
      const requestFunc = isAuthn ? updateAuthn : updateAuthz
      const primaryKey = isAuthn
        ? (authData as AuthnItemInTable).id
        : (authData as AuthzItemInTable).type
      if (data.enable) {
        await ElMessageBox.confirm(tl(isAuthn ? 'disableAuthnTip' : 'disableAuthzTip'), {
          confirmButtonText: t('Base.confirm'),
          cancelButtonText: t('Base.cancel'),
          type: 'warning',
        })
      }
      await requestFunc(primaryKey, { ...data, enable: !data.enable })
      ElMessage.success(t(authData.enable ? 'Base.disabledSuccess' : 'Base.enableSuccess'))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject()
    }
  }

  return { toggleAuthStatus }
}
