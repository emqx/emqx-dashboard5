import { checkNOmitFromObj } from '@/common/tools'
import { GatewayName } from '@/types/enum'
import { cloneDeep, omit } from 'lodash'

export default (): {
  handleExprotoData: (gatewayData: Record<string, any>) => Record<string, any>
} => {
  const handleExprotoData = (gatewayData: Record<string, any>) => {
    const ret = cloneDeep(gatewayData)
    if (ret.handler.ssl) {
      if (!ret.handler.ssl.enable) {
        ret.handler.ssl = omit(ret.handler.ssl, ['certfile', 'keyfile', 'cacertfile'])
      } else {
        ret.handler.ssl = checkNOmitFromObj(ret.handler.ssl)
      }
    }

    if (ret.server.ssl) {
      ret.server.ssl = checkNOmitFromObj(ret.server.ssl)
    }
    return ret
  }
  return {
    handleExprotoData,
  }
}
