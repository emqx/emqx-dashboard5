import { SSL_FIELDS, INTEGRATION_SCHEMA_TYPES } from '@/common/constants'
import {
  useActionSchema,
  useConnectorSchema,
  useSourceSchema,
} from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { BridgeType } from '@/types/enum'
import actionText from '@/schemaText/actionText/index'
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
const COMMON_ZONE = 'common'
const COMMON_FIELD_KEYS = Object.keys(actionText.en.common)

const BRIDGE_SPECIAL_TYPE_MAP: Map<string, string> = new Map([
  [BridgeType.MatrixDB, 'pgsql'],
  [BridgeType.TimescaleDB, 'pgsql'],
])

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

  const { getTypeByConnectorSchemaRef } = useConnectorSchema()
  const { getTypeByActionSchemaRef } = useActionSchema()
  const { getTypeBySourceSchemaRef } = useSourceSchema()
  const getTypeBySchemaRef = () => {
    const { ref } = props.accordingTo
    if (props.type === 'action') {
      return getTypeByActionSchemaRef(ref)
    }
    if (props.type === 'source') {
      return getTypeBySourceSchemaRef(ref)
    }
    return getTypeByConnectorSchemaRef(ref)
  }

  const getHotConfText = (prop: Property) => {
    const textKey = 'ConfigSchema.' + getConfigurationItemTextKey(prop)
    const descKey = `${textKey}.desc`
    if (textKey) {
      return {
        label: t(`${textKey}.label`),
        desc: te(descKey) ? t(descKey) : '',
      }
    }
    return { label: '' }
  }

  const getBridgeTextKey = (prop: Property) => prop.key && (prop.labelKey || prop.key)

  const getActionFormItemTextPath = (prop: Property, textType: 'label' | 'desc') => {
    if (!props.accordingTo?.ref) {
      return ''
    }
    const textFinalKey = getBridgeTextKey(prop)
    let type = getTypeBySchemaRef()
    const specifiedType = BRIDGE_SPECIAL_TYPE_MAP.get(type)
    if (specifiedType) {
      type = specifiedType
    }
    const typeTextPath = `BridgeSchema.${type}.${textFinalKey}.${textType}`
    /**
     * If there is available text in the type zone,
     * the text in the type zone will be taken first.
     * Otherwise, the text in the common zone will be taken.
     * Do this for override some of the less precise commons in the share-ui.
     */
    if (prop.key && COMMON_FIELD_KEYS.includes(prop.key) && !prop.labelKey && !te(typeTextPath)) {
      return `BridgeSchema.${COMMON_ZONE}.${textFinalKey}.${textType}`
    }
    return typeTextPath
  }

  const getActionTextPath = (prop: Property) => {
    return {
      labelPath: getActionFormItemTextPath(prop, 'label'),
      descPath: getActionFormItemTextPath(prop, 'desc'),
    }
  }

  const getActionSpecialText = (prop: Property) => {
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

  const getActionText = (prop: Property) => {
    const specialRet = getActionSpecialText(prop)
    if (specialRet) {
      return specialRet
    }
    const { labelPath, descPath } = getActionTextPath(prop)
    if (labelPath) {
      return {
        label: t(labelPath),
        desc: te(descPath) ? t(descPath) : '',
      }
    }
    return { label: '' }
  }

  const getOptLabel = (key: string) => {
    const textKey = `SchemaSymbolLabel.${key}`
    return te(textKey) ? t(textKey) : key?.toString()
  }

  const getText = (prop: Property) => {
    if (!typesUseBridgeText.includes(props.type)) {
      return getHotConfText(prop)
    }
    return getActionText(prop)
  }

  return {
    getText,
    getOptLabel,
  }
}
