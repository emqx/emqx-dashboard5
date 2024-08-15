import useSpecialRuleForPassword from '@/hooks/Rule/bridge/useSpecialRuleForPassword'
import { SchemaRules } from '@/hooks/Schema/useSchemaFormRules'
import useSchemaRecord from '@/hooks/Schema/useSchemaRecord'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { FormRules } from '@/types/common'
import { BridgeType } from '@/types/enum'
import { Properties, Property } from '@/types/schemaForm'
import { FormItemRule } from 'element-plus'
import { cloneDeep, escapeRegExp, get, pick } from 'lodash'
import { useRedisCommandCheck } from '../useDataHandler'
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
  } & unknown,
): {
  getComponentsHandler: () => Handler
} => {
  const { t, tl, te } = useI18nTl('RuleEngine')

  const { ruleWhenEditing } = useSpecialRuleForPassword(props)
  const { createCommonIdRule } = useFormRules()
  const { initRecordByComponents } = useSchemaRecord()
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

  const getI18nPrefix = (type: string) => `BridgeSchema.${type}.`

  const setLabelAndDesc = (prop: Property, path: string) => {
    if (prop) {
      prop.label = t(`${path}.label`)
      if (te(`${path}.desc`)) {
        prop.description = t(`${path}.desc`)
      }
    }
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

  const { availablePlaceholders } = useSQLAvailablePlaceholder()
  const { completionProvider } = useAvailableProviders()
  const { availableFields } = useSQLAvailablePlaceholder()

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
    const paramsProps = components?.parameters
    if (paramsProps) {
      handleProp(paramsProps)
    }

    const rulesRet = addRuleForPassword(rules)
    return { components: comRet, rules: rulesRet }
  }

  const mqttHandler: Handler = (data: { components: Properties; rules: SchemaRules }) => {
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

  const httpHandler: Handler = (data: { components: Properties; rules: SchemaRules }) => {
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

  const { commandReg } = useRedisCommandCheck()
  const redisComponentsHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)
    const { command_template } = components?.parameters?.properties || {}
    if (command_template?.type === 'array' && command_template?.items?.type === 'string') {
      command_template.type = 'string'
      command_template.format = 'sql'
      command_template.default = ''
      command_template.is_template = true
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

  const mongoComponentsHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)

    const { parameters } = components
    if (parameters?.properties?.payload_template) {
      parameters.properties.payload_template.format = 'sql'
    }

    return { components, rules }
  }

  const GCPProducerComponentsHandler: Handler = (data) => {
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

  const dynamoDBHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)

    if (components?.parameters?.properties?.template?.type === 'string') {
      components.parameters.properties.template.format = 'sql'
    }

    return { components, rules }
  }

  const rocketMQHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)

    if (components?.parameters?.properties?.template?.type === 'string') {
      components.parameters.properties.template.format = 'sql'
    }

    return { components, rules }
  }

  const rabbitMQHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)

    if (components?.parameters?.properties?.payload_template?.type === 'string') {
      components.parameters.properties.payload_template.format = 'sql'
    }

    return { components, rules }
  }

  const hStreamHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)

    if (components?.parameters?.properties?.record_template?.type === 'string') {
      components.parameters.properties.record_template.format = 'sql'
    }
    if (components?.parameters?.properties?.batch_size) {
      components.parameters.properties.batch_size.labelKey = 'hstream_batch_size'
    }
    return { components, rules }
  }

  const kafkaProducerHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)

    const { parameters } = components

    if (parameters?.properties?.partitions_limit) {
      parameters.properties.partitions_limit.componentProps = {
        disabledLabel: t('SchemaSymbolLabel.all_partitions'),
      }
    }

    const { kafka_ext_header_key, kafka_ext_header_value } =
      parameters?.properties?.kafka_ext_headers?.items?.properties || {}
    const i18nPrefix = getI18nPrefix(BridgeType.AzureEventHubs)
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

  const kafkaConsumerHandler: Handler = (data) => {
    const { rules } = commonHandler(data)
    addRules(
      { 'parameters.group_id': [{ pattern: /^[a-zA-Z0-9._-]*$/, message: tl('illegalGroupId') }] },
      rules,
    )
    return { ...data, rules }
  }

  const amazonKinesisHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)

    if (components?.parameters?.properties?.payload_template?.type === 'string') {
      components.parameters.properties.payload_template.format = 'sql'
    }

    return { components, rules }
  }

  const syskeeperDbHandler: Handler = (data) => {
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

  const IoTDBHandler: Handler = (data) => {
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
      const i18nPrefix = getI18nPrefix(BridgeType.IoTDB)

      Object.entries(dataProps).forEach(([key, value]) =>
        setLabelAndDesc(value, `${i18nPrefix}${key}`),
      )
    }
    return { components, rules }
  }

  const elaActionTypeOrder = [/create/i, /update/i, /delete/i]
  const getElaActionTypeOrder = (ref: string) =>
    elaActionTypeOrder.findIndex((reg) => reg.test(ref))
  const elasticsearchHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)
    const { parameters } = components || {}
    const oneOfArr = parameters?.oneOf
    if (oneOfArr) {
      oneOfArr.sort(
        (a, b) => getElaActionTypeOrder(a.$ref || '') - getElaActionTypeOrder(b.$ref || ''),
      )
      oneOfArr.forEach((item) => {
        if (item.properties) {
          Reflect.deleteProperty(item.properties, 'require_alias')
          if (parameters.path) {
            // Because the properties of oneof have been modified,
            // the default needs to be recalculated...
            item.default = get(initRecordByComponents(item.properties), parameters.path)
          }
          if (item.properties.doc && item.properties.doc.type === 'string') {
            item.properties.doc.format = 'sql'
          }
        }
      })
      const createOne = oneOfArr.find((item) => item.$ref && /create/.test(item.$ref))
      if (createOne) {
        parameters.default = createOne.default
      }
    }
    return { components, rules }
  }

  const openTSDBHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)

    const { parameters } = components
    const properties = parameters?.properties?.data?.items?.properties || {}
    const i18nPrefix = getI18nPrefix(BridgeType.OpenTSDB)
    Object.entries(properties).forEach(([key, value]) => {
      setLabelAndDesc(value, `${i18nPrefix}${key}`)

      if (key === 'value' && value.type === 'oneof') {
        value.type = 'string'
        value.is_template = true
      } else if (key === 'tags' && value.type === 'oneof') {
        value.type = 'object'
        value.componentProps = { type: 'input', supportPlaceholder: ['key', 'value'] }
        value.default = {}
      }
    })

    return { components, rules }
  }

  const enum S3AggKeyPlaceholder {
    Action = '${action}',
    Node = '${node}',
    DataTime = '${datetime.{format}}',
    DateTimeUntil = '${datetime_until.{format}}',
    Sequence = '${sequence}',
  }
  const s3AggKeyRequiredPlaceholder = [
    S3AggKeyPlaceholder.Action,
    S3AggKeyPlaceholder.Node,
    S3AggKeyPlaceholder.DataTime,
    S3AggKeyPlaceholder.Sequence,
  ]
  const s3AggKeyRequiredReg = s3AggKeyRequiredPlaceholder.map((item) => {
    if (item === S3AggKeyPlaceholder.DataTime) {
      return new RegExp(escapeRegExp(item).replace('\\{format\\}', '\\w+'))
    }
    return new RegExp(escapeRegExp(item))
  })
  const timeFormat = ['rfc3339utc', 'rfc3339', 'unix']

  const S3SpecialPlaceholder = [
    S3AggKeyPlaceholder.Action,
    S3AggKeyPlaceholder.Node,
    ...timeFormat.map((f) => S3AggKeyPlaceholder.DataTime.replace('{format}', f)),
    ...timeFormat.map((f) => S3AggKeyPlaceholder.DateTimeUntil.replace('{format}', f)),
    S3AggKeyPlaceholder.Sequence,
  ]
  const S3SpecialPlaceholderDefault = '${action}/${node}/${datetime.rfc3339utc}_N${sequence}.csv'
  const S3SpecialPlaceholderRule: FormItemRule = {
    validator(rules, value, cb) {
      cb(
        !s3AggKeyRequiredReg.every((reg) => reg.test(value))
          ? new Error(tl('somePlaceholderRequired'))
          : undefined,
      )
    },
    trigger: 'blur',
  }

  const S3Handler: Handler = (data) => {
    const { components, rules } = commonHandler(data)
    const { parameters } = components
    const directItem = parameters?.oneOf?.find((item) => /direct/i.test(item.$ref || ''))

    if (parameters && directItem) {
      parameters.default = cloneDeep(directItem.default)
      parameters.useNewCom = true
      setComponentProps(parameters, { type: 'radio' })

      if (directItem?.properties?.content?.type === 'string') {
        directItem.properties.content.format = 'sql'
      }
    }

    const aggItem = parameters?.oneOf?.find((item) => /aggregated/i.test(item.$ref || ''))
    const aggType = aggItem?.properties?.container?.properties?.type
    const aggKeyPara = aggItem?.properties?.key
    const columnOrder = aggItem?.properties?.container?.properties?.column_order
    if (columnOrder) {
      if (!columnOrder.componentProps) {
        columnOrder.componentProps = {}
      }
      columnOrder.componentProps.default = availableFields.value
    }
    if (aggType) {
      aggType.title = tl('aggregationSettings')
    }
    if (aggKeyPara) {
      aggKeyPara.labelKey = 'aggregated_key'
      setComponentProps(aggKeyPara, { customPlaceholders: S3SpecialPlaceholder })
      aggKeyPara.default = S3SpecialPlaceholderDefault
    }
    if (aggItem?.rules) {
      addRules({ 'parameters.key': [S3SpecialPlaceholderRule] }, aggItem.rules)
    }

    return { components, rules }
  }

  const azureBlobHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)
    const { parameters } = components
    const directItem = parameters?.oneOf?.find((item) => /direct/i.test(item.$ref || ''))

    if (parameters && directItem) {
      parameters.default = cloneDeep(directItem.default)
      parameters.useNewCom = true
      setComponentProps(parameters, { type: 'radio' })

      if (directItem?.properties?.content?.type === 'string') {
        directItem.properties.content.format = 'sql'
      }
    }

    const aggItem = parameters?.oneOf?.find((item) => /aggre/i.test(item.$ref || ''))
    const aggType = aggItem?.properties?.aggregation?.properties?.container?.properties?.type
    const blobPara = aggItem?.properties?.blob
    const columnOrder =
      aggItem?.properties?.aggregation?.properties?.container?.properties?.column_order
    if (columnOrder) {
      if (!columnOrder.componentProps) {
        columnOrder.componentProps = {}
      }
      columnOrder.componentProps.default = availableFields.value
    }
    if (aggType) {
      aggType.title = tl('aggregationSettings')
    }
    if (blobPara) {
      blobPara.labelKey = 'aggregated_blob'
      setComponentProps(blobPara, { customPlaceholders: S3SpecialPlaceholder })
      blobPara.default = S3SpecialPlaceholderDefault
    }
    if (aggItem?.rules) {
      addRules({ 'parameters.blob': [S3SpecialPlaceholderRule] }, aggItem.rules)
    }

    return { components, rules }
  }

  const pulsarHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)

    const { parameters } = components

    const { key, value } = parameters?.properties?.message?.properties || {}
    if (key?.type === 'string') {
      key.componentProps = { type: 'textarea', rows: 3 }
    }
    if (value?.type === 'string') {
      value.componentProps = { type: 'textarea', rows: 3 }
    }

    return { components, rules }
  }

  const couchbaseHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)

    const { parameters } = components
    if (parameters?.properties?.sql) {
      parameters.properties.sql.format = 'sql'
    }

    return { components, rules }
  }

  const specialBridgeHandlerMap: Record<string, Handler> = {
    [BridgeType.MQTT]: mqttHandler,
    [BridgeType.Webhook]: httpHandler,
    [BridgeType.Redis]: redisComponentsHandler,
    [BridgeType.GCPProducer]: GCPProducerComponentsHandler,
    [BridgeType.MongoDB]: mongoComponentsHandler,
    [BridgeType.DynamoDB]: dynamoDBHandler,
    [BridgeType.RocketMQ]: rocketMQHandler,
    [BridgeType.RabbitMQ]: rabbitMQHandler,
    [BridgeType.HStream]: hStreamHandler,
    [BridgeType.KafkaProducer]: kafkaProducerHandler,
    [BridgeType.KafkaConsumer]: kafkaConsumerHandler,
    [BridgeType.AzureEventHubs]: kafkaProducerHandler,
    [BridgeType.Confluent]: kafkaProducerHandler,
    [BridgeType.AmazonKinesis]: amazonKinesisHandler,
    [BridgeType.SysKeeperForwarder]: syskeeperDbHandler,
    [BridgeType.IoTDB]: IoTDBHandler,
    [BridgeType.Elasticsearch]: elasticsearchHandler,
    [BridgeType.OpenTSDB]: openTSDBHandler,
    [BridgeType.S3]: S3Handler,
    [BridgeType.AzureBlobStorage]: azureBlobHandler,
    [BridgeType.Pulsar]: pulsarHandler,
    [BridgeType.Couchbase]: couchbaseHandler,
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
