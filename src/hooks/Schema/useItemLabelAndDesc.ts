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
}

/**
 * For Log Configuration
 */
const LOG_DEFAULT_PREFIX = 'common_handler_'
const LOG_SPECIAL_KEY_PREFIX_MAP = {
  log_overload_kill_: ['mem_size', 'qlen', 'restart_after'],
  log_burst_limit_: ['max_count', 'window_time'],
  log_file_handler_: ['max_size', 'file'],
  log_rotation_: ['count'],
}

const SYS_MON_PREFIX = 'sysmon_'

export default (
  props: any,
): {
  getText: (prop: Property) => {
    label: any
    desc: string
  }
} => {
  const { t } = useI18n()

  const getTextZone = () =>
    Object.keys(TYPE_ZONE_MAP).find((key) => TYPE_ZONE_MAP[key].includes(props.type)) ||
    DEFAULT_ZONE

  const getMQTTAndSessionItemTextKey = ({ path }: Property) =>
    `${getTextZone()}.${customSnakeCase(path as string)}`

  const getLogItemTextKey = ({ key }: Property) => {
    const prefix =
      Object.entries(LOG_SPECIAL_KEY_PREFIX_MAP).find(([p, value]) =>
        value.includes(key as string),
      )?.[0] || LOG_DEFAULT_PREFIX
    return `${getTextZone()}.${prefix}${key}`
  }

  const getSysMonTextKey = ({ path }: Property) =>
    `${getTextZone()}.${SYS_MON_PREFIX}${customSnakeCase(path as string)}`

  const funcMap: Record<string, GetTextKey> = {
    mqtt: getMQTTAndSessionItemTextKey,
    session: getMQTTAndSessionItemTextKey,
    log: getLogItemTextKey,
    sysmon: getSysMonTextKey,
  }

  const getConfigurationItemTextKey = (prop: Property) => {
    const func = funcMap[props.type]
    if (func && isFunction(func)) {
      return func(prop)
    }
    return undefined
  }

  const getBridgeFormItemTextKey = ({ label, path, key }: Property) => {}

  const getTextKey = (prop: Property) =>
    props.type !== 'bridge' ? getConfigurationItemTextKey(prop) : getBridgeFormItemTextKey(prop)

  const getText = (prop: Property) => {
    if (props.type === 'bridge') {
      const { path, label, description: desc } = prop
      if (!props.customLabelMap || !path || !(path in props.customLabelMap)) {
        return { label, desc }
      }
      return { label: props.customLabelMap[path], desc }
    }
    const key = getTextKey(prop)
    if (key) {
      return {
        label: t(`Schema.${key}.label`),
        desc: t(`Schema.${key}.desc`),
      }
    }
    return { label: '', desc: '' }
  }

  return {
    getText,
  }
}
