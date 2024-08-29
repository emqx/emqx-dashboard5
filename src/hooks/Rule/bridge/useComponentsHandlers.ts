import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import useFormRules from '@/hooks/useFormRules'
import { BridgeType } from '@/types/enum'
import { Properties, Property } from '@/types/schemaForm'
import { pick } from 'lodash'
import { useAvailableProviders } from '../useProvidersForMonaco'
import useSQLAvailablePlaceholder from '../useSQLAvailablePlaceholder'

type Handler = ({ components, rules }: { components: Properties; rules: SchemaRules }) => {
  components: Properties
  rules: SchemaRules
}

/**
 * Sometimes it is necessary to make some custom changes to the components used by the schema form component,
 * such as adding a secondary type selection,
 * or changing the type of a form item if the data given by the backend is incorrect,
 * etc. This can be defined here.
 */
export default (
  props: {
    type?: string
    edit: boolean
  } & unknown,
): {
  getComponentsHandler: () => Handler
} => {
  const { ruleWhenEditing } = useSpecialRuleForPassword(props)
  const { createCommonIdRule } = useFormRules()
  const addRuleForPassword = (rules: any) => {
    // TODO:consider the path
    if (!rules.password) {
      rules.password = []
    }
    if (Array.isArray(rules.password)) {
      rules.password.push(...ruleWhenEditing)
    }

    if (!rules.name) {
      rules.name = []
    }
    if (Array.isArray(rules.name)) {
      rules.name.push(...createCommonIdRule())
    }
    return rules
  }

  const getSymbolsFromOneOfArr = (oneof: Property['oneOf']): Property['symbols'] => {
    if (!oneof) {
      return []
    }
    return oneof.reduce((arr: Array<string | number | boolean>, item) => {
      if (item.type === 'enum' && item.symbols) {
        arr.push(...item.symbols)
      }
      return arr
    }, [])
  }

  const setComponentProps = (prop: Property, componentProps: Record<string, any>) => {
    prop.componentProps = Object.assign(prop.componentProps || {}, componentProps)
  }

  const { availablePlaceholders } = useSQLAvailablePlaceholder()
  const { completionProvider } = useAvailableProviders()

  const handleProp = (parm: Property) => {
    const walk = (prop: Property) => {
      if (prop.properties) {
        Object.values(prop.properties).forEach((item) => walk(item))
      } else if (prop.type === 'oneof') {
        prop.oneOf?.forEach((item) => walk(item))
      } else if (
        ['string', 'sql'].includes(prop.type) &&
        prop.format === 'sql' &&
        prop.is_template
      ) {
        setComponentProps(prop, { completionProvider })
      } else if (prop.type === 'object' && !prop.properties && prop.is_template) {
        setComponentProps(prop, { supportPlaceholder: ['key', 'value'] })
      }
    }

    walk(parm)
    return parm
  }

  const commonHandler: Handler = ({ components, rules }) => {
    const comRet = components
    if (comRet.resource_opts?.properties?.start_after_created) {
      Reflect.deleteProperty(comRet.resource_opts.properties, 'start_after_created')
    }
    if (comRet.resource_opts?.properties?.batch_time) {
      Reflect.deleteProperty(comRet.resource_opts.properties, 'batch_time')
    }
    if (comRet.local_topic) {
      Reflect.deleteProperty(comRet, 'local_topic')
    }
    if (comRet.tags) {
      Reflect.deleteProperty(comRet, 'tags')
    }
    const paramsProps = components?.parameters
    if (paramsProps) {
      handleProp(paramsProps)
    }

    const rulesRet = addRuleForPassword(rules)
    return { components: comRet, rules: rulesRet }
  }

  const mqttHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)
    const { qos, retain, payload, topic } = components?.parameters?.properties || {}
    if (qos?.type === 'oneof') {
      qos.type = 'enum'
      qos.symbols = [
        ...(getSymbolsFromOneOfArr(qos.oneOf) || []),
        '${qos}',
        ...availablePlaceholders.value,
      ]
      setComponentProps(qos, { filterable: true, allowCreate: true })
    }
    if (retain?.type === 'oneof') {
      retain.type = 'enum'
      retain.symbols = [true, false, '${flags.retain}', ...availablePlaceholders.value]
      setComponentProps(retain, { filterable: true, allowCreate: true })
    }
    // for detect whether it is source or action
    if (topic && !payload) {
      topic.labelKey = 'source_topic'
    }
    if (!payload && qos?.type === 'enum' && qos.symbols) {
      /** QoS2 is not supported yet https://emqx.atlassian.net/browse/ED-1224  */
      qos.symbols = qos.symbols.filter((item) => item !== 2)
    }
    if (payload?.type === 'string') {
      payload.format = 'sql'
    }
    return { components, rules }
  }

  const httpHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)
    const { body, headers } = components?.parameters?.properties || {}

    if (body?.type === 'string') {
      body.format = 'sql'
    }
    if (headers?.default) {
      headers.default = pick(headers.default, 'content-type')
    }
    return { components, rules }
  }

  const specialBridgeHandlerMap: Record<string, Handler> = {
    [BridgeType.Webhook]: httpHandler,
    [BridgeType.MQTT]: mqttHandler,
  }

  const getComponentsHandler = () => {
    const specialHandler = props.type && specialBridgeHandlerMap[props.type]
    if (specialHandler) {
      return (data: { components: Properties; rules: SchemaRules }) => {
        const ret = specialHandler(data)
        return commonHandler(ret)
      }
    }
    return commonHandler
  }

  return {
    getComponentsHandler,
  }
}
