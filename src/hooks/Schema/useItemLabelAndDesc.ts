import { Property } from '@/types/schemaForm'
import { useI18n } from 'vue-i18n'

export default (
  props: any,
): {
  getLabel: (prop: Property) => any
} => {
  const { t } = useI18n()

  const typeZoneMap: Record<string, Array<string>> = {
    emqx_schema: ['mqtt', 'session', 'sysmon'],
    emqx_conf_schema: ['log'],
  }
  const getTextZone = () =>
    Object.keys(typeZoneMap).find((key) => typeZoneMap[key].includes(props.type)) || 'emqx_schema'

  const typePrefixMap: Record<string, Array<string>> = {
    mqtt: ['mqtt', 'session'],
    common_handler: ['log'],
  }
  const getPrefixByType = () =>
    Object.keys(typePrefixMap).find((key) => typePrefixMap[key].includes(props.type)) || props.type

  const getConfigurationItemLabel = ({ label, path, key }: Property) => {}

  const getBridgeItemLabel = ({ label, path, key }: Property) => {
    if (!props.customLabelMap || !path || !(path in props.customLabelMap)) {
      return label
    }
    return props.customLabelMap[path]
  }

  const getLabel = ({ path, label }: Property) => {
    if (!props.customLabelMap || !path || !(path in props.customLabelMap)) {
      return label
    }
    return props.customLabelMap[path]
  }

  return {
    getLabel,
  }
}
