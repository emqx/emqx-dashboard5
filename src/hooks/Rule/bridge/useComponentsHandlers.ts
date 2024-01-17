import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import useFormRules from '@/hooks/useFormRules'
import { BridgeType } from '@/types/enum'
import { Properties, Property } from '@/types/schemaForm'
import { pick } from 'lodash'

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

  const commonHandler = ({ components, rules }: { components: Properties; rules: SchemaRules }) => {
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
    const rulesRet = addRuleForPassword(rules)
    return { components: comRet, rules: rulesRet }
  }

  const httpHandler: Handler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { parameters } = components
    if (parameters?.properties?.body?.type === 'string') {
      parameters.properties.body.format = 'sql'
    }
    if (parameters?.properties?.headers?.default) {
      parameters.properties.headers.default = pick(
        parameters.properties.headers.default,
        'content-type',
      )
    }
    return { components, rules }
  }

  const mqttHandler: Handler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { qos, retain, payload, topic } = components?.parameters?.properties || {}
    if (qos?.type === 'oneof') {
      qos.type = 'enum'
      qos.symbols = [...(getSymbolsFromOneOfArr(qos.oneOf) || []), '${qos}']
      qos.componentProps = { filterable: true, allowCreate: true }
    }
    if (retain?.type === 'oneof') {
      retain.type = 'enum'
      retain.symbols = [true, false, '${flags.retain}']
      retain.componentProps = { filterable: true, allowCreate: true }
    }
    // for detect whether it is source or action
    if (topic && !payload) {
      topic.labelKey = 'source_topic'
    }
    if (payload?.type === 'string') {
      payload.format = 'sql'
    }
    return { components, rules }
  }

  const specialBridgeHandlerMap: Record<string, Handler> = {
    [BridgeType.Webhook]: httpHandler,
    [BridgeType.MQTT]: mqttHandler,
  }

  const getComponentsHandler = () => {
    if (props.type && props.type in specialBridgeHandlerMap) {
      return specialBridgeHandlerMap[props.type]
    }
    return commonHandler
  }

  return {
    getComponentsHandler,
  }
}
