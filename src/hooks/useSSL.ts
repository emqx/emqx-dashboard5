import { SSL } from '@/types/common'
import { SSLHostnameCheck } from '@/types/typeAlias'

type CreateSSLForm = () => SSL
type HandleSSLDataBeforeSubmit = (data: SSL) => SSL

export default (): {
  createSSLForm: CreateSSLForm
  handleSSLDataBeforeSubmit: HandleSSLDataBeforeSubmit
} => {
  const createSSLForm = (): SSL => ({
    enable: false,
    verify: DEFAULT_SSL_VERIFY_VALUE,
    hostname_check: SSLHostnameCheck.san_only,
    certfile: '',
    keyfile: '',
    cacertfile: '',
    server_name_indication: '',
    middlebox_comp_mode: true,
  })

  const handleSSLDataBeforeSubmit = (data: SSL): SSL => {
    let ret: SSL = cloneDeep(data)
    const checkFields: Array<'certfile' | 'keyfile' | 'cacertfile' | 'server_name_indication'> = [
      'certfile',
      'keyfile',
      'cacertfile',
      'server_name_indication',
    ]
    if (ret.enable === false) {
      return { enable: false } as SSL
    } else {
      if (
        ret.managed_certs &&
        !Array.isArray(ret.managed_certs) &&
        Object.values(ret.managed_certs).every((value) => value === '' || value === undefined)
      ) {
        delete ret.managed_certs
      }
      checkFields.forEach((key) => {
        if (!ret[key]) {
          ret = omit(ret, key)
        }
      })
    }
    return ret
  }
  return { createSSLForm, handleSSLDataBeforeSubmit }
}
