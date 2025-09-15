import { DEFAULT_SSL_VERIFY_VALUE, SSL_VERIFY_VALUE_MAP } from '@/common/constants'
import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import useFormRules from '@/hooks/useFormRules'
import useSSL from '@/hooks/useSSL'
import MQTTIds from '@/components/Connector/MQTTIds.vue'
import { BridgeType } from '@/types/enum'
import { Properties, Property } from '@/types/schemaForm'
import { pick } from 'lodash'
import { useI18n } from 'vue-i18n'
import { markRaw } from 'vue'
import { FormRules } from '@/types/common'

type Handler = ({ components, rules }: { components: Properties; rules: SchemaRules }) => {
  components: Properties
  rules: SchemaRules
}

/**
 * Set the format for the password field to control the
 * password input box configuration field on the page.
 */
export const setPwdFormat = (prop: Property): Property => {
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
  const { t, te } = useI18n()
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

  const addRules = (rulesNeedAdd: FormRules, totalRules: FormRules) => {
    Object.entries(rulesNeedAdd).forEach(([key, value]) => {
      if (!totalRules[key]) {
        totalRules[key] = []
      }
      if (Array.isArray(value)) {
        totalRules[key].push(...value)
      }
    })
  }

  const getI18nPrefix = (type: string): string => `BridgeSchema.${type}.`

  const setLabelAndDesc = (prop: Property, path: string): void => {
    if (prop) {
      prop.label = t(`${path}.label`)
      if (te(`${path}.desc`)) {
        prop.description = t(`${path}.desc`)
      }
    }
  }

  const { createSSLForm } = useSSL()
  const SSLKeys = Object.keys(createSSLForm())
  const SSL_KEY = 'ssl'
  const filterSSLParams = (components: Properties): Properties => {
    const walk = (com: Properties): Properties => {
      Object.entries(com).forEach(([, prop]) => {
        if (prop.properties) {
          if (prop.key === SSL_KEY) {
            prop.properties = pick(prop.properties, SSLKeys)
            if (prop.properties.verify) {
              prop.properties.verify.default = DEFAULT_SSL_VERIFY_VALUE
            }
          } else {
            walk(prop.properties)
          }
        }
      })
      return com
    }
    return walk(components)
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
    if (comRet.tags) {
      Reflect.deleteProperty(comRet, 'tags')
    }
    const filteredSSL = filterSSLParams(comRet)
    const rulesRet = addRuleForPassword(rules)
    return { components: filteredSSL, rules: rulesRet }
  }

  const httpHandler: Handler = ({ components, rules }) => {
    const comRet = components
    if (comRet.url && !comRet.url.default) {
      comRet.url.default = 'http://'
    }
    if (comRet?.headers?.default) {
      comRet.headers.default = pick(comRet.headers.default, 'content-type')
    }
    if (comRet?.ssl?.properties?.verify) {
      comRet.ssl.properties.verify.default = SSL_VERIFY_VALUE_MAP.get(false)
    }
    return { components: comRet, rules }
  }

  const mqttHandler: Handler = ({ components, rules }) => {
    const comRet = components
    if (comRet?.server) {
      comRet.server.componentProps = { placeholder: 'broker.emqx.io:1883' }
    }
    if (comRet?.retry_interval?.type === 'string') {
      comRet.retry_interval.type = 'duration'
    }
    if (comRet?.keepalive?.type === 'string') {
      comRet.keepalive.type = 'duration'
    }
    // Add labels and descriptions for ids and node
    const i18nPrefix = getI18nPrefix(BridgeType.MQTT)
    if (comRet?.static_clientids?.items?.properties) {
      const props = comRet.static_clientids.items.properties
      if (props.ids) {
        setLabelAndDesc(props.ids, `${i18nPrefix}ids`)
        props.ids.customComponent = markRaw(MQTTIds)
      }
      if (props.node) {
        setLabelAndDesc(props.node, `${i18nPrefix}node`)
      }
      addRules(
        {
          'static_clientids.ids': [
            {
              validator(_rules: any, value: any, cb: any) {
                const allPass =
                  value.length > 0 &&
                  value.every((item: any) => {
                    if (typeof item === 'string') {
                      return !!item
                    }
                    return !!item.clientid
                  })
                cb(allPass ? undefined : new Error(t('Rule.inputRequired')))
              },
            },
          ],
        },
        rules,
      )
    }

    return { components: comRet, rules }
  }

  const specialConnectorHandlerMap: Map<string, Handler> = new Map([
    [BridgeType.Webhook, httpHandler],
    [BridgeType.MQTT, mqttHandler],
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
