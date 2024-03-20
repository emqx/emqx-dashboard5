import { checkNOmitFromObj } from '@/common/tools'
import {
  DashboardSsoBackendStatusBackend,
  SsoLdapBackend,
  DashboardSamlBackend,
} from '@/types/schemas/dashboardSingleSignOn.schemas'
import useSSL from '../useSSL'
import { SSOIframeBackend } from '@/types/typeAlias'

export default (): {
  createRawForm: (backend: string) => any
  handleFormDataBeforeSubmit: (backend: string, form: any) => any
} => {
  const { createSSLForm } = useSSL()

  const createRawLDAPForm = (): any => ({
    enable: true,
    backend: SsoLdapBackend.ldap,
    server: 'localhost:389',
    username: '',
    password: '',
    base_dn: '',
    filter: '(& (objectClass=person) (uid=${username}))',
    ssl: createSSLForm(),
  })
  const createRawSAMLForm = (): any => ({
    enable: true,
    backend: DashboardSamlBackend.saml,
    dashboard_addr: location.origin + location.pathname.slice(0, -1),
    idp_metadata_url: '',
    sp_sign_request: false,
    sp_public_key: '',
    sp_private_key: '',
  })
  const createRawIframeForm = (): any => ({
    enable: true,
    backend: SSOIframeBackend.iframe,
    url: 'https://127.0.0.1:28080',
    request_timeout: '30s',
    connect_timeout: '15s',
    pool_size: 8,
    enable_pipelining: 100,
    ssl: createSSLForm(),
    method: 'get',
  })

  const formCreatorMap: Map<string, () => any> = new Map([
    [DashboardSsoBackendStatusBackend.ldap, createRawLDAPForm],
    [DashboardSsoBackendStatusBackend.saml, createRawSAMLForm],
    [DashboardSsoBackendStatusBackend.iframe, createRawIframeForm],
  ])
  const createRawForm = (backend: string) => {
    const func = formCreatorMap.get(backend)
    return func?.() || {}
  }

  const handleSAMLFormBeforeSubmit = (form: any) => {
    if (!form.sp_sign_request) {
      form.sp_public_key = ''
      form.sp_private_key = ''
    }
    return form
  }

  const formHandlerMap: Map<string, (form: any) => any> = new Map([
    [DashboardSsoBackendStatusBackend.ldap, checkNOmitFromObj],
    [DashboardSsoBackendStatusBackend.saml, handleSAMLFormBeforeSubmit],
    [DashboardSsoBackendStatusBackend.iframe, handleSAMLFormBeforeSubmit],
  ])

  const handleFormDataBeforeSubmit = (backend: string, form: any) => {
    const func = formHandlerMap.get(backend)
    return func ? func(form) : form
  }

  return {
    createRawForm,
    handleFormDataBeforeSubmit,
  }
}
