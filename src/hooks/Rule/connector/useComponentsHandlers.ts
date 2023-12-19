import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { Properties, Property } from '@/types/schemaForm'
import { pick } from 'lodash'

type Handler = ({ components, rules }: { components: Properties; rules: SchemaRules }) => {
  components: Properties
  rules: SchemaRules
}

const enum MongoType {
  Single = 'single',
  RS = 'rs',
  Sharded = 'sharded',
}

/**
 * Set the format for the password field to control the
 * password input box configuration field on the page.
 */
export const setPwdFormat = (prop: Property) => {
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
    edit?: boolean
  } & unknown,
): {
  getComponentsHandler: () => Handler
} => {
  const { t, tl } = useI18nTl('RuleEngine')

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
    if (props.edit && comRet.name) {
      comRet.name.componentProps = { disabled: true }
    }
    if (comRet.resource_opts?.properties?.batch_time) {
      Reflect.deleteProperty(comRet.resource_opts.properties, 'batch_time')
    }
    if (comRet.resource_opts?.properties?.start_after_created) {
      Reflect.deleteProperty(comRet.resource_opts.properties, 'start_after_created')
    }
    const rulesRet = addRuleForPassword(rules)
    return { components: comRet, rules: rulesRet }
  }

  const httpHandler: Handler = ({ components, rules }) => {
    const comRet = components
    if (comRet.url && !comRet.url.default) {
      comRet.url.default = 'http://'
    }
    if (comRet?.headers?.default) {
      comRet.headers.default = pick(comRet.headers.default, 'content-type')
    }
    return { components: comRet, rules }
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
  const azureEventHubsHandler: Handler = ({ components, rules }) => {
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

  const confluentHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)

    if (components?.ssl) {
      components.ssl.properties = pick(components.ssl.properties, neededSSLConfig) as Properties
      components.ssl.componentProps = { hideVerify: true }
    }

    return { components, rules }
  }

  const GCPProducerHandler: Handler = ({ components, rules }) => {
    const { service_account_json } = components
    /* Common */
    if (service_account_json?.type === 'string') {
      // The backend does not give data indicating that it is possible to upload files here, add it manually
      service_account_json.format = 'file'
      service_account_json.componentProps = {
        accept: '.json',
        tip: t('Base.uploadTip', { format: 'JSON' }),
      }
    }
    if (rules && !rules.service_account_json) {
      rules.service_account_json = []
    }
    if (rules.service_account_json && Array.isArray(rules.service_account_json)) {
      rules.service_account_json.push({
        validator(rule, value: string): any {
          return new Promise((resolve, reject) => {
            try {
              JSON.parse(value)
              resolve(true)
            } catch (error) {
              reject(tl('accountJSONError'))
            }
          })
        },
        trigger: 'blur',
      })
    }
    return { components, rules }
  }

  const mongoTypeOrder = [MongoType.Single, MongoType.RS, MongoType.Sharded]
  const getMongoTypeOrder = (ref: string) => mongoTypeOrder.findIndex((type) => ref.includes(type))
  const mongoHandler: Handler = ({ components, rules }) => {
    const { parameters } = components

    if (parameters) {
      parameters.oneOf?.sort(
        (a, b) => getMongoTypeOrder(a.$ref || '') - getMongoTypeOrder(b.$ref || ''),
      )

      const oneOf = parameters.oneOf || []
      const singleOne = oneOf?.find((item) => item.$ref?.includes(MongoType.Single))
      if (singleOne) {
        parameters.default = { mongo_type: singleOne?.properties?.mongo_type?.symbols?.[0] }
      }

      const rsOne = oneOf?.find((item) => item.$ref?.includes(MongoType.RS))
      const { servers: rsServers } = rsOne?.properties || {}
      if (rsServers) {
        rsServers.componentProps = { type: 'textarea', rows: 3 }
      }

      const shardedOne = oneOf?.find((item) => item.$ref?.includes(MongoType.Sharded))
      const { servers: shardedServers } = shardedOne?.properties || {}
      if (shardedServers) {
        shardedServers.componentProps = { type: 'textarea', rows: 3 }
      }
    }
    return { components, rules }
  }

  const specialConnectorHandlerMap: Map<string, Handler> = new Map([
    [BridgeType.Webhook, httpHandler],
    [BridgeType.KafkaProducer, kafkaProducerHandler],
    [BridgeType.AzureEventHubs, azureEventHubsHandler],
    [BridgeType.Confluent, confluentHandler],
    [BridgeType.Confluent, confluentHandler],
    [BridgeType.GCPProducer, GCPProducerHandler],
    [BridgeType.MongoDB, mongoHandler],
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
