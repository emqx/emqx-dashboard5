import { DEFAULT_SSL_VERIFY_VALUE } from '@/common/constants'
import { SSL } from '@/types/common'
import { cloneDeep, omit } from 'lodash'

export default () => {
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
    if (!ret.enable) {
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
