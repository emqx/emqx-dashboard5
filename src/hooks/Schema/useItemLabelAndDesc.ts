import { useBridgeSchema } from '@/hooks/Rule/bridge/useBridgeTypeValue'
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
}

/**
 * For Log Configuration
 */
const LOG_DEFAULT_PREFIX = 'common_handler_'
const LOG_SPECIAL_KEY_PREFIX_MAP = {
  log_overload_kill_: ['mem_size', 'qlen', 'restart_after'],
  log_burst_limit_: ['max_count', 'window_time'],
  log_file_handler_: ['max_size', 'path', 'rotation_size'],
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
]

const BRIDGE_SPECIAL_TYPE_MAP: Record<string, string> = {
  matrix: 'pgsql',
  timescale: 'pgsql',
}

export default (
  props: any,
): {
  getText: (prop: Property) => {
    label: any
    desc: string
  }
  getOptLabel: (key: string) => string
} => {
  const { t, te } = useI18n()

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
      Object.entries(LOG_SPECIAL_KEY_PREFIX_MAP).find(([, value]) =>
        value.includes(key as string),
      )?.[0] || LOG_DEFAULT_PREFIX
    return `${getConfigurationTextZone()}.${prefix}${key}`
  }

  const getSysMonTextKey = ({ path }: Property) =>
    `${getConfigurationTextZone()}.${SYS_MON_PREFIX}${customSnakeCase(path as string)}`

  const getLimiterTextKey = ({ key }: Property) => `${getConfigurationTextZone()}.${key}`

  const funcMap: Record<string, GetTextKey> = {
    mqtt: getMQTTAndSessionItemTextKey,
    session: getMQTTAndSessionItemTextKey,
    log: getLogItemTextKey,
    sysmon: getSysMonTextKey,
    limiter: getLimiterTextKey,
  }

  const getConfigurationItemTextKey = (prop: Property) => {
    const func = funcMap[props.type]
    if (func && isFunction(func)) {
      return func(prop)
    }
    return undefined
  }

  const { getTypeBySchemaRef } = useBridgeSchema()
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
    if (prop.key && COMMON_CONNECTOR_KEY.includes(prop.key)) {
      return COMMON_CONNECTOR_ZONE
    }
    let type = getTypeBySchemaRef(props.accordingTo.ref)
    if (type in BRIDGE_SPECIAL_TYPE_MAP) {
      type = BRIDGE_SPECIAL_TYPE_MAP[type]
    }
    return `emqx_ee_bridge_${type}`
  }

  const getBridgeFormItemTextKey = (prop: Property) => {
    return `${getBridgeTextZone(prop)}.${prop.key}`
  }

  const getTextKey = (prop: Property) => {
    return props.type !== 'bridge'
      ? 'ConfigSchema.' + getConfigurationItemTextKey(prop)
      : 'BridgeSchema.' + getBridgeFormItemTextKey(prop)
  }

  const specialProcess = (prop: Property) => {
    // Some special handling for the enterprise version
    return undefined
  }

  const getOptLabel = (key: string) => {
    const textKey = `SchemaSymbolLabel.${key}`
    return te(textKey) ? t(textKey) : key.toString()
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
    return { label: '', desc: '' }
  }

  return {
    getText,
    getOptLabel,
  }
}
