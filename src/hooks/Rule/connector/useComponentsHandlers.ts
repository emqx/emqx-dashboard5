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
 * Set the format for the password field to control the
 * password input box configuration field on the page.
 */
const setPwdFormat = (prop: Property) => {
  prop.format = 'password'
  return prop
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

  const commonHandler: Handler = ({ components, rules }) => {
    const comRet = components
    if (comRet.enable) {
      Reflect.deleteProperty(comRet, 'enable')
    }
    if (comRet.resource_opts?.properties?.batch_time) {
      Reflect.deleteProperty(comRet.resource_opts.properties, 'batch_time')
    }
    const rulesRet = addRuleForPassword(rules)
    return { components: comRet, rules: rulesRet }
  }

  const kafkaProducerHandler: Handler = ({ components, rules }) => {
    const authList = components.authentication?.oneOf
    if (authList) {
      components.authentication.oneOf = authList.reverse()
      const pwdProp = authList.find(({ properties }) => properties?.password)?.properties?.password
      pwdProp && setPwdFormat(pwdProp)
    }
    return { components, rules }
  }

  const neededSSLConfig = [
    'enable',
    'verify',
    'server_name_indication',
    'cacertfile',
    'certfile',
    'keyfile',
  ]
  const azureEventHubsHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)

    const { authentication, ssl } = components

    const { password } = authentication?.properties || {}
    if (password?.type === 'string') {
      password.format = 'password'
      password.labelKey = 'connection_string'
    }

    if (ssl) {
      ssl.properties = pick(ssl.properties, neededSSLConfig) as Properties
      ssl.componentProps = { disabledBaseConfig: true, disabledVerify: true }
    }

    return { components, rules }
  }

  const specialConnectorHandlerMap: Map<string, Handler> = new Map([
    [BridgeType.KafkaProducer, kafkaProducerHandler],
    [BridgeType.AzureEventHubs, azureEventHubsHandler],
  ])

  const getComponentsHandler = () => {
    const specialHandler = props.type && specialConnectorHandlerMap.get(props.type)
    if (specialHandler) {
      return (data: { components: Properties; rules: SchemaRules }) => {
        const ret = commonHandler(data)
        return specialHandler(ret)
      }
    }
    return commonHandler
  }

  return {
    getComponentsHandler,
  }
}
