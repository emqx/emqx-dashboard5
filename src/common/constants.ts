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

export const RULE_INPUT_BRIDGE_TYPE_PREFIX = '$bridges/'

export const GATEWAY_ENABLED_MECHANISM_MAP = {
  [GatewayName.STOMP]: [AuthnMechanismType.PasswordBased, AuthnMechanismType.JWT],
  [GatewayName.CoAP]: [AuthnMechanismType.PasswordBased, AuthnMechanismType.JWT],
  [GatewayName.ExProto]: [AuthnMechanismType.PasswordBased, AuthnMechanismType.JWT],
  [GatewayName.MQTT_SN]: [AuthnMechanismType.PasswordBased],
  [GatewayName.LwM2M]: [AuthnMechanismType.PasswordBased],
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
}

/* 
  |         | TCP  | UDP  | SSL  | DTLS |
  | ------- | ---- | ---- | ---- | ---- |
  | CoAP    |      | ✔︎    |      | ✔︎    |
  | ExProto | ✔︎    | ✔︎    | ✔︎    | ✔︎    |
  | LwM2M   |      | ✔︎    |      | ✔︎    |
  | MQTT-SN |      | ✔︎    |      | ✔︎    |
  | STOMP   | ✔︎    |      | ✔︎    |      |
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

export const AUTH_PLACEHOLDER_CLIENT_ATTRS = ', ${client_attrs.<attribute>}'

export const AUTH_PLACEHOLDERS =
  '${clientid}, ${username}, ${password}' + AUTH_PLACEHOLDER_CLIENT_ATTRS

/* MySQL, PgSQL, Redis */
export const AUTHZ_COMMON_PLACEHOLDERS =
  '${username}, ${clientid}, ${peerhost}, ${cert_common_name}, ${cert_subject}' +
  AUTH_PLACEHOLDER_CLIENT_ATTRS

export const AUTHZ_MONGODB_PLACEHOLDERS =
  '${username}, ${clientid}, ${peerhost}' + AUTH_PLACEHOLDER_CLIENT_ATTRS

export const AUTHZ_HTTP_PLACEHOLDERS =
  '${username}, ${clientid}, ${peerhost}, ${mountpoint}, ${topic}, ${action}' +
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

const { VITE_EMQX_VERSION } = import.meta.env
export const IS_ENTERPRISE = VITE_EMQX_VERSION === 'enterprise'

export const BRIDGE_TYPES_NOT_USE_SCHEMA = [BridgeType.InfluxDB]

export const CONNECTOR_TYPES_WITH_TWO_DIRECTIONS = [BridgeType.MQTT, BridgeType.RabbitMQ]

export const INGRESS_BRIDGE_TYPES = [BridgeType.KafkaConsumer, BridgeType.GCPConsumer]

export const CONNECTOR_TYPES_WITH_SOURCE = [BridgeType.MQTT, BridgeType.RabbitMQ]

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

export const EMQX_VERSION = import.meta.env.VITE_APP_EMQX_VERSION

const defaultUnexposedConfig = {
  zone: 'default',
  access_rules: ['allow all'],
  enable_authn: true,
}

const tcpUnexposedOptions = {
  backlog: 1024,
  high_watermark: '1MB',
  keepalive: 'none',
}

const sslUnexposedOptions = {
  client_renegotiation: true,
  handshake_timeout: '15s',
  hibernate_after: '5s',
  honor_cipher_order: true,
  log_level: 'notice',
  reuse_sessions: true,
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
    tcp_options: tcpUnexposedOptions,
  },
  ssl: {
    ...defaultUnexposedConfig,
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

export const BANNED_NEVER_EXPIRE_VALUE = 'infinity'

export const DEFAULT_PAGE_SIZE_OPT = [20, 50, 100, 500]
