import { MONGO_TYPE, REDIS_TYPE } from '@/common/constants'
import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import { BridgeType } from '@/types/enum'
import { Properties } from '@/types/schemaForm'
import { FormItemRule } from 'element-plus'
import { useRedisCommandCheck } from './useBridgeDataHandler'

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
export default (props: {
  type: string
}): {
  getComponentsHandler: () => Handler
} => {
  const { t, tl } = useI18nTl('RuleEngine')

  const { ruleWhenTestConnection } = useSpecialRuleForPassword(props)
  const { createCommonIdRule } = useFormRules()
  const addRuleForPassword = (rules: any) => {
    // TODO:consider the path
    if (!rules.password) {
      rules.password = []
    }
    if (Array.isArray(rules.password)) {
      rules.password.push(...ruleWhenTestConnection)
    }

    if (!rules.name) {
      rules.name = []
    }
    if (Array.isArray(rules.name)) {
      rules.name.push(...createCommonIdRule())
    }
    return rules
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
    const rulesRet = addRuleForPassword(rules)
    return { components: comRet, rules: rulesRet }
  }

  const { commandReg } = useRedisCommandCheck()
  const redisComponentsHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { redis_type, servers, command_template } = components
    if (redis_type?.symbols && Array.isArray(redis_type.symbols)) {
      redis_type.symbols = REDIS_TYPE
      redis_type.componentProps = { clearable: false }
    }
    if (redis_type?.symbols && Array.isArray(redis_type.symbols)) {
      redis_type.symbols = REDIS_TYPE
    }
    if (
      servers?.type === 'string' ||
      (servers?.type === 'array' && servers?.items?.type === 'string')
    ) {
      servers.type = 'string'
      servers.componentProps = {
        type: 'textarea',
        rows: 3,
      }
    }
    if (command_template?.type === 'array' && command_template?.items?.type === 'string') {
      command_template.type = 'string'
      command_template.format = 'sql'
      command_template.default = ''
    }
    if (rules?.command_template && Array.isArray(rules.command_template)) {
      rules.command_template.push({
        validator(rules: FormItemRule, value: string) {
          if (!commandReg.test(value.replace(/\n/g, ' ').trim())) {
            return Promise.reject(tl('redisCommandError'))
          }
          return Promise.resolve()
        },
        trigger: 'blur',
      })
    }
    return { components, rules }
  }

  const mongoComponentsHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { mongo_type, payload_template, servers } = components
    if (mongo_type?.symbols && Array.isArray(mongo_type.symbols)) {
      mongo_type.symbols = MONGO_TYPE
      mongo_type.componentProps = { clearable: false }
    }
    if (payload_template?.type === 'string') {
      payload_template.format = 'sql'
    }
    if (
      servers?.type === 'string' ||
      (servers?.type === 'array' && servers?.items?.type === 'string')
    ) {
      servers.type = 'string'
      servers.componentProps = {
        type: 'textarea',
        rows: 3,
      }
    }

    return { components, rules }
  }

  const GCPComponentsHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { service_account_json, payload_template } = components
    if (service_account_json?.type === 'string') {
      // The backend does not give data indicating that it is possible to upload files here, add it manually
      service_account_json.format = 'file'
      service_account_json.componentProps = {
        accept: '.json',
        tip: t('Base.uploadTip', { format: '.json' }),
      }
    }
    if (payload_template?.type === 'string') {
      payload_template.format = 'sql'
    }
    if (rules && !rules.service_account_json) {
      rules.service_account_json = []
    }
    if (rules.service_account_json && Array.isArray(rules.service_account_json)) {
      rules.service_account_json.push({
        validator(rule: FormItemRule, value: string) {
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

  const dynamoDBHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { template, aws_secret_access_key } = components

    if (template?.type === 'string') {
      template.format = 'sql'
    }
    if (aws_secret_access_key?.type === 'string') {
      aws_secret_access_key.format = 'password'
    }

    return { components, rules }
  }

  const rocketMQHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { template, secret_key, security_token } = components

    if (template?.type === 'string') {
      template.format = 'sql'
    }
    if (secret_key?.type === 'string') {
      secret_key.format = 'password'
    }
    if (security_token?.type === 'string') {
      security_token.format = 'password'
    }

    return { components, rules }
  }

  const rabbitMQHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { payload_template } = components

    if (payload_template?.type === 'string') {
      payload_template.format = 'sql'
    }

    return { components, rules }
  }

  const hStreamHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { record_template } = components

    if (record_template?.type === 'string') {
      record_template.format = 'sql'
    }

    // TODO:remove
    Reflect.deleteProperty(components, 'ssl')
    Reflect.deleteProperty(rules, 'ssl')

    return { components, rules }
  }

  const azureEventHubsHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { kafka } = components

    const { kafka_ext_header_key, kafka_ext_header_value } =
      kafka?.properties?.kafka_ext_headers?.items?.properties || {}
    const i18nPrefix = 'BridgeSchema.emqx_ee_bridge_azure_event_hub.'
    if (kafka_ext_header_key) {
      kafka_ext_header_key.label = t(`${i18nPrefix}kafka_ext_header_key.label`)
      kafka_ext_header_key.description = t(`${i18nPrefix}kafka_ext_header_key.desc`)
    }
    if (kafka_ext_header_value) {
      kafka_ext_header_value.label = t(`${i18nPrefix}kafka_ext_header_value.label`)
      kafka_ext_header_value.description = t(`${i18nPrefix}kafka_ext_header_value.desc`)
    }

    const { key, value } = kafka?.properties?.message?.properties || {}
    if (key?.type === 'string') {
      key.componentProps = { type: 'textarea', rows: 3 }
    }
    if (value?.type === 'string') {
      value.componentProps = { type: 'textarea', rows: 3 }
    }

    return { components, rules }
  }
  const amazonKinesisHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { payload_template } = components

    if (payload_template?.type === 'string') {
      payload_template.format = 'sql'
    }

    return { components, rules }
  }

  const specialBridgeHandlerMap: Record<string, Handler> = {
    [BridgeType.Redis]: redisComponentsHandler,
    [BridgeType.GCP]: GCPComponentsHandler,
    [BridgeType.MongoDB]: mongoComponentsHandler,
    [BridgeType.DynamoDB]: dynamoDBHandler,
    [BridgeType.RocketMQ]: rocketMQHandler,
    [BridgeType.RabbitMQ]: rabbitMQHandler,
    [BridgeType.HStream]: hStreamHandler,
    [BridgeType.AzureEventHubs]: azureEventHubsHandler,
    [BridgeType.AmazonKinesis]: amazonKinesisHandler,
  }

  const getComponentsHandler = () => {
    if (props.type in specialBridgeHandlerMap) {
      return specialBridgeHandlerMap[props.type]
    }
    return commonHandler
  }

  return {
    getComponentsHandler,
  }
}
