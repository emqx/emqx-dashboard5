import { DEFAULT_SSL_VERIFY_VALUE } from '@/common/constants'
import { SSL } from '@/types/common'
import { cloneDeep, omit } from 'lodash'

export default () => {
  const createSSLForm = () => ({
    enable: false,
    verify: DEFAULT_SSL_VERIFY_VALUE,
    certfile: '',
    keyfile: '',
    cacertfile: '',
  })

  const handleSSLDataBeforeSubmit = (data: Partial<SSL>): Partial<SSL> => {
    let ret: Partial<SSL> = cloneDeep(data)
    const checkFields: Array<keyof SSL> = ['certfile', 'keyfile', 'cacertfile']
    if (!ret.enable) {
      ret = omit(ret, checkFields)
    } else {
      checkFields.forEach((key) => (!ret[key] ? (ret = omit(ret, key)) : void 0))
    }
    return ret
  }
  return { createSSLForm, handleSSLDataBeforeSubmit }
}
