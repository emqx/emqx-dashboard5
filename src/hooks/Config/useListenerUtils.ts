import { SSL_VERIFY_VALUE_MAP, unexposedConfigs } from '@/common/constants'
import useLimiter from '@/hooks/Config/useLimiter'
import { FormRules } from '@/types/common'
import { ListenerType, ListenerTypeForGateway } from '@/types/enum'
import { Listener } from '@/types/listener'
import { cloneDeep } from 'lodash'
import useFormRules from '../useFormRules'
import useI18nTl from '../useI18nTl'
import parseHoconToObject from 'hocon-parser'

export interface ListenerUtils {
  completeGatewayListenerTypeList: ListenerTypeForGateway[]
  listenerTypeList: ListenerType[]
  ID_SEPARATOR: string
  gatewayTypesWhichCanEnableProxyProtocol: Array<ListenerTypeForGateway | ListenerType>
  gatewayTypesWhichHasTCPConfig: Array<ListenerTypeForGateway | ListenerType>
  gatewayTypesWhichHasUDPConfig: Array<ListenerTypeForGateway>
  gatewayTypesWhichHasSSLConfig: Array<ListenerTypeForGateway | ListenerType>
  listenerFormRules: FormRules
  limiterRules: FormRules
  maxConnRateRule: FormRules
  createRawListener: () => Listener
  getListenerNameNTypeById: (id: string) => {
    type: string
    name: string
  }
  createListenerId: (listener: Listener, gatewayName?: string | undefined) => string
  hasTCPConfig: (type: ListenerType | ListenerTypeForGateway) => boolean
  hasUDPConfig: (type: ListenerTypeForGateway) => boolean
  hasSSLConfig: (type: ListenerType | ListenerTypeForGateway) => boolean
  hasWSConfig: (type: ListenerType) => boolean
  canConfigProxyProtocol: (type: ListenerType | ListenerTypeForGateway) => boolean
  normalizeStructure: (record: Listener) => any
  deNormalizeStructure: (record: Listener, gatewayName: string) => Listener
  /**
   * independent is diff from below gateway
   */
  handleListenerDataWhenItIsIndependent: (listener: Listener) => Listener
  transPort: (port: string) => string
  extractDifferences: (type: keyof typeof unexposedConfigs, data: any) => Record<string, any>
  objectToHocon(obj: Record<string, any>): string
  hoconToObject: (hoconData: string) => Record<string, any>
}

export default (gatewayName?: string | undefined): ListenerUtils => {
  const ID_SEPARATOR = ':'

  const completeGatewayListenerTypeList = [
    ListenerTypeForGateway.TCP,
    ListenerTypeForGateway.SSL,
    ListenerTypeForGateway.UDP,
    ListenerTypeForGateway.DTLS,
    ListenerTypeForGateway.WS,
    ListenerTypeForGateway.WSS,
  ]

  // ListenerType.QUIC,
  const listenerTypeList = [
    ListenerType.TCP,
    ListenerType.SSL,
    ListenerType.WS,
    ListenerType.WSS,
    ListenerType.QUIC,
  ]

  /* 
    |                | SSL  | DTLS | UDP  | TCP  |
    | -------------- | ---- | ---- | ---- | ---- |
    | SSL            | ✓    |      |      |      |
    | TCP            | ✓    |      |      | ✓    |
    | UDP            |      | ✓    | ✓    |      |
    | DTLS(like SSL) |      | ✓    |      |      |
    | Proxy Protocol | ✓    |      |      | ✓    |

    |                | QUIC | TCP  | SSL  | WS   | WSS  |
    | -------------- | ---- | ---- | ---- | ---- | ---- |
    | TCP            |      | ✓    | ✓    | ✓    | ✓    |
    | SSL            | ✓    |      | ✓    |      | ✓    |
    | UDP            |      |      |      |      |      |
    | WS             |      |      |      | ✓    | ✓    |
    | Proxy Protocol |      | ✓    | ✓    | ✓    | ✓    |
  */
  const gatewayTypesWhichCanEnableProxyProtocol = [
    ListenerTypeForGateway.SSL,
    ListenerTypeForGateway.TCP,
    ListenerType.TCP,
    ListenerType.SSL,
    ListenerType.WS,
    ListenerType.WSS,
  ]

  const gatewayTypesWhichHasTCPConfig = [
    ListenerTypeForGateway.SSL,
    ListenerTypeForGateway.TCP,
    ListenerType.TCP,
    ListenerType.SSL,
    ListenerType.WS,
    ListenerType.WSS,
  ]

  const gatewayTypesWhichHasUDPConfig = [ListenerTypeForGateway.DTLS, ListenerTypeForGateway.UDP]

  const gatewayTypesWhichHasSSLConfig = [
    ListenerTypeForGateway.DTLS,
    ListenerTypeForGateway.SSL,
    ListenerType.SSL,
    ListenerType.WSS,
    ListenerType.QUIC,
  ]

  const gatewayTypesWhichHasWSConfig = [ListenerType.WS, ListenerType.WSS]

  const { t, tl } = useI18nTl('Gateway')
  const { createRequiredRule, createIntFieldRule, createCommonIdRule } = useFormRules()
  const positiveIntegerRule = createIntFieldRule(1)
  // limiter in listener
  const { limiterRules } = useLimiter()
  // limiter in gateway's listener
  const maxConnRateRule = { max_conn_rate: positiveIntegerRule }
  const SSLCertfileRules = {
    'dtls_options.certfile': createRequiredRule('TLS Cert'),
    'dtls_options.keyfile': createRequiredRule('TLS Key'),
    'ssl_options.certfile': createRequiredRule('TLS Cert'),
    'ssl_options.keyfile': createRequiredRule('TLS Key'),
  }
  const listenerFormRules: FormRules = {
    name: [...createRequiredRule(t('Base.name')), ...createCommonIdRule()],
    type: createRequiredRule(tl('lType'), 'select'),
    bind: createRequiredRule(tl('lAddress')),
    acceptors: positiveIntegerRule,
    max_connections: [
      {
        validator(rule: any, value: number | string) {
          if (typeof value === 'number' && Number(value) < 1) {
            return [new Error(t('Rule.minimumError', { min: 1 }))]
          }
          return []
        },
      },
    ],
    'ssl_options.ocsp.responder_url': createRequiredRule(tl('responderUrl')),
    'ssl_options.ocsp.issuer_pem': createRequiredRule(tl('issuerPem')),
    ...SSLCertfileRules,
  }

  const createRawSSLParams = () => ({
    certfile: '',
    cacertfile: '',
    keyfile: '',
    verify: SSL_VERIFY_VALUE_MAP.get(true),
    fail_if_no_peer_cert: false,
    depth: 10,
    password: '',
    ocsp: {
      enable_ocsp_stapling: false,
      responder_url: '',
      issuer_pem: '',
      refresh_interval: '5m',
      refresh_http_timeout: '15s',
    },
  })

  const createRawTCPParams = () => ({
    nodelay: false,
    reuseaddr: true,
    send_timeout_close: true,
    active_n: 100,
    buffer: '4KB',
    send_timeout: '15s',
  })

  const createRawUDPParams = () => ({
    active_n: 100,
    buffer: '4KB',
    recbuf: '2KB',
    sndbuf: '2KB',
    reuseaddr: true,
  })

  const createRawListener = (): Listener => ({
    type: ListenerType.TCP,
    id: '',
    name: '',
    bind: '',
    acceptors: 16,
    max_connections: 102400,
    max_conn_rate: gatewayName ? 1000 : undefined,
    // zone: DEFAULT_ZONE,
    mountpoint: '',
    proxy_protocol: false,
    proxy_protocol_timeout: '3s',
    tcp_options: createRawTCPParams(),
    udp_options: createRawUDPParams(),
    dtls_options: {
      versions: ['dtlsv1.2', 'dtlsv1'],
      ciphers: [],
      ...createRawSSLParams(),
    },
    ssl_options: {
      versions: ['tlsv1.3', 'tlsv1.2', 'tlsv1.1', 'tlsv1'],
      ciphers: [],
      ...createRawSSLParams(),
    },
    websocket: {
      mqtt_path: '',
    },
  })

  const listenerIdReg = new RegExp(`^(?<type>${listenerTypeList.join('|')}):(?<name>.+)`)
  const getListenerNameNTypeById = (id: string): { type: string; name: string } => {
    const matchResult = id.match(listenerIdReg)
    if (!matchResult) {
      return {
        type: '' as ListenerType,
        name: '',
      }
    }
    const { name, type } = matchResult.groups || {}
    return { name, type }
  }

  /**
   * independent is diff from below gateway
   */
  const handleListenerDataWhenItIsIndependent = (listener: Listener): Listener => {
    const ret = listener
    if (/^\d+$/.test(ret.bind)) {
      ret.bind = parseInt(ret.bind)
    }
    return ret
  }

  const canConfigProxyProtocol = (type: ListenerType | ListenerTypeForGateway) =>
    gatewayTypesWhichCanEnableProxyProtocol.includes(type)
  const hasTCPConfig = (type: ListenerType | ListenerTypeForGateway) =>
    gatewayTypesWhichHasTCPConfig.includes(type)
  const hasUDPConfig = (type: ListenerTypeForGateway) =>
    gatewayTypesWhichHasUDPConfig.includes(type)
  const hasSSLConfig = (type: ListenerType | ListenerTypeForGateway) =>
    gatewayTypesWhichHasSSLConfig.includes(type)
  const hasWSConfig = (type: ListenerType) => gatewayTypesWhichHasWSConfig.includes(type)

  /**
   * Normalizes the structure of a listener record.
   *
   * @param record - The listener record to normalize.
   * @returns The normalized listener record.
   */
  const normalizeStructure = (record: Listener) => {
    const { type = ListenerType.TCP } = record
    const result: Listener = {}
    Object.keys(record).forEach((v) => {
      switch (v) {
        case 'proxy_protocol_timeout':
        case 'proxy_protocol':
          if (canConfigProxyProtocol(type)) {
            result[v] = record[v]
          }
          break
        case 'acceptors':
          if (type !== ListenerTypeForGateway.UDP) {
            result[v] = record[v]
          }
          break
        case 'limiter':
          result[v] = record[v]
          break
        // Custom configs
        case 'access_rules':
          result[v] = typeof record[v] === 'string' ? record[v].split(',') : record[v]
          break
        case 'websocket':
          if (
            record[v]?.supported_subprotocols &&
            typeof record[v].supported_subprotocols !== 'string'
          ) {
            record[v].supported_subprotocols = record[v].supported_subprotocols.join(', ')
          }
          break
        default:
          if (typeof record[v] !== 'object' || record[v] === null) {
            result[v] = record[v]
          }
      }
    })

    if (record[type]) {
      result[type] = { ...record[type] }
    }
    if (hasTCPConfig(type) && record.tcp_options) {
      result.tcp_options = { ...record.tcp_options }
    }
    if (hasUDPConfig(type) && record.udp_options) {
      result.udp_options = { ...record.udp_options }
    }
    if (hasSSLConfig(type)) {
      if (type !== ListenerTypeForGateway.DTLS) {
        result.ssl_options = { ...record.ssl_options }
      } else {
        result.dtls_options = { ...record.dtls_options }
      }
    }
    if (hasWSConfig(type)) {
      result.websocket = { ...record.websocket }
    }
    return result
  }

  const createListenerId = (listener: Listener, gatewayName?: string): string => {
    const { type, name } = listener
    return `${gatewayName ? gatewayName + ID_SEPARATOR : ''}${type}${ID_SEPARATOR}${name}`
  }

  const deNormalizeStructure = (record: Listener, gatewayName: string) => {
    const result: Listener = cloneDeep(record)

    if (!record.name) {
      result.name = record?.id?.split(ID_SEPARATOR)[2] || ''
    }
    if (!record.id) {
      result.id = [gatewayName, record.type, record.name].join(ID_SEPARATOR)
    }

    return result
  }

  const portNeedsToTransReg = /^:\d+$/
  const transPort = (port: string) =>
    portNeedsToTransReg.test(port) ? port.replace(':', '') : port

  /**
   * Extracts the differences between the default configuration object and the provided data object.
   * @param type - The type of the configuration object.
   * @param data - The data object to compare with the default configuration.
   * @returns An object containing the differences between the default configuration and the provided data.
   */
  function extractDifferences(type: keyof typeof unexposedConfigs, data: any) {
    const defaultConfig = unexposedConfigs[type]
    const diff: Record<string, any> = {}

    function compareAndExtractDiff(defaultObj: any, compareObj: any, path = '') {
      Object.keys(defaultObj).forEach((key) => {
        const newPath = path ? `${path}.${key}` : key
        if (
          typeof defaultObj[key] === 'object' &&
          !Array.isArray(defaultObj[key]) &&
          defaultObj[key] !== null
        ) {
          // Object but not Array
          if (!compareObj[key]) compareObj[key] = {}
          compareAndExtractDiff(defaultObj[key], compareObj[key], newPath)
        } else if (Array.isArray(defaultObj[key])) {
          // Handle Array types
          if (
            !Array.isArray(compareObj[key]) ||
            defaultObj[key].length !== compareObj[key].length ||
            !defaultObj[key].every((val: any, index: number) => val === compareObj[key][index])
          ) {
            diff[newPath] = compareObj[key]
          }
        } else {
          // Handle non-object and non-array types
          if (defaultObj[key] !== compareObj[key]) {
            diff[newPath] = compareObj[key]
          }
        }
      })
    }
    compareAndExtractDiff(defaultConfig, data)
    return diff
  }

  const wordReg = /^[a-zA-Z_]+$/
  const numReg = /^[\d]+$/

  const getValueStr = (value: string) => {
    if (wordReg.test(value) || numReg.test(value)) {
      return value
    }
    return `"${value}"`
  }

  const objectToHocon = (data: Record<string, any>): string => {
    let result = ''
    const walk = (data: Record<string, any>, level = 0) => {
      for (const key in data) {
        const value = data[key]
        if (typeof value === 'object' && !Array.isArray(value)) {
          result += `${'  '.repeat(level)}${key} {\n`
          walk(value, level + 1)
          result += `${'  '.repeat(level)}}\n`
        } else if (Array.isArray(value)) {
          result += `${'  '.repeat(level)}${key} = [\n`
          for (const item of value) {
            result += `${'  '.repeat(level + 1)}${getValueStr(item)}\n`
          }
          result += `${'  '.repeat(level)}]\n`
        } else {
          result += `${'  '.repeat(level)}${key} = ${getValueStr(value)}\n`
        }
      }
    }

    walk(data, 1)

    return `{\n${result}}`
  }

  const hoconToObject = (hoconData: string): Record<string, any> => {
    try {
      const parsedData = parseHoconToObject(hoconData)
      return Promise.resolve(parsedData)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    completeGatewayListenerTypeList,
    listenerTypeList,
    ID_SEPARATOR,
    gatewayTypesWhichCanEnableProxyProtocol,
    gatewayTypesWhichHasTCPConfig,
    gatewayTypesWhichHasUDPConfig,
    gatewayTypesWhichHasSSLConfig,
    listenerFormRules,
    limiterRules,
    maxConnRateRule,
    createRawListener,
    getListenerNameNTypeById,
    createListenerId,
    hasTCPConfig,
    hasUDPConfig,
    hasSSLConfig,
    hasWSConfig,
    canConfigProxyProtocol,
    normalizeStructure,
    deNormalizeStructure,
    handleListenerDataWhenItIsIndependent,
    transPort,
    extractDifferences,
    objectToHocon,
    hoconToObject,
  }
}
