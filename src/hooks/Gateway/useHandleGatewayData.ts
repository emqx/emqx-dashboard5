export default (): {
  handleExprotoData: (gatewayData: Record<string, any>) => Record<string, any>
} => {
  /**
   * Handles the gateway data by modifying the SSL options if necessary.
   * @param gatewayData - The gateway data to be handled.
   * @returns The modified gateway data.
   */
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
