import { transformUnitArrayToStr, transformStrToUnitArray } from '@/common/utils'
import { Listener } from '@/types/listener'
import { cloneDeep } from 'lodash'
import { ListenerType, ListenerTypeForGateway } from '@/types/enum'

export default (): {
  ID_SEPARATOR: string
  createRawListener: () => Listener
  normalizeStructure: (record: Listener) => any
  deNormalizeStructure: (record: Listener, gatewayName: string) => Listener
} => {
  const ID_SEPARATOR = ':'

  const createRawListener = (): Listener => ({
    type: ListenerType.TCP,
    id: '',
    name: '',
    bind: '',
    acceptors: 16,
    max_connections: 102400,
    max_conn_rate: 1000,
    mountpoint: '',
    proxy_protocol: false,
    proxy_protocol_timeout: [15, 's'],
    tcp: {
      nodelay: false,
      reuseaddr: true,
      send_timeout_close: true,
      active_n: 100,
      buffer: [4, 'KB'],
      send_timeout: [15, 's'],
    },
    udp: {
      active_n: 100,
      buffer: [4, 'KB'],
      recbuf: [2, 'KB'],
      sndbuf: [2, 'KB'],
      reuseaddr: true,
    },
    dtls: {
      versions: 'dtls1.2,dtlsv1',
    },
    ssl: {
      versions: 'tlsv1.3,tlsv1.2,tlsv1.1,tlsv1',
    },
    xtls: {
      cacertfile: '',
      certfile: '',
      keyfile: '',
      verify: 'verify_none',
      fail_if_no_peer_cert: false,
      server_name_indication: 'disable',
      depth: 10,
      password: '',
    },
    certSpecial: {
      cacertfile: 'Begins with ----BEGIN CERTIFICATE----',
      certfile: 'Begins with ----BEGIN CERTIFICATE----',
      keyfile: 'Begins with ----BEGIN PRIVATE KEY----',
    },
  })
  function normalizeStructure(record: Listener) {
    const { type = ListenerType.TCP } = record
    const result: Listener = {}

    Object.keys(record).forEach((v) => {
      switch (v) {
        case 'proxy_protocol_timeout':
        case 'proxy_protocol':
          if (type === ListenerType.TCP || type === ListenerType.SSL) {
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
    if (type === ListenerType.SSL && record.tcp) {
      result.tcp = { ...record.tcp }
      Object.assign(result[type], record.xtls)
    } else if (type === ListenerTypeForGateway.DTLS && record.udp) {
      result.udp = { ...record.udp }
      Object.assign(result[type], record.xtls)
    }

    return transformUnitArrayToStr(result)
  }

  function deNormalizeStructure(record: Listener, gatewayName: string) {
    const { type = ListenerType.TCP } = record

    const expandKey = [
      'tcp.buffer',
      'tcp.send_timeout',
      'proxy_protocol_timeout',
      'udp.buffer',
      'udp.recbuf',
      'udp.sndbuf',
    ]

    const result: Listener = transformStrToUnitArray(cloneDeep(record), expandKey)
    const defaultListener = createRawListener()
    if (type === ListenerType.SSL || type === ListenerTypeForGateway.DTLS) {
      result.xtls = { ...record[type] }
      result.certSpecial = { ...defaultListener.certSpecial }
      Object.keys(result.xtls).forEach((v) => {
        if (v in defaultListener.xtls) {
          delete result[type][v]
        } else {
          delete result.xtls[v]
        }
      })
    }

    if (!record.name) {
      result.name = record?.id?.split(ID_SEPARATOR)[2] || ''
    }
    if (!record.id) {
      result.id = [gatewayName, record.type, record.name].join(ID_SEPARATOR)
    }

    return result
  }

  return {
    ID_SEPARATOR,
    createRawListener,
    normalizeStructure,
    deNormalizeStructure,
  }
}
