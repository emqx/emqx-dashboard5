import { checkNOmitFromObj } from '@/common/tools'
import { cloneDeep, omit } from 'lodash'

export default (): {
  handleExprotoData: (gatewayData: Record<string, any>) => Record<string, any>
} => {
  const handleExprotoData = (gatewayData: Record<string, any>) => {
    const ret = cloneDeep(gatewayData)
    if (ret?.handler?.ssl_options) {
      if (!ret.handler.ssl_options.enable) {
        ret.handler.ssl_options = omit(ret.handler.ssl_options, [
          'certfile',
          'keyfile',
          'cacertfile',
        ])
      } else {
        ret.handler.ssl_options = checkNOmitFromObj(ret.handler.ssl_options)
      }
    }

    if (ret?.server?.ssl_options) {
      ret.server.ssl_options = checkNOmitFromObj(ret.server.ssl_options)
    }
    return ret
  }
  return {
    handleExprotoData,
  }
}
