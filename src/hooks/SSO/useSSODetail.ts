import {
  DashboardSamlBackend,
  DashboardSsoBackendStatusBackend,
  SsoLdapBackend,
} from '@/types/schemas/dashboardSingleSignOn.schemas'
import { OIDCPreferredAuthMethods, OIDCProvider, SSOOIDCBackend } from '@/types/typeAlias'
import useSSL from '../useSSL'

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
  const createRawOIDCForm = (): any => ({
    enable: true,
    backend: SSOOIDCBackend.oidc,
    issuer: '',
    clientid: '',
    secret: '',
    scopes: ['openid'],
    name_var: '${sub}',
    dashboard_addr: location.origin + location.pathname.slice(0, -1),
    session_expiry: '30s',
    require_pkce: false,
    preferred_auth_methods: [
      OIDCPreferredAuthMethods.client_secret_post,
      OIDCPreferredAuthMethods.client_secret_basic,
      OIDCPreferredAuthMethods.none,
    ],
    provider: OIDCProvider.generic,
    fallback_methods: ['RS256'],
    client_jwks: 'none',
  })

  const formCreatorMap: Map<string, () => any> = new Map([
    [DashboardSsoBackendStatusBackend.ldap, createRawLDAPForm],
    [DashboardSsoBackendStatusBackend.saml, createRawSAMLForm],
    [DashboardSsoBackendStatusBackend.oidc, createRawOIDCForm],
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
