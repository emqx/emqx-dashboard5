import { SSL_FIELDS, INTEGRATION_SCHEMA_TYPES } from '@/common/constants'
import {
  useActionSchema,
  useBridgeSchema,
  useConnectorSchema,
  useSourceSchema,
} from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { BridgeType } from '@/types/enum'
import { Property } from '@/types/schemaForm'
import { isFunction, snakeCase } from 'lodash'
import { useI18n } from 'vue-i18n'

type GetTextKey = (prop: Property) => string

const numReg = /_\d/g
const customSnakeCase = (str: string) =>
  snakeCase(str).replace(numReg, (match) => match.replace('_', ''))

const DEFAULT_ZONE = 'emqx_schema'
const TYPE_ZONE_MAP: Record<string, Array<string>> = {
  emqx_schema: ['mqtt', 'session', 'sysmon'],
  emqx_conf_schema: ['log'],
  emqx_limiter_schema: ['limiter'],
  file_trans: ['file-trans'],
}

/**
 * For Log Configuration
 */
const LOG_DEFAULT_PREFIX = 'common_handler_'
const LOG_SPECIAL_KEY_PREFIX_MAP = {
  audit_handler_: ['audit.path', 'audit.level'],
  log_overload_kill_: ['mem_size', 'qlen', 'restart_after'],
  log_burst_limit_: ['max_count', 'window_time'],
  log_file_handler_: ['max_size', 'path', 'rotation_size', 'file.default.path'],
  log_rotation_: ['count'],
}

const SYS_MON_PREFIX = 'sysmon_'

// Bridge
const COMMON_CONNECTOR_ZONE = 'emqx_connector_schema_lib'
const COMMON_CONNECTOR_KEY = [
  'auto_reconnect',
  'password',
  'pool_size',
  'prepare_statement',
  'ssl',
  'username',
  'database',
  'description',
]

const BRIDGE_SPECIAL_TYPE_MAP: Map<string, string> = new Map([
  [BridgeType.MatrixDB, 'pgsql'],
  [BridgeType.TimescaleDB, 'pgsql'],
  [BridgeType.Confluent, 'kafka'],
  [BridgeType.KafkaProducer, 'kafka'],
  [BridgeType.GCPProducer, 'gcp_pubsub'],
  [BridgeType.GCPConsumer, 'gcp_pubsub'],
  [BridgeType.AzureEventHubs, 'azure_event_hub'],
])

const MONGO_SPECIAL_KEY_MAP: Record<string, string> = {
  heartbeat_frequency: 'heartbeat_period',
  min_heartbeat_frequency: 'min_heartbeat_period',
}

export const useSymbolLabel = (): {
  getOptLabel: (key: string) => string
} => {
  const { t, te } = useI18n()
  const getOptLabel = (key: string) => {
    const textKey = `SchemaSymbolLabel.${key}`
    return te(textKey) ? t(textKey) : key?.toString()
  }
  return {
    getOptLabel,
  }
}
const SSL_CONF_REG = /ssl|tls/i
const SSL_CONFIG_KEYS = SSL_FIELDS

export default (
  props: any,
): {
  getText: (prop: Property) => {
    label: any
    desc?: string
  }
  getOptLabel: (key: string) => string
} => {
  const { t, te } = useI18n()

  const typesUseBridgeText = INTEGRATION_SCHEMA_TYPES

  const getSSLPropKey = ({ key, path }: Property): string | false => {
    if (path && SSL_CONF_REG.test(path) && key && SSL_CONFIG_KEYS.includes(key)) {
      return `ssl_opts.${key}`
    }
    return false
  }

  /**
   * zone is first level
   */
  const getConfigurationTextZone = () =>
    Object.keys(TYPE_ZONE_MAP).find((key) => TYPE_ZONE_MAP[key].includes(props.type)) ||
    DEFAULT_ZONE

  const getMQTTAndSessionItemTextKey = ({ path }: Property) =>
    `${getConfigurationTextZone()}.${customSnakeCase(path as string)}`

  const getLogItemTextKey = ({ key, path }: Property) => {
    const prefix =
      Object.entries(LOG_SPECIAL_KEY_PREFIX_MAP).find(
        ([, value]) => value.includes(path as string) || value.includes(key as string),
      )?.[0] || LOG_DEFAULT_PREFIX
    return `${getConfigurationTextZone()}.${prefix}${key}`
  }

  const getSysMonTextKey = ({ path }: Property) =>
    `${getConfigurationTextZone()}.${SYS_MON_PREFIX}${customSnakeCase(path as string)}`

  const getLimiterTextKey = ({ key }: Property) => `${getConfigurationTextZone()}.${key}`

  const getFileTransTextKey = (propItem: Property) => {
    const sslPropKey = getSSLPropKey(propItem)
    if (sslPropKey) {
      return sslPropKey
    }
    const { key, path } = propItem
    let textKey = key
    if (key === 'enable' || key === 'root') {
      textKey = snakeCase(path)
    }
    return `${getConfigurationTextZone()}.${textKey}`
  }

  const funcMap: Record<string, GetTextKey> = {
    mqtt: getMQTTAndSessionItemTextKey,
    session: getMQTTAndSessionItemTextKey,
    log: getLogItemTextKey,
    sysmon: getSysMonTextKey,
    limiter: getLimiterTextKey,
    'file-trans': getFileTransTextKey,
  }

  const getConfigurationItemTextKey = (prop: Property) => {
    const func = funcMap[props.type]
    if (func && isFunction(func)) {
      return func(prop)
    }
    return prop.path
  }

  const { getTypeByBridgeSchemaRef } = useBridgeSchema()
  const { getTypeByConnectorSchemaRef } = useConnectorSchema()
  const { getTypeByActionSchemaRef } = useActionSchema()
  const { getTypeBySourceSchemaRef } = useSourceSchema()
  const getTypeBySchemaRef = () => {
    const { ref } = props.accordingTo
    if (props.type === 'bridge') {
      return getTypeByBridgeSchemaRef(ref)
    }
    if (props.type === 'action') {
      return getTypeByActionSchemaRef(ref)
    }
    if (props.type === 'source') {
      return getTypeBySourceSchemaRef(ref)
    }
    return getTypeByConnectorSchemaRef(ref)
  }

  /**
   * zone is first level
   */
  const getBridgeTextZone = (prop: Property) => {
    if (!props.accordingTo?.ref) {
      return ''
    }
    if (prop.path && prop.path.indexOf('resource_opt') > -1) {
      return `emqx_resource_schema`
    }
    if (prop.key && COMMON_CONNECTOR_KEY.includes(prop.key) && !prop.labelKey) {
      return COMMON_CONNECTOR_ZONE
    }
    let type = getTypeBySchemaRef()
    const specifiedType = BRIDGE_SPECIAL_TYPE_MAP.get(type)
    if (specifiedType) {
      type = specifiedType
    }
    return `emqx_ee_bridge_${type}`
  }

  const getBridgeTextKey = (prop: Property) => {
    const type = getTypeBySchemaRef()
    let key = prop.key
    if (!key) {
      return
    }
    if (type === BridgeType.MongoDB) {
      if (key.match(/_ms$/)) {
        key = key.slice(0, -'_ms'.length)
      }
      if (key in MONGO_SPECIAL_KEY_MAP) {
        key = MONGO_SPECIAL_KEY_MAP[key]
      }
    }
    return prop.labelKey || key
  }

  const getBridgeFormItemTextKey = (prop: Property) => {
    return `${getBridgeTextZone(prop)}.${getBridgeTextKey(prop)}`
  }

  const getTextKey = (prop: Property) => {
    return !typesUseBridgeText.includes(props.type)
      ? 'ConfigSchema.' + getConfigurationItemTextKey(prop)
      : 'BridgeSchema.' + getBridgeFormItemTextKey(prop)
  }

  const specialProcess = (prop: Property) => {
    // Some special handling for the enterprise version
    if (!typesUseBridgeText.includes(props.type)) {
      return undefined
    }
    switch (prop.path) {
      case 'name': {
        if (props.type === 'connector') {
          return { label: t('RuleEngine.connectorName') }
        }
        return { label: t('RuleEngine.name') }
      }
      case 'connector':
        return { label: t('components.connector') }
      case 'role':
        return { label: t('RuleEngine.role') }
      case 'enable':
        return { label: t('Base.enable') }
      case 'type':
        return { label: t('RuleEngine.actionType') }
      case 'redis_type':
        return { label: t('Auth.redisType') }
      case 'mongo_type':
        return { label: t('Auth.mongoType') }
    }
    return undefined
  }

  const getOptLabel = (key: string) => {
    const textKey = `SchemaSymbolLabel.${key}`
    return te(textKey) ? t(textKey) : key?.toString()
  }

  const getText = (prop: Property) => {
    const specialRet = specialProcess(prop)
    if (specialRet) {
      return specialRet
    }
    const key = getTextKey(prop)
    const descKey = `${key}.desc`
    if (key) {
      return {
        label: t(`${key}.label`),
        desc: te(descKey) ? t(descKey) : '',
      }
    }
    return { label: '' }
  }

  return {
    getText,
    getOptLabel,
  }
}
