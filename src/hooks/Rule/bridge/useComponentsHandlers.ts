import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { Properties, Property } from '@/types/schemaForm'
import { FormItemRule } from 'element-plus'
import { useRedisCommandCheck } from '../useDataHandler'
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
  const { t, tl, te } = useI18nTl('RuleEngine')

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

  const setLabelAndDesc = (prop: Property, path: string) => {
    if (prop) {
      prop.label = t(`${path}.label`)
      if (te(`${path}.desc`)) {
        prop.description = t(`${path}.desc`)
      }
    }
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

  const { commandReg } = useRedisCommandCheck()
  const redisComponentsHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { command_template } = components?.parameters?.properties || {}
    if (command_template?.type === 'array' && command_template?.items?.type === 'string') {
      command_template.type = 'string'
      command_template.format = 'sql'
      command_template.default = ''
    }
    if (
      rules?.['parameters.command_template'] &&
      Array.isArray(rules['parameters.command_template'])
    ) {
      rules['parameters.command_template'].push({
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

    const { parameters } = components
    if (parameters?.properties?.payload_template) {
      parameters.properties.payload_template.format = 'sql'
    }

    return { components, rules }
  }

  const GCPProducerComponentsHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { parameters } = components

    if (parameters?.properties?.payload_template?.type === 'string') {
      parameters.properties.payload_template.format = 'sql'
    }

    if (parameters?.properties?.attributes_template) {
      const attTemp = parameters.properties.attributes_template
      const i18nPrefix = 'components.'
      const { key, value } = attTemp?.items?.properties || {}
      const properties = { key, value }
      Object.entries(properties).forEach(([key, value]) => (value.label = t(`${i18nPrefix}${key}`)))
    }

    return { components, rules }
  }

  const GCPConsumerComponentsHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { service_account_json, consumer } = components

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

    if (consumer) {
      const i18nPrefix = 'BridgeSchema.emqx_ee_bridge_gcp_pubsub.'
      const { pubsub_topic, mqtt_topic, qos, payload_template } =
        consumer?.properties?.topic_mapping?.items?.properties || {}
      const properties = [
        { prop: pubsub_topic, key: 'consumer_pubsub_topic' },
        { prop: mqtt_topic, key: 'consumer_mqtt_topic' },
        { prop: qos, key: 'consumer_qos' },
        { prop: payload_template, key: 'payload_template' },
      ]
      properties.forEach(({ prop, key }) => prop && setLabelAndDesc(prop, `${i18nPrefix}${key}`))
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

    return { components, rules }
  }

  const azureEventHubsHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)

    const { parameters } = components

    const { kafka_ext_header_key, kafka_ext_header_value } =
      parameters?.properties?.kafka_ext_headers?.items?.properties || {}
    const i18nPrefix = 'BridgeSchema.emqx_ee_bridge_azure_event_hub.'
    kafka_ext_header_key &&
      setLabelAndDesc(kafka_ext_header_key, `${i18nPrefix}kafka_ext_header_key`)
    kafka_ext_header_value &&
      setLabelAndDesc(kafka_ext_header_value, `${i18nPrefix}kafka_ext_header_value`)

    const { key, value } = parameters?.properties?.message?.properties || {}
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
    const { payload_template, aws_secret_access_key } = components

    if (payload_template?.type === 'string') {
      payload_template.format = 'sql'
    }

    if (aws_secret_access_key?.type === 'string') {
      aws_secret_access_key.format = 'password'
    }

    return { components, rules }
  }

  const greptimeDBHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)

    // TODO:remove
    Reflect.deleteProperty(components, 'ssl')
    Reflect.deleteProperty(rules, 'ssl')

    return { components, rules }
  }

  const syskeeperDbHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const { parameters } = components
    if (parameters?.properties?.template) {
      parameters.properties.template.format = 'sql'
    }
    if (parameters?.properties?.target_qos && parameters.properties.target_qos.type === 'number') {
      parameters.properties.target_qos.type = 'enum'
      parameters.properties.target_qos.symbols = [0, 1, 2]
      parameters.properties.target_qos.default = ''
    }
    return { components, rules }
  }

  const getSymbolsFromOneOfArr = (oneof: Property['oneOf']): Property['symbols'] => {
    if (!oneof) {
      return []
    }
    return oneof.reduce((arr: Array<string | number>, item) => {
      if (item.type === 'enum' && item.symbols) {
        arr.push(...item.symbols)
      }
      return arr
    }, [])
  }

  const IoTDBHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)
    const dataProps = components?.parameters?.properties?.data?.items?.properties
    if (dataProps) {
      const { data_type, timestamp } = dataProps
      if (data_type && data_type.type === 'oneof') {
        data_type.type = 'enum'
        data_type.symbols = getSymbolsFromOneOfArr(data_type.oneOf)
        data_type.default ??= ''
        data_type.componentProps = { filterable: true, allowCreate: true }
      }
      if (timestamp && timestamp.type === 'oneof') {
        timestamp.type = 'enum'
        timestamp.symbols = getSymbolsFromOneOfArr(timestamp.oneOf)
        timestamp.default ??= ''
        timestamp.componentProps = { filterable: true, allowCreate: true }
      }
      const i18nPrefix = 'BridgeSchema.emqx_ee_bridge_iotdb.'
      Object.entries(dataProps).forEach(([key, value]) =>
        setLabelAndDesc(value, `${i18nPrefix}${key}`),
      )
    }
    return { components, rules }
  }

  const specialBridgeHandlerMap: Record<string, Handler> = {
    [BridgeType.Webhook]: httpHandler,
    [BridgeType.Redis]: redisComponentsHandler,
    [BridgeType.GCPProducer]: GCPProducerComponentsHandler,
    [BridgeType.GCPConsumer]: GCPConsumerComponentsHandler,
    [BridgeType.MongoDB]: mongoComponentsHandler,
    [BridgeType.DynamoDB]: dynamoDBHandler,
    [BridgeType.RocketMQ]: rocketMQHandler,
    [BridgeType.RabbitMQ]: rabbitMQHandler,
    [BridgeType.HStream]: hStreamHandler,
    [BridgeType.AzureEventHubs]: azureEventHubsHandler,
    [BridgeType.Confluent]: azureEventHubsHandler,
    [BridgeType.AmazonKinesis]: amazonKinesisHandler,
    [BridgeType.GreptimeDB]: greptimeDBHandler,
    [BridgeType.SysKeeperForwarder]: syskeeperDbHandler,
    [BridgeType.IoTDB]: IoTDBHandler,
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
