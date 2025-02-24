import { SSL } from '@/types/common'

type CreateSSLForm = () => SSL
type HandleSSLDataBeforeSubmit = (data: SSL) => SSL

export default (): {
  createSSLForm: CreateSSLForm
  handleSSLDataBeforeSubmit: HandleSSLDataBeforeSubmit
} => {
  const createSSLForm = (): SSL => ({
    enable: false,
    verify: DEFAULT_SSL_VERIFY_VALUE,
    certfile: '',
    keyfile: '',
    cacertfile: '',
    server_name_indication: '',
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
      ret = omit(ret, checkFields)
    } else {
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
