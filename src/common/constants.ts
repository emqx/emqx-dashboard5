import {
  AuthnMechanismType,
  DatabasesType,
  GatewayName,
  ListenerTypeForGateway,
  PayloadShowByType,
  QoSLevel,
  SaltPosition,
  BridgeType,
} from '@/types/enum'

export const API_BASE_URL = 'api/v5'

export const QoS_LIST = [0, 1, 2]

export const WEB_SOCKET_STATUS = {
  Connecting: 'MCONNECTING',
  Connected: 'MCONNECTED',
  Disconnecting: 'MDISCONNECTING',
  Disconnected: 'MDISCONNECTED',
  Reconnecting: 'MRECONNECTING',
}

export const SSL_VERIFY_VALUE_MAP: Map<boolean, string> = new Map([
  [false, 'verify_none'],
  [true, 'verify_peer'],
])

export const DEFAULT_SSL_VERIFY_VALUE: string = SSL_VERIFY_VALUE_MAP.get(true) as string

export const SHOW_PAYLOAD_BY_WHICH_OPTION_LIST = [
  PayloadShowByType.Plaintext,
  PayloadShowByType.Base64,
  PayloadShowByType.JSON,
  PayloadShowByType.Hex,
]

export const RULE_INPUT_EVENT_PREFIX = '$events/'

export const TOPIC_EVENT = '$events/message_publish'

export const MULTI_LEVEL_WILDCARD = '#'

export const QoSOptions = [QoSLevel.QoS0, QoSLevel.QoS1, QoSLevel.QoS2]

export const MQTTingressRemoteQoS = QoSOptions.filter((item) => item !== QoSLevel.QoS2)

export const RULE_FROM_SEPARATOR = ','

export const DEFAULT_FROM = 't/#'

export const DEFAULT_SELECT = '*'

export const RULE_LOGICAL_OPERATORS = ['>', '<', '<=', '>=', '<>', '!=', '=', '=~']

export const IP_REG =
  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/

export const NUM_REG = /^(-?\d+(\.\d+)?e(\+|-)\d+|-?\d+(\.\d+)?)$/

export const RULE_INPUT_BRIDGE_TYPE_PREFIX = '$bridges/'

export const GATEWAY_DISABLED_MECHANISM_MAP = {
  [GatewayName.STOMP]: [AuthnMechanismType.SCRAM],
  [GatewayName.CoAP]: [AuthnMechanismType.SCRAM],
  [GatewayName.ExProto]: [AuthnMechanismType.SCRAM],
  [GatewayName.MQTT_SN]: [AuthnMechanismType.SCRAM, AuthnMechanismType.JWT],
  [GatewayName.LwM2M]: [AuthnMechanismType.SCRAM, AuthnMechanismType.JWT],
  [GatewayName.GBT32960]: [AuthnMechanismType.SCRAM, AuthnMechanismType.JWT],
  [GatewayName.JT808]: [
    AuthnMechanismType.PasswordBased,
    AuthnMechanismType.SCRAM,
    AuthnMechanismType.JWT,
  ],
  [GatewayName.OCPP]: [AuthnMechanismType.SCRAM],
}

/*
  | Gateway | Built-In Database | MySQL | MongoDB | PostgreSQL | Redis | Ldap |
  | ------- | ----------------- | ----- | ------- | ---------- | ----- | ---- |
  | STOMP   | ✔︎                 | ✔︎     | ✔︎       | ✔︎          | ✔︎     | ✔︎    |
  | CoAP    | ✔︎                 | ✔︎     | ✔︎       | ✔︎          | ✔︎     | ✔︎    |
  | ExProto | ✔︎                 | ✔︎     | ✔︎       | ✔︎          | ✔︎     | ✔︎    |
  | MQTT-SN |                   |       |         |            |       |      |
  | LwM2M   |                   |       |         |            |       |      |
*/
export const GATEWAY_DISABLED_DATABASES_MAP = {
  [GatewayName.STOMP]: [],
  [GatewayName.CoAP]: [],
  [GatewayName.ExProto]: [],
  [GatewayName.MQTT_SN]: [
    DatabasesType.BuiltInDatabase,
    DatabasesType.MySQL,
    DatabasesType.MongoDB,
    DatabasesType.PostgreSQL,
    DatabasesType.Redis,
    DatabasesType.Ldap,
  ],
  [GatewayName.LwM2M]: [
    DatabasesType.BuiltInDatabase,
    DatabasesType.MySQL,
    DatabasesType.MongoDB,
    DatabasesType.PostgreSQL,
    DatabasesType.Redis,
    DatabasesType.Ldap,
  ],
  [GatewayName.GBT32960]: [
    DatabasesType.BuiltInDatabase,
    DatabasesType.MySQL,
    DatabasesType.MongoDB,
    DatabasesType.PostgreSQL,
    DatabasesType.Redis,
    DatabasesType.Ldap,
  ],
}

/* 
  |         | TCP  | UDP  | SSL  | DTLS | WS  | WSS |
  | ------- | ---- | ---- | ---- | ---- | --- | --- |
  | CoAP    |      | ✔︎    |      | ✔︎    |     |     |
  | ExProto | ✔︎    | ✔︎    | ✔︎    | ✔︎    |     |     |
  | LwM2M   |      | ✔︎    |      | ✔︎    |     |     |
  | MQTT-SN |      | ✔︎    |      | ✔︎    |     |     |
  | STOMP   | ✔︎    |      | ✔︎    |      |     |     |
  | OCPP    |      |      |      |      | ✔︎   | ✔︎   |
  | JT808   | ✔︎    |      | ✔︎    |      |     |     |
  | GB32960 | ✔︎    |      | ✔︎    |      |     |     |
*/
export const GATEWAY_DISABLED_LISTENER_TYPE_MAP: Record<string, Array<ListenerTypeForGateway>> = {
  [GatewayName.CoAP]: [ListenerTypeForGateway.TCP, ListenerTypeForGateway.SSL],
  [GatewayName.LwM2M]: [ListenerTypeForGateway.TCP, ListenerTypeForGateway.SSL],
  [GatewayName.MQTT_SN]: [
    ListenerTypeForGateway.TCP,
    ListenerTypeForGateway.SSL,
    ListenerTypeForGateway.WS,
    ListenerTypeForGateway.WSS,
  ],
  [GatewayName.STOMP]: [ListenerTypeForGateway.UDP, ListenerTypeForGateway.DTLS],
  [GatewayName.GBT32960]: [
    ListenerTypeForGateway.UDP,
    ListenerTypeForGateway.DTLS,
    ListenerTypeForGateway.WS,
    ListenerTypeForGateway.WSS,
  ],
  [GatewayName.JT808]: [
    ListenerTypeForGateway.UDP,
    ListenerTypeForGateway.DTLS,
    ListenerTypeForGateway.WS,
    ListenerTypeForGateway.WSS,
  ],
  [GatewayName.OCPP]: [
    ListenerTypeForGateway.UDP,
    ListenerTypeForGateway.DTLS,
    ListenerTypeForGateway.TCP,
    ListenerTypeForGateway.SSL,
  ],
}

export const DEFAULT_ZONE = 'default'

export const DEFAULT_SALT_POSITION: SaltPosition = SaltPosition.Suffix

export const PASSWORD_HASH_TYPES_WHICH_NEED_SALT_POSITION = [
  'plain',
  'md5',
  'sha',
  'sha256',
  'sha512',
]

export const SESSION_FIELDS = [
  'max_subscriptions',
  'upgrade_qos',
  'max_inflight',
  'retry_interval',
  'max_awaiting_rel',
  'await_rel_timeout',
  'session_expiry_interval',
  'max_mqueue_len',
  'mqueue_priorities',
  'mqueue_default_priority',
  'mqueue_store_qos0',
]

export const MQTT_VERSION_LIST = [
  { label: 'v3.1', value: 'v3' },
  { label: 'v3.1.1', value: 'v4' },
  { label: 'v5', value: 'v5' },
]

export const AUTH_PLACEHOLDERS = '${clientid}, ${username}, ${password}'

/* MySQL, PgSQL, Redis */
export const AUTHZ_COMMON_PLACEHOLDERS =
  '${username}, ${clientid}, ${peerhost}, ${cert_common_name}, ${cert_subject}'

export const AUTHZ_MONGODB_PLACEHOLDERS = '${username}, ${clientid}, ${peerhost}'

export const AUTHZ_HTTP_PLACEHOLDERS =
  '${username}, ${clientid}, ${peerhost}, ${mountpoint}, ${topic}, ${action}'

export const MQTT_V3_RES_CODES = ['01', '02', '03', '04', '05']

export const MQTT_V5_RES_CODES = [
  '01',
  '02',
  '04',
  '10',
  '11',
  '18',
  '19',
  '80',
  '81',
  '82',
  '83',
  '84',
  '85',
  '86',
  '87',
  '88',
  '89',
  '8A',
  '8B',
  '8C',
  '8D',
  '8E',
  '8F',
  '90',
  '91',
  '92',
  '93',
  '94',
  '95',
  '96',
  '97',
  '98',
  '99',
  '9A',
  '9B',
  '9C',
  '9D',
  '9E',
  '9F',
  'A0',
  'A1',
  'A2',
]

/**
 * from axios
 */
export const REQUEST_TIMEOUT_CODE = 'ECONNABORTED'

export const RULE_MAX_NUM_PER_PAGE = 100

export const DEFAULT_PWD = 'public'

export const ADMIN_USERNAMES = ['admin', 'root', 'administrator']

const { VUE_APP_VERSION } = process.env
export const IS_ENTERPRISE = VUE_APP_VERSION === 'enterprise'

/**
 * Map<newType, oldType>
 * for deduplicate
 */
export const BRIDGE_OLD_TYPES_MAP: Map<string, Array<string>> = new Map([
  [BridgeType.Webhook, ['webhook']],
  [BridgeType.KafkaProducer, ['kafka']],
  [BridgeType.Redis, ['redis_sentinel', 'redis_cluster', 'redis_single']],
  [BridgeType.GCPProducer, ['gcp_pubsub']],
  [BridgeType.MongoDB, ['mongodb_rs', 'mongodb_sharded', 'mongodb_single']],
  [BridgeType.InfluxDB, ['influxdb_api_v1', 'influxdb_api_v2']],
])

export const BRIDGE_TYPES_NOT_USE_SCHEMA = [
  BridgeType.InfluxDB,
  BridgeType.KafkaConsumer,
  BridgeType.KafkaProducer,
  BridgeType.Pulsar,
]

export const BRIDGE_TYPES_WITH_TWO_DIRECTIONS = [BridgeType.MQTT]

export const INGRESS_BRIDGE_TYPES = [BridgeType.KafkaConsumer, BridgeType.GCPConsumer]

export const CONNECTOR_TYPES_WITH_SOURCE = [BridgeType.MQTT]

export const SUPPORTED_CONNECTOR_TYPES = [
  BridgeType.MQTT,
  BridgeType.Webhook,
  BridgeType.KafkaProducer,
  BridgeType.AzureEventHubs,
  BridgeType.Confluent,
  BridgeType.PgSQL,
  BridgeType.TimescaleDB,
  BridgeType.MatrixDB,
  BridgeType.MySQL,
  BridgeType.GCPProducer,
  BridgeType.MongoDB,
  BridgeType.Redis,
  BridgeType.SysKeeperForwarder,
  BridgeType.SysKeeperProxy,
  BridgeType.InfluxDB,
  BridgeType.IoTDB,
  BridgeType.Elasticsearch,
  BridgeType.OpenTSDB,
  BridgeType.Cassandra,
]

export const COPY_SUFFIX = '_duplication'

export const AUTO_RESTART_INTERVAL_DEFAULT = '60s'

export const ENCRYPTED_PWD_REG = /^\*{6}$/

export const PASSWORD_REG = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$)[ -~]{8,64}$/

export const SESSION_NEVER_EXPIRE_TIME = parseInt('0xFFFFFFFF', 16)

export const CER_FILE_ACCEPTS = ['crt', 'key', 'pem', 'jks', 'der', 'cer', 'pfx']
  .map((type) => `.${type}`)
  .join(', ')

/**
 * for listener, maybe will be used elsewhere as well
 */
export const INFINITY_VALUE = 'infinity'

export const COMMON_ID_REG = /^[A-Za-z0-9]+[A-Za-z0-9-_]*$/

export const SEARCH_FORM_RES_PROPS = { sm: 12, md: 12, lg: 6 }

export const SSL_FIELDS = [
  'user_lookup_fun',
  'cacertfile',
  'verify',
  'keyfile',
  'certfile',
  'cacerts',
  'password',
  'hibernate_after',
  'versions',
  'secure_renegotiate',
  'reuse_sessions',
  'depth',
  'server_name_indication',
  'enable',
  'ciphers',
  'log_level',
]

export const EMQX_VERSION = process.env.VUE_APP_EMQX_VERSION
// suffix for HTTP bridge **name** and rule **id**
export const WEBHOOK_SUFFIX = '_WH_D'

/**
 * Schema types related to data integration
 */
export const INTEGRATION_SCHEMA_TYPES = ['bridge', 'connector', 'action', 'source']

export const BATCH_UPLOAD_CSV_MAX_ROWS = 2000
