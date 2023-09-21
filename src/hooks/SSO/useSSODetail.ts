import {
  DashboardSsoBackendStatusBackend,
  EmqxDashboardSsoLdapLdapBackend,
} from '@/types/schemas/dashboardSingleSignOn.schemas'
import useSSL from '../useSSL'

export default (): {
  createRawForm: (backend: string) => any
} => {
  const { createSSLForm } = useSSL()

  const createRawLDAPForm = (): any => ({
    enable: true,
    backend: EmqxDashboardSsoLdapLdapBackend.ldap,
    server: 'localhost:389',
    username: '',
    password: '',
    base_dn: '',
    filter: '(& (objectClass=person) (uid=${username}))',
    ssl: createSSLForm(),
  })
  const formCreatorMap: Map<string, () => any> = new Map([
    [DashboardSsoBackendStatusBackend.ldap, createRawLDAPForm],
  ])
  const createRawForm = (backend: string) => {
    const func = formCreatorMap.get(backend)
    return func?.() || {}
  }

  return {
    createRawForm,
  }
}
