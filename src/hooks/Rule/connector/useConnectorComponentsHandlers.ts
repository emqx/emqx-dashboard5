import MQTTIds from '@/components/Connector/MQTTIds.vue'
import MQTTNode from '@/components/Connector/MQTTNode.vue'
import { FormRules } from '@/types/common'
import { BridgeType } from '@/types/enum'
import { Properties, Property } from '@/types/schemaForm'
import { compare } from 'compare-versions'
import useSchemaHandlers from '../useSchemaHandlers'
import { IoTDBDrivers, IoTDBKeyField } from './useSecondRefControl'
import { ENCRYPTED_PWD_REG, FILE_STR_REG } from '@/common/constants'
import HttpOAuth2Config from '@/components/HttpOAuth2Config.vue'

type Handler = ({ components, rules }: { components: Properties; rules: SchemaRules }) => {
  components: Properties
  rules: SchemaRules
}

const enum MongoType {
  Single = 'single',
  RS = 'rs',
  Sharded = 'sharded',
}

const enum RedisType {
  Single = 'single',
  Sentinel = 'sentinel',
  Cluster = 'cluster',
}

const enum InfluxDBType {
  v1 = 'influxdb_api_v1',
  v2 = 'influxdb_api_v2',
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
  filterSSLParams: (components: Properties) => Properties
  getComponentsHandler: () => Handler
} => {
  const { t, tl, te } = useI18nTl('RuleEngine')
  const { getI18nPrefix, setLabelAndDesc } = useI18nPrefix(t, te)
  const { ruleWhenEditing } = useSpecialRuleForPassword(props)
  const { createCommonIdRule, createRequiredRule } = useFormRules()
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

  const store = useStore()
  const { createSSLForm } = useSSL()
  const SSLKeys = Object.keys(createSSLForm())
  const SSL_KEY = 'ssl'
  const filterSSLParams = (components: Properties): Properties => {
    const customSSLKeys = [...SSLKeys]
    if (props.type === BridgeType.EMQXTables) {
      customSSLKeys.push('ciphers')
    }
    const walk = (com: Properties): Properties => {
      Object.entries(com).forEach(([, prop]) => {
        if (prop.properties) {
          if (prop.key === SSL_KEY) {
            const ciphersSchema = prop.properties.ciphers
            prop.properties = pick(prop.properties, customSSLKeys)
            if (prop.properties.verify) {
              prop.properties.verify.default = DEFAULT_SSL_VERIFY_VALUE
            }
            const showCiphers = customSSLKeys.includes('ciphers') && !!ciphersSchema
            prop.componentProps = {
              ...(prop.componentProps ?? {
                globalOnly: false,
                userNamespace: store.getters.userNamespace,
              }),
              ...(showCiphers
                ? {
                    ciphers: true,
                    ciphersLabel: t(`${getI18nPrefix('common')}ciphers.label`),
                    ciphersDesc: t(`${getI18nPrefix(props.type ?? 'common')}ciphers.desc`),
                  }
                : {}),
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

  const { handlePrivateKey, setComponentProps } = useSchemaHandlers()
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
    const processedPrivateKey = handlePrivateKey(filteredSSL)
    const rulesRet = addRuleForPassword(rules)
    return { components: processedPrivateKey, rules: rulesRet }
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
      const _props = comRet.static_clientids.items.properties
      if (_props.ids) {
        setLabelAndDesc(_props.ids, `${i18nPrefix}ids`)
        _props.ids.customComponent = markRaw(MQTTIds)
      }
      if (_props.node) {
        setLabelAndDesc(_props.node, `${i18nPrefix}node`)
        _props.node.customComponent = markRaw(MQTTNode)
        _props.node.componentProps = {
          ...(_props.node.componentProps || {}),
          edit: props.edit,
        }
      }
      addRules(
        {
          'static_clientids.ids': [
            {
              validator(_rules, value, cb) {
                const allPass =
                  value.length > 0 &&
                  value.every((item) => {
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

  const azureEventGridHandler: Handler = (data) => {
    const { components, rules } = mqttHandler(data)
    const comRet = components
    if (comRet?.server) {
      comRet.server.componentProps = { placeholder: '' }
    }
    return { components: comRet, rules }
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
    if (comRet.oauth2) {
      comRet.oauth2.default = { enable: false }
      comRet.oauth2.customComponent = markRaw(HttpOAuth2Config)
      comRet.oauth2.componentProps = {
        isEdit: props.edit,
      }
      addRules(
        {
          'oauth2.token_endpoint': createRequiredRule(
            t('BridgeSchema.http.oauth2_token_endpoint.label'),
          ),
          'oauth2.client_id': createRequiredRule(t('BridgeSchema.http.oauth2_client_id.label')),
          'oauth2.client_secret': createRequiredRule(
            t('BridgeSchema.http.oauth2_client_secret.label'),
          ),
        },
        rules,
      )
    }
    return { components: comRet, rules }
  }

  const kafkaHandler: Handler = ({ components, rules }) => {
    const authList = components.authentication?.oneOf
    if (authList) {
      components.authentication.oneOf = authList.reverse()
      const pwdProp = authList.find(({ properties }) => properties?.password)?.properties?.password
      pwdProp && setPwdFormat(pwdProp)
    }
    return { components, rules }
  }

  const neededSSLConfig = SSLKeys
  const azureEventHubsHandler: Handler = ({ components, rules }) => {
    const { authentication, ssl } = components

    const { password } = authentication?.properties || {}
    if (password?.type === 'string') {
      password.format = 'password'
      password.labelKey = 'connection_string'
    }

    if (ssl) {
      if (ssl?.properties?.verify) {
        ssl.properties.verify.default = SSL_VERIFY_VALUE_MAP.get(false)
      }
      ssl.properties = pick(ssl.properties, neededSSLConfig) as Properties
    }

    return { components, rules }
  }

  const confluentHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)
    const authProp = components.authentication
    const basicAuthItem = authProp?.oneOf?.find((item) => item.$ref && /password/i.test(item.$ref))

    if (authProp) {
      authProp.useNewCom = true
      if (basicAuthItem) {
        authProp.default = basicAuthItem.default
      }
    }
    if (components?.ssl) {
      components.ssl.properties = pick(components.ssl.properties, neededSSLConfig) as Properties
      components.ssl.componentProps = { hideVerify: true }
    }

    return { components, rules }
  }

  const GCPHandler: Handler = ({ components, rules }) => {
    const authentication = components?.authentication
    if (authentication) {
      authentication.useNewCom = true
    }
    const accountItem = components?.authentication?.oneOf?.find((item: any) =>
      /account_json/.test(item?.$ref),
    )
    if (accountItem && accountItem.default && !authentication.default) {
      authentication.default = accountItem.default
    }
    const accountJsonProp = accountItem?.properties
    const { service_account_json } = accountJsonProp || {}
    /* Common */
    if (service_account_json?.type === 'string') {
      // The backend does not give data indicating that it is possible to upload files here, add it manually
      service_account_json.format = 'file'
      service_account_json.componentProps = {
        accept: '.json',
        tip: t('Base.uploadTip', { format: 'JSON' }),
      }
    }
    const serviceAccountJSONRule = {
      validator(rule: unknown, value: string): any {
        return new Promise((resolve, reject) => {
          if ((props.edit && ENCRYPTED_PWD_REG.test(value)) || FILE_STR_REG.test(value)) {
            resolve(true)
            return
          }
          try {
            JSON.parse(value)
            resolve(true)
          } catch (error) {
            reject(tl('accountJSONError'))
          }
        })
      },
      trigger: 'blur',
    }
    addRules(
      {
        service_account_json: [serviceAccountJSONRule],
        'authentication.service_account_json': [serviceAccountJSONRule],
      },
      rules,
    )
    if (accountItem?.rules) {
      addRules(
        { 'authentication.service_account_json': [serviceAccountJSONRule] },
        accountItem.rules,
      )
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
        parameters.default = cloneDeep(singleOne.default)
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

  const redisTypeOrder = [RedisType.Single, RedisType.Sentinel, RedisType.Cluster]
  const getRedisTypeOrder = (ref: string) => redisTypeOrder.findIndex((type) => ref.includes(type))
  const redisHandler: Handler = ({ components, rules }) => {
    const { parameters } = components

    if (parameters) {
      parameters.oneOf?.sort(
        (a, b) => getRedisTypeOrder(a.$ref || '') - getRedisTypeOrder(b.$ref || ''),
      )

      const oneOf = parameters.oneOf || []
      const singleOne = oneOf?.find((item) => item.$ref?.includes(RedisType.Single))
      if (singleOne) {
        parameters.default = cloneDeep(singleOne.default)
      }

      const sentinelOne = oneOf?.find((item) => item.$ref?.includes(RedisType.Sentinel))
      const { servers: sentinelServers, sentinel_password: sentinelPwd } =
        sentinelOne?.properties || {}
      if (sentinelServers) {
        sentinelServers.componentProps = { type: 'textarea', rows: 3 }
      }
      // if (sentinelPwd?.type === 'string') {
      //   setPwdFormat(sentinelPwd)
      // }

      const clusterOne = oneOf?.find((item) => item.$ref?.includes(RedisType.Cluster))
      const { servers: clusterServers } = clusterOne?.properties || {}
      if (clusterServers) {
        clusterServers.componentProps = { type: 'textarea', rows: 3 }
      }
    }
    return { components, rules }
  }

  const influxDbHandler: Handler = ({ components, rules }) => {
    const { parameters } = components

    if (parameters) {
      const oneOf = parameters.oneOf || []
      const v2One = oneOf?.find((item) => item.$ref?.includes(InfluxDBType.v2))
      if (v2One) {
        parameters.default = cloneDeep(v2One.default)
      }
    }
    return { components, rules }
  }

  const amazonKinesisHandler = (data: { components: Properties; rules: SchemaRules }) => {
    const { components, rules } = commonHandler(data)

    if (components?.aws_secret_access_key?.type === 'string') {
      components.aws_secret_access_key.format = 'password'
    }

    return { components, rules }
  }

  const pulsarHandler = ({ components, rules }: { components: Properties; rules: SchemaRules }) => {
    const authList = components.authentication?.oneOf
    if (authList) {
      components.authentication.oneOf = authList.reverse()
    }
    return { components, rules }
  }

  const iotDbHandler: Handler = (data) => {
    const { components = {} } = data
    if (components[IoTDBKeyField]) {
      if (components[IoTDBKeyField].symbols?.length === 1) {
        components[IoTDBKeyField].default = components[IoTDBKeyField].symbols?.[0]
      }
      components[IoTDBKeyField].symbols = IoTDBDrivers
    }
    if (components.sql) {
      components.sql.useNewCom = true
      const treeItem = components.sql?.oneOf?.find?.(({ $ref }) => /tree/i.test($ref || ''))
      if (treeItem && treeItem.default && !components.sql.default) {
        components.sql.default = treeItem.default
      }
    }
    if (components?.iotdb_version?.symbols) {
      components.iotdb_version.symbols = components.iotdb_version.symbols.filter((version) =>
        typeof version !== 'string' ? true : compare(version.replace('v', ''), '1.3.0', '>='),
      )
    }
    if (components?.protocol_version?.symbols) {
      components.protocol_version.symbols = components.protocol_version.symbols.filter((version) =>
        typeof version !== 'string' ? true : compare(version.replace('protocol_v', ''), '3', '>='),
      )
    }

    return { ...data, components }
  }

  const diskLogHandler: Handler = (data) => {
    const { components, rules } = commonHandler(data)
    addRules(
      {
        max_file_size: [
          {
            validator(rules: any, value: string, cb) {
              const numPart = Number(parseInt(value))
              if (!Number.isNaN(numPart) && numPart <= 0) {
                cb(new Error(t('Rule.positiveRequired')))
              } else {
                cb()
              }
            },
            trigger: 'blur',
          },
        ],
      },
      rules,
    )
    return { components, rules }
  }

  const s3TablesHandler: Handler = ({ components, rules }) => {
    const sslProp = components?.s3_client?.properties?.transport_options?.properties?.ssl
    const sslEnableProp = sslProp?.properties?.enable
    const sslVerifyProp = sslProp?.properties?.verify
    if (sslProp) {
      sslProp.componentProps = { disabledBaseConfig: true }
    }
    if (sslVerifyProp) {
      sslVerifyProp.default = SSL_VERIFY_VALUE_MAP.get(false)
    }
    if (sslEnableProp) {
      sslEnableProp.default = true
    }
    return { components, rules }
  }

  const datalayersHandler: Handler = ({ components, rules }) => {
    const { driver_type } = components?.parameters?.properties ?? {}
    if (props.edit && driver_type) {
      setComponentProps(driver_type, { disabled: true })
    }
    return { components, rules }
  }

  const specialConnectorHandlerMap: Map<string, Handler> = new Map([
    [BridgeType.MQTT, mqttHandler],
    [BridgeType.Webhook, httpHandler],
    [BridgeType.KafkaProducer, kafkaHandler],
    [BridgeType.KafkaConsumer, kafkaHandler],
    [BridgeType.AzureEventHubs, azureEventHubsHandler],
    [BridgeType.Confluent, confluentHandler],
    [BridgeType.Confluent, confluentHandler],
    [BridgeType.GCPProducer, GCPHandler],
    [BridgeType.GCPConsumer, GCPHandler],
    [BridgeType.BigQuery, GCPHandler],
    [BridgeType.Bigtable, GCPHandler],
    [BridgeType.MongoDB, mongoHandler],
    [BridgeType.Redis, redisHandler],
    [BridgeType.InfluxDB, influxDbHandler],
    [BridgeType.AWSTimestream, influxDbHandler],
    [BridgeType.AmazonKinesis, amazonKinesisHandler],
    [BridgeType.Pulsar, pulsarHandler],
    [BridgeType.IoTDB, iotDbHandler],
    [BridgeType.DiskLog, diskLogHandler],
    [BridgeType.S3Tables, s3TablesHandler],
    [BridgeType.Datalayers, datalayersHandler],
    [BridgeType.AzureEventGrid, azureEventGridHandler],
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
    filterSSLParams,
    getComponentsHandler,
  }
}
