import {
  AuthnMechanismType,
  DatabasesType,
  GatewayName,
  ListenerTypeForGateway,
  PayloadShowByType,
  QoSLevel,
  SaltPosition,
  BridgeType,
  EventForRule,
} from '@/types/enum'

export const API_BASE_URL = 'api/v5'

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

export const TOPIC_EVENT = EventForRule.MessagePublish

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
export const RULE_INPUT_SOURCE_TYPE_PREFIX = '$sources/'

/*
  | Gateway | Built-In Database | MySQL | MongoDB | PostgreSQL | Redis | Ldap |
  | ------- | ----------------- | ----- | ------- | ---------- | ----- | ---- |
  | STOMP   | ✔︎                 | ✔︎     | ✔︎       | ✔︎          | ✔︎     | ✔︎    |
  | CoAP    | ✔︎                 | ✔︎     | ✔︎       | ✔︎          | ✔︎     | ✔︎    |
  | ExProto | ✔︎                 | ✔︎     | ✔︎       | ✔︎          | ✔︎     | ✔︎    |
  | MQTT-SN |                   |       |         |            |       |      |
  | LwM2M   |                   |       |         |            |       |      |
  | NATS    | ✔︎                 | ✔︎     | ✔︎       | ✔︎          | ✔︎     | ✔︎    |
*/

export const GATEWAY_ENABLED_MECHANISM_MAP = {
  [GatewayName.STOMP]: [AuthnMechanismType.PasswordBased, AuthnMechanismType.JWT],
  [GatewayName.CoAP]: [AuthnMechanismType.PasswordBased, AuthnMechanismType.JWT],
  [GatewayName.ExProto]: [AuthnMechanismType.PasswordBased, AuthnMechanismType.JWT],
  [GatewayName.MQTT_SN]: [AuthnMechanismType.PasswordBased],
  [GatewayName.LwM2M]: [AuthnMechanismType.PasswordBased],
  [GatewayName.GBT32960]: [AuthnMechanismType.PasswordBased],
  [GatewayName.JT808]: [],
  [GatewayName.OCPP]: [AuthnMechanismType.PasswordBased],
  [GatewayName.NATS]: [AuthnMechanismType.PasswordBased, AuthnMechanismType.JWT],
}

const usefulDatabaseTypeArr = [
  DatabasesType.BuiltInDatabase,
  DatabasesType.MySQL,
  DatabasesType.MongoDB,
  DatabasesType.PostgreSQL,
  DatabasesType.HTTPServer,
  DatabasesType.Redis,
]
export const GATEWAY_ENABLED_DATABASES_MAP = {
  [GatewayName.STOMP]: usefulDatabaseTypeArr,
  [GatewayName.CoAP]: usefulDatabaseTypeArr,
  [GatewayName.ExProto]: usefulDatabaseTypeArr,
  [GatewayName.MQTT_SN]: [DatabasesType.HTTPServer],
  [GatewayName.LwM2M]: [DatabasesType.HTTPServer],
  [GatewayName.GBT32960]: [DatabasesType.HTTPServer],
  [GatewayName.OCPP]: usefulDatabaseTypeArr,
  [GatewayName.NATS]: usefulDatabaseTypeArr,
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
  | NATS    | ✔︎    |      | ✔︎    |      | ✔︎   | ✔︎   |
*/
export const GATEWAY_DISABLED_LISTENER_TYPE_MAP: Record<string, Array<ListenerTypeForGateway>> = {
  [GatewayName.CoAP]: [
    ListenerTypeForGateway.TCP,
    ListenerTypeForGateway.SSL,
    ListenerTypeForGateway.WS,
    ListenerTypeForGateway.WSS,
  ],
  [GatewayName.LwM2M]: [
    ListenerTypeForGateway.TCP,
    ListenerTypeForGateway.SSL,
    ListenerTypeForGateway.WS,
    ListenerTypeForGateway.WSS,
  ],
  [GatewayName.MQTT_SN]: [
    ListenerTypeForGateway.TCP,
    ListenerTypeForGateway.SSL,
    ListenerTypeForGateway.WS,
    ListenerTypeForGateway.WSS,
  ],
  [GatewayName.STOMP]: [
    ListenerTypeForGateway.UDP,
    ListenerTypeForGateway.DTLS,
    ListenerTypeForGateway.WS,
    ListenerTypeForGateway.WSS,
  ],
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
  [GatewayName.NATS]: [ListenerTypeForGateway.UDP, ListenerTypeForGateway.DTLS],
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
  'max_session_expiry_interval',
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

export const AUTH_PLACEHOLDER_CLIENT_ATTRS = ', ${client_attrs.<attribute>}'

const getPlaceholderStr = (varArr: Array<string>) => varArr.map((item) => `\${${item}}`).join(', ')

export const AUTH_PLACEHOLDERS =
  `${getPlaceholderStr(['clientid', 'username', 'password', 'peerport', 'zone', 'listener'])}` +
  AUTH_PLACEHOLDER_CLIENT_ATTRS

/* MySQL, PgSQL, Redis */
const AUTHZ_COMMON_PLACEHOLDER_VAR = [
  'username',
  'clientid',
  'peerhost',
  'peerport',
  'zone',
  'listener',
]
export const AUTHZ_COMMON_PLACEHOLDERS =
  getPlaceholderStr([...AUTHZ_COMMON_PLACEHOLDER_VAR, 'cert_common_name', 'cert_subject']) +
  AUTH_PLACEHOLDER_CLIENT_ATTRS

export const AUTHZ_MONGODB_PLACEHOLDERS =
  getPlaceholderStr(AUTHZ_COMMON_PLACEHOLDER_VAR) + AUTH_PLACEHOLDER_CLIENT_ATTRS

export const AUTHZ_HTTP_PLACEHOLDERS =
  getPlaceholderStr([...AUTHZ_COMMON_PLACEHOLDER_VAR, 'mountpoint', 'topic', 'action']) +
  AUTH_PLACEHOLDER_CLIENT_ATTRS

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

export const BRIDGE_TYPES_LIKE_INFLUXDB = [
  BridgeType.InfluxDB,
  BridgeType.Datalayers,
  BridgeType.AWSTimestream,
]
export const BRIDGE_TYPES_NOT_USE_SCHEMA = [...BRIDGE_TYPES_LIKE_INFLUXDB]

export const CONNECTOR_TYPES_WITH_TWO_DIRECTIONS = [
  BridgeType.MQTT,
  BridgeType.RabbitMQ,
  BridgeType.AzureEventGrid,
]

export const INGRESS_BRIDGE_TYPES = [BridgeType.KafkaConsumer, BridgeType.GCPConsumer]

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
export const NO_BURST_VALUE = '0/1s'

export const COMMON_ID_REG = /^[A-Za-z0-9]+[A-Za-z0-9-_]*$/

export const DASHBOARD_USERNAME_REG = /^[A-Za-z0-9_]+$/

/**
 * for message queue and stream name
 */
export const MESSAGE_QUEUE_NAME_REG = /^[0-9a-zA-Z][-.0-9a-zA-Z_]*$/

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
  'partial_chain',
  'verify_peer_ext_key_usage',
  'middlebox_comp_mode',
  'managed_certs',
  'namespace',
  'bundle_name',
  'managed_certs.namespace',
  'managed_certs.bundle_name',
]

export const EMQX_VERSION = __EMQX_VERSION__

/**
 * ‼️ Must be placed above a variable that is not being exported;
 * the unplugin-auto-import bug will affect the auto import of variables below that variable!
 */
export const SEARCH_FORM_RES_PROPS = { sm: 12, md: 12, lg: 6 }

const defaultUnexposedConfig = {
  zone: 'default',
  access_rules: ['allow all'],
  allow_log_packet_data_from: '',
  enable_authn: true,
}

const tcpUnexposedOptions = {
  high_watermark: '1MB',
}

const sslUnexposedOptions = {
  client_renegotiation: true,
  handshake_timeout: '15s',
  hibernate_after: '5s',
  honor_cipher_order: true,
  log_level: 'notice',
  secure_renegotiate: true,
}

const websocketUnexposedOptions = {
  allow_origin_absence: true,
  check_origin_enable: false,
  check_origins: 'http://localhost:18083, http://127.0.0.1:18083',
  compress: false,
  deflate_opts: {
    client_context_takeover: 'takeover',
    client_max_window_bits: 15,
    mem_level: 8,
    server_context_takeover: 'takeover',
    server_max_window_bits: 15,
    strategy: 'default',
  },
  fail_if_no_subprotocol: true,
  idle_timeout: '7200s',
  max_frame_size: 'infinity',
  mqtt_piggyback: 'multiple',
  proxy_address_header: 'x-forwarded-for',
  proxy_port_header: 'x-forwarded-port',
  supported_subprotocols: 'mqtt, mqtt-v3, mqtt-v3.1.1, mqtt-v5',
  validate_utf8: true,
}

export const unexposedConfigs = {
  tcp: {
    ...defaultUnexposedConfig,
    parse_unit: 'frame',
    tcp_options: tcpUnexposedOptions,
  },
  ssl: {
    ...defaultUnexposedConfig,
    parse_unit: 'frame',
    tcp_options: {
      ...tcpUnexposedOptions,
    },
    ssl_options: {
      ...sslUnexposedOptions,
      gc_after_handshake: false,
    },
  },
  ws: {
    ...defaultUnexposedConfig,
    tcp_options: tcpUnexposedOptions,
    websocket: websocketUnexposedOptions,
  },
  wss: {
    ...defaultUnexposedConfig,
    tcp_options: tcpUnexposedOptions,
    ssl_options: sslUnexposedOptions,
    websocket: websocketUnexposedOptions,
  },
}

// suffix for HTTP bridge **name** and rule **id**
export const WEBHOOK_SUFFIX = '_WH_D'

/**
 * Schema types related to data integration
 */
export const INTEGRATION_SCHEMA_TYPES = ['connector', 'action', 'source']

export const DEFAULT_CLIENT_TABLE_COLUMNS = [
  'clientid',
  'username',
  'connected',
  'ip_address',
  'keepalive',
  'clean_start',
  'expiry_interval',
  'connected_at',
]

export const DEFAULT_ACTION_AND_SOURCE_TABLE_COLUMNS = [
  'id',
  'status',
  'enable',
  'namespace',
  'rules.length',
  'created_at',
]

export const BANNED_NEVER_EXPIRE_VALUE = 'infinity'

export const DEFAULT_PAGE_SIZE_OPT = [20, 50, 100, 500]

export const INVALID_SUB_TOPIC_REG = /#.+|.+[^/]#|[^/]\+|\+[^/]/
export const SPECIAL_INVALID_SUB_TOPIC_REG = /^(\$exclusive|\$share\/[^/]*)$/

export const INVALID_PUB_TOPIC_REG = /\+|#/

export const LIMITER_RATE_REG = /^(?:\d+(?:\/\d*(?:ms|s|m|h|d))?|infinity)$/i
export const LIMITER_BYTES_RATE_REG = /^(?:\d+(?:kb|mb|gb|b)?(?:\/\d*(?:ms|s|m|h|d))?|infinity)$/i
export const LIMITER_BURST_REG = /^\d+(?:\/\d*(?:ms|s|m|h|d))?$/i
export const LIMITER_BYTES_BURST_REG = /^\d+(?:kb|mb|gb|b)?(?:\/\d*(?:ms|s|m|h|d))?$/i

export const BATCH_UPLOAD_CSV_MAX_ROWS = 2048

export const LS_KEY_DO_NOT_SHOW_LICENSE_TIP = 'doNotShowLicenseTip_v1'

export const LS_KEY_COMMUNITY_PROMO_DISMISSED = 'emqxCommunityLicensePromoDismissed_v1'

export const HTTP_POST_DEFAULT_HEADERS = { 'content-type': 'application/json' }

export const AI_FUNCTION_NAME = 'ai_completion'

export const ENCRYPTED_PASSWORD = '******'

export const correctAliasALevelReg = /([_a-zA-Z]\w*|".+")/
export const correctAliasReg = new RegExp(
  `^${correctAliasALevelReg.source}(\\.${correctAliasALevelReg.source})*$`,
)

export const GEMINI_DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/'

export const GLOBAL_NAMESPACE = 'global'

export const EMQX_AUTH_COOKIE_NAME = 'emqx_auth'

export const QUERY_TAB = 'tab'

export const FILE_STR_REG = /^file:\/\/.*$/
