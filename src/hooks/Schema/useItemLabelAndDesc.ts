import { INTEGRATION_SCHEMA_TYPES } from '@/common/constants'
import {
  useActionSchema,
  useConnectorSchema,
  useSourceSchema,
} from '@/hooks/Rule/bridge/useBridgeTypeValue'
import actionText from '@/schemaText/actionText/index'
import { Property } from '@/types/schemaForm'
import { isFunction, snakeCase } from 'lodash'
import { useI18n } from 'vue-i18n'

type GetTextKey = (prop: Property) => string

const numReg = /_\d/g
const customSnakeCase = (str: string) =>
  snakeCase(str).replace(numReg, (match) => match.replace('_', ''))

const DEFAULT_ZONE = ''

/**
 * For Log Configuration
 */
const LOG_DEFAULT_PREFIX = ''
const LOG_SPECIAL_KEY_PREFIX_MAP = {
  log_file_handler_: ['max_size', 'path'],
}

const SYS_MON_PREFIX = 'sysmon_'

// Bridge
const COMMON_ZONE = 'common'
const COMMON_FIELD_KEYS = Object.keys(actionText.en.common)

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

  /**
   * zone is first level
   */
  const getConfigurationTextZone = () => DEFAULT_ZONE

  const getMQTTAndSessionItemTextKey = ({ path }: Property) =>
    `${getConfigurationTextZone()}${customSnakeCase(path as string)}`

  const getLogItemTextKey = ({ key, path }: Property) => {
    const prefix =
      Object.entries(LOG_SPECIAL_KEY_PREFIX_MAP).find(
        ([, value]) => value.includes(path as string) || value.includes(key as string),
      )?.[0] || LOG_DEFAULT_PREFIX
    return `${getConfigurationTextZone()}${prefix}${key}`
  }

  const getSysMonTextKey = ({ path }: Property) =>
    `${getConfigurationTextZone()}${SYS_MON_PREFIX}${customSnakeCase(path as string)}`

  const getLimiterTextKey = ({ key }: Property) => `${getConfigurationTextZone()}${key}`

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
    const type = getTypeBySchemaRef()
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
