import { Listener } from '@/types/listener'
import { cloneDeep, omit } from 'lodash'
import { ListenerType, ListenerTypeForGateway } from '@/types/enum'
import { DEFAULT_ZONE } from '@/common/constants'

export default (): {
  completeGatewayListenerTypeList: ListenerTypeForGateway[]
  listenerTypeList: ListenerType[]
  ID_SEPARATOR: string
  gatewayTypesWhichCanEnableProxyProtocol: Array<ListenerTypeForGateway | ListenerType>
  gatewayTypesWhichHasTCPConfig: Array<ListenerTypeForGateway | ListenerType>
  gatewayTypesWhichHasUDPConfig: Array<ListenerTypeForGateway | ListenerType>
  gatewayTypesWhichHasSSLConfig: Array<ListenerTypeForGateway | ListenerType>
  createRawListener: () => Listener
  getListenerNameNTypeById: (id: string) => {
    type: string
    name: string
  }
  createListenerId: (listener: Listener, gatewayName?: string | undefined) => string
  hasTCPConfig: (type: ListenerType | ListenerTypeForGateway) => boolean
  hasUDPConfig: (type: ListenerType | ListenerTypeForGateway) => boolean
  hasSSLConfig: (type: ListenerType | ListenerTypeForGateway) => boolean
  hasWSConfig: (type: ListenerType) => boolean
  canConfigProxyProtocol: (type: ListenerType | ListenerTypeForGateway) => boolean
  normalizeStructure: (record: Listener) => any
  deNormalizeStructure: (record: Listener, gatewayName: string) => Listener
  /**
   * independent is diff from below gateway
   */
  handleListenerDataWhenItIsIndependent: (listener: Listener) => Listener
} => {
  const ID_SEPARATOR = ':'

  const completeGatewayListenerTypeList = [
    ListenerTypeForGateway.TCP,
    ListenerTypeForGateway.SSL,
    ListenerTypeForGateway.UDP,
    ListenerTypeForGateway.DTLS,
  ]

  // ListenerType.QUIC,
  const listenerTypeList = [ListenerType.TCP, ListenerType.SSL, ListenerType.WS, ListenerType.WSS]

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
    | SSL            |      |      | ✓    |      | ✓    |
    | UDP            | ✓    |      |      |      |      |
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

  const gatewayTypesWhichHasUDPConfig = [
    ListenerTypeForGateway.DTLS,
    ListenerTypeForGateway.UDP,
    ListenerType.QUIC,
  ]

  const gatewayTypesWhichHasSSLConfig = [
    ListenerTypeForGateway.SSL,
    ListenerType.SSL,
    ListenerType.WSS,
  ]

  const gatewayTypesWhichHasWSConfig = [ListenerType.WS, ListenerType.WSS]

  const createRawSSLParams = () => ({
    certfile: '',
    cacertfile: '',
    keyfile: '',
    verify: 'verify_none',
    fail_if_no_peer_cert: false,
    depth: 10,
    password: '',
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
    max_conn_rate: 1000,
    zone: DEFAULT_ZONE,
    mountpoint: '',
    proxy_protocol: false,
    proxy_protocol_timeout: '15s',
    tcp: createRawTCPParams(),
    udp: createRawUDPParams(),
    dtls: {
      versions: ['dtlsv1.2', 'dtlsv1'],
      ...createRawSSLParams(),
    },
    ssl: {
      versions: ['tlsv1.3', 'tlsv1.2', 'tlsv1.1', 'tlsv1'],
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
    let ret = listener
    if ('max_conn_rate' in ret) {
      ret = omit(ret, 'max_conn_rate')
    }
    if (/^\d+$/.test(ret.bind)) {
      ret.bind = parseInt(ret.bind)
    }
    return ret
  }

  const canConfigProxyProtocol = (type: ListenerType | ListenerTypeForGateway) =>
    gatewayTypesWhichCanEnableProxyProtocol.includes(type)
  const hasTCPConfig = (type: ListenerType | ListenerTypeForGateway) =>
    gatewayTypesWhichHasTCPConfig.includes(type)
  const hasUDPConfig = (type: ListenerType | ListenerTypeForGateway) =>
    gatewayTypesWhichHasUDPConfig.includes(type)
  const hasSSLConfig = (type: ListenerType | ListenerTypeForGateway) =>
    gatewayTypesWhichHasSSLConfig.includes(type)
  const hasWSConfig = (type: ListenerType) => gatewayTypesWhichHasWSConfig.includes(type)

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

        default:
          if (typeof record[v] !== 'object' || record[v] === null) {
            result[v] = record[v]
          }
      }
    })

    if (record[type]) {
      result[type] = { ...record[type] }
    }
    if (hasTCPConfig(type) && record.tcp) {
      result.tcp = { ...record.tcp }
    }
    if (hasUDPConfig(type) && record.udp) {
      result.udp = { ...record.udp }
    }
    if (hasSSLConfig(type)) {
      if (type !== ListenerTypeForGateway.DTLS) {
        result.ssl = { ...record.ssl }
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

  return {
    completeGatewayListenerTypeList,
    listenerTypeList,
    ID_SEPARATOR,
    gatewayTypesWhichCanEnableProxyProtocol,
    gatewayTypesWhichHasTCPConfig,
    gatewayTypesWhichHasUDPConfig,
    gatewayTypesWhichHasSSLConfig,
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
  }
}
