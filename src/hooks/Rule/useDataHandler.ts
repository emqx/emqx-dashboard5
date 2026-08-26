import { BridgeType } from '@/types/enum'
import { Connector } from '@/types/rule'

const keysDoNotNeedForAPI = [
  'node_status',
  'status',
  'status_reason',
  'error',
  'idForRuleFrom',
  'actions',
  'id',
  'rules',
  'last_modified_at',
]

const keysNeedDel = {
  saveAsCopy: ['enable', 'id'],
  update: keysDoNotNeedForAPI,
  create: [...keysDoNotNeedForAPI, 'enable', 'id'],
}
/**
 * update action and connectors
 */
const keysNeedRemovedForUpdate = ['type', 'name']

/**
 * common for connector, action and bridge
 */
export const useCommonDataHandler = () => {
  const { handleSSLDataBeforeSubmit } = useSSL()

  const handleDataBeforeSubmit = (data: any): any => {
    const ret = cloneDeep(data)
    if (ret.ssl) {
      ret.ssl = handleSSLDataBeforeSubmit(ret.ssl)
    }
    if (ret.oauth2?.enable) {
      if (ret.oauth2.ssl) {
        ret.oauth2.ssl = handleSSLDataBeforeSubmit(ret.oauth2.ssl)
      }
    } else if (ret.oauth2) {
      ret.oauth2 = { enable: false }
    }
    return checkNOmitFromObj(omit(ret, keysNeedDel.update))
  }

  // When copying, set to empty value.
  // When saving as a copy, check if it has been modified.
  const likePasswordFieldKeys = [
    'password',
    'authentication.password',
    'authentication.jwt',
    'authentication.service_account_json',
    'secret_key',
    'aws_secret_access_key',
    'secret_access_key',
    'token',
    'security_token',
    'access_key_id',
    'access_key_secret',
    'sentinel_password',
    'private_key_password',
    'authentication.initial_token.client_secret',
    'oauth2.client_secret',
  ].reduce((arr: Array<string>, key) => [...arr, key, `parameters.${key}`], [])
  const getLikePasswordFieldKeys = (data: any) => {
    const ret: Array<string> = []
    const { type } = data
    if (type === BridgeType.MQTT && data.static_clientids) {
      const { static_clientids } = data
      static_clientids?.forEach?.(
        (item: { ids: Array<{ password?: string } & unknown>; node: string }, outIndex: number) => {
          item?.ids?.forEach((id, inIndex) => {
            ret.push(`static_clientids[${outIndex}].ids[${inIndex}].password`)
          })
        },
      )
    }
    return ret
  }
  const handleDataForCopy = (data: any): any => {
    const ret = omit(data, keysNeedDel.saveAsCopy)
    likePasswordFieldKeys.forEach((key) => {
      if (get(ret, key) !== undefined) {
        set(ret, key, '')
      }
    })
    const specialKeys = getLikePasswordFieldKeys(ret)
    specialKeys.forEach((key) => {
      if (get(ret, key) !== undefined) {
        set(ret, key, '')
      }
    })
    return ret
  }

  const handleDataForSaveAsCopy = (data: any): any => {
    return omit(data, keysNeedDel.create)
  }

  return {
    handleDataBeforeSubmit,
    likePasswordFieldKeys,
    getLikePasswordFieldKeys,
    handleDataForCopy,
    handleDataForSaveAsCopy,
  }
}

const connectorKeysDoNotNeedForAPI = ['sources']

type ConnectorDataHandler = (connector: Connector) => Connector
export const useConnectorDataHandler = (): {
  likePasswordFieldKeys: string[]
  handleConnectorDataBeforeSubmit: (connector: Connector) => Promise<Connector>
  handleConnectorDataBeforeUpdate: (data: Connector) => Promise<Connector>
  handleConnectorDataForCopy: ConnectorDataHandler
  handleConnectorDataForSaveAsCopy: ConnectorDataHandler
  handleConnectorDataAfterLoaded: ConnectorDataHandler
} => {
  const {
    handleDataBeforeSubmit,
    likePasswordFieldKeys,
    handleDataForCopy,
    handleDataForSaveAsCopy,
  } = useCommonDataHandler()

  const handleMQTTData = (data: any) => {
    const { static_clientids } = data
    static_clientids?.forEach((item: any) => {
      item.ids?.forEach((id: any) => {
        if (!id.username) {
          delete id.username
        }
        if (!id.password) {
          delete id.password
        }
      })
    })
    return data
  }

  const specialDataHandlerBeforeSubmit = new Map([[BridgeType.MQTT, handleMQTTData]])

  const handleConnectorDataBeforeSubmit = async (data: Connector): Promise<Connector> => {
    try {
      let ret = cloneDeep(data)
      const type = data.type
      const handler = specialDataHandlerBeforeSubmit.get(type)
      if (handler) {
        ret = await handler(ret)
      }
      ret = handleDataBeforeSubmit(ret)
      return Promise.resolve(omit(ret, connectorKeysDoNotNeedForAPI) as Connector)
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const handleConnectorDataBeforeUpdate = async (data: Connector): Promise<Connector> => {
    const ret = await handleConnectorDataBeforeSubmit(data)
    return omit(ret, keysNeedRemovedForUpdate) as Connector
  }

  const handleConnectorDataForCopy = handleDataForCopy

  const handleConnectorDataForSaveAsCopy = handleDataForSaveAsCopy

  const specialHandlerAfterLoaded = new Map([
    [
      BridgeType.Webhook,
      (data: Connector) => {
        if (!data.oauth2) {
          data.oauth2 = { enable: false }
        }
        return data
      },
    ],
  ])

  const handleConnectorDataAfterLoaded = (data: Connector): Connector => {
    const { type } = data
    const handler = specialHandlerAfterLoaded.get(type)
    if (handler) {
      handler(data)
    }
    return data
  }

  return {
    likePasswordFieldKeys,
    handleConnectorDataBeforeSubmit,
    handleConnectorDataBeforeUpdate,
    handleConnectorDataForCopy,
    handleConnectorDataForSaveAsCopy,
    handleConnectorDataAfterLoaded,
  }
}

export const useRedisCommandCheck = (): {
  commandReg: RegExp
  splitBySpace: (command: string) => string[] | Promise<never>
  transCommandArrToStr: (commandArr: Array<string>) => string
} => {
  const { tl } = useI18nTl('RuleEngine')

  const strReg = /('(([^'\\]|(\\')|\\))+')|("(([^"\\]|(\\")|\\))+")/g
  const partItem = /[^\s"']+/
  const commandReg = new RegExp(
    `^((${strReg.source}|${partItem.source})(\\s)+)*(${strReg.source}|${partItem.source})$`,
  )
  const SPACE = ' '

  const splitBySpace = (command: string) => {
    const randomStr = createRandomString()
    const strArr: Array<string> = []
    const newCommand = command.replace(/\n/g, SPACE).trim()
    if (!commandReg.test(newCommand)) {
      ElMessage.error(tl('redisCommandError'))
      return Promise.reject()
    }
    const commandRemoveStr = newCommand.replace(/\n/g, SPACE).replace(strReg, (matched: string) => {
      // remove quota
      strArr.push(matched.slice(1, -1))
      return randomStr
    })
    const ret = commandRemoveStr.split(SPACE)
    let replaceIndex = 0
    return ret
      .map((item) => {
        if (item === randomStr) {
          replaceIndex += 1
          return strArr[replaceIndex - 1]
        }
        return item
      })
      .filter((item) => !!item)
  }

  const specialCharReg = /[$!*?[\]{}~#<>|\\,=#\s]/

  const transCommandArrToStr = (commandArr: Array<string>) => {
    // If an string item has space or escape characters, wrap it in double quotes.
    return commandArr.reduce((str, current) => {
      let item = current
      const withSpecialChar = specialCharReg.test(current)
      const withUnescapeDoubleQuote = /(?<!\/)"/.test(current)
      if (withSpecialChar) {
        if (withUnescapeDoubleQuote) {
          item = `'${current}'`
        } else {
          item = `"${current}"`
        }
      }
      return str ? `${str} ${item}` : item
    }, '')
  }

  return {
    commandReg,
    splitBySpace,
    transCommandArrToStr,
  }
}

export const useBridgeDataHandler = (): {
  likePasswordFieldKeys: string[]
  handleBridgeDataAfterLoaded: (bridgeData: any) => any
  handleBridgeDataForCopy: (bridgeData: any) => any
} => {
  const { likePasswordFieldKeys, handleDataForCopy } = useCommonDataHandler()

  const handleBridgeDataAfterLoaded = (bridgeData: any) => {
    return bridgeData
  }

  const handleBridgeDataForCopy = (bridgeData: any): any => {
    return handleBridgeDataAfterLoaded(handleDataForCopy(bridgeData))
  }

  return {
    likePasswordFieldKeys,
    handleBridgeDataAfterLoaded,
    handleBridgeDataForCopy,
  }
}

export const useActionDataHandler = (): {
  handleActionDataBeforeSubmit: (data: any) => Promise<any>
  handleActionDataBeforeUpdate: (data: any) => Promise<any>
  handleActionDataAfterLoaded: (data: any) => any
} => {
  const { handleDataBeforeSubmit } = useCommonDataHandler()

  const { splitBySpace, transCommandArrToStr } = useRedisCommandCheck()
  const handleRedisBridgeData = async (bridgeData: any) => {
    try {
      if (
        bridgeData?.parameters?.command_template &&
        typeof bridgeData.parameters.command_template === 'string'
      ) {
        bridgeData.parameters.command_template = await splitBySpace(
          bridgeData.parameters.command_template,
        )
      }
      return bridgeData
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const handleS3ActionData = async (bridgeData: any) => {
    if (/direct/i.test(bridgeData?.parameters?.mode)) {
      bridgeData.resource_opts.batch_size = 1
    }
    return bridgeData
  }

  const { checkIsIoTDBThriftConnector } = useCheckIoTDBConnectorDriver()
  const handleIoTDBActionData = async (data: any) => {
    const { connector } = data
    const isThriftConnector = await checkIsIoTDBThriftConnector(connector)
    if (isThriftConnector && /async/i.test(data.resource_opts?.query_mode)) {
      data.resource_opts.query_mode = 'sync'
    }
    return data
  }

  const specialDataHandlerBeforeSubmit = new Map([
    [BridgeType.Redis, handleRedisBridgeData],
    [BridgeType.S3, handleS3ActionData],
    [BridgeType.AzureBlobStorage, handleS3ActionData],
    [BridgeType.IoTDB, handleIoTDBActionData],
  ])

  /**
   * submit contains create and update
   */
  const handleActionDataBeforeSubmit = async (data: any): Promise<any> => {
    try {
      let ret = cloneDeep(data)
      const handler = specialDataHandlerBeforeSubmit.get(ret.type)
      if (handler) {
        ret = await handler(ret)
      }
      if (ret.fallback_actions && ret.fallback_actions.length) {
        ret.fallback_actions.forEach((item: any) => {
          delete item.tags
        })
      }
      return Promise.resolve(await handleDataBeforeSubmit(ret))
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const handleActionDataBeforeUpdate = async (data: any): Promise<any> => {
    const ret = await handleActionDataBeforeSubmit(data)
    return omit(ret, keysNeedRemovedForUpdate)
  }

  const handleRedisDataAfterLoaded = (data: any) => {
    if (data?.parameters?.command_template && Array.isArray(data.parameters.command_template)) {
      data.parameters.command_template = transCommandArrToStr(data.parameters.command_template)
    }
    return data
  }

  const specialHandlerAfterLoaded = new Map([[BridgeType.Redis, handleRedisDataAfterLoaded]])

  const handleActionDataAfterLoaded = (data: any) => {
    const handler = specialHandlerAfterLoaded.get(data.type)
    if (handler) {
      handler(data)
    }
    return data
  }

  return {
    handleActionDataBeforeSubmit,
    handleActionDataBeforeUpdate,
    handleActionDataAfterLoaded,
  }
}
