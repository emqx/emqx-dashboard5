import {
  AuthnMechanismType,
  DatabasesType,
  GatewayName,
  ListenerTypeForGateway,
  PayloadShowByType,
  QoSLevel,
  SaltPosition,
} from '@/types/enum'

export const QoS_LIST = [0, 1, 2]

export const SSL_VERIFY_VALUE_MAP: Map<boolean, string> = new Map([
  [false, 'verify_none'],
  [true, 'verify_peer'],
])

export const DEFAULT_SSL_VERIFY_VALUE: string = SSL_VERIFY_VALUE_MAP.get(false) as string

// TODO:JSON Hex
export const SHOW_PAYLOAD_BY_WHICH_OPTION_LIST = [
  PayloadShowByType.Plaintext,
  PayloadShowByType.Base64,
  PayloadShowByType.JSON,
  PayloadShowByType.Hex,
]

export const RULE_INPUT_EVENT_PREFIX = '$events/'

export const RULE_TOPOLOGY_ID = 'rule-topology'

export const QoSOptions = [QoSLevel.QoS0, QoSLevel.QoS1, QoSLevel.QoS2]

export const RULE_FROM_SEPARATOR = ','

export const DEFAULT_FROM = 't/#'

export const DEFAULT_SELECT = '*'

export const IP_REG =
  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/

export const RULE_INPUT_BRIDGE_TYPE_PREFIX = '$bridges/'

export const LOCAL_STORAGE_KEY_MAP = {
  RULE_FOR_COPY: 'rule_for_copy',
}

export const GATEWAY_DISABLED_MECHANISM_MAP = {
  [GatewayName.STOMP]: [AuthnMechanismType.SCRAM],
  [GatewayName.CoAP]: [AuthnMechanismType.SCRAM],
  [GatewayName.ExProto]: [AuthnMechanismType.SCRAM],
  [GatewayName.MQTT_SN]: [AuthnMechanismType.SCRAM, AuthnMechanismType.JWT],
  [GatewayName.LwM2M]: [AuthnMechanismType.SCRAM, AuthnMechanismType.JWT],
}

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
  ],
  [GatewayName.LwM2M]: [
    DatabasesType.BuiltInDatabase,
    DatabasesType.MySQL,
    DatabasesType.MongoDB,
    DatabasesType.PostgreSQL,
    DatabasesType.Redis,
  ],
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
  [GatewayName.MQTT_SN]: [ListenerTypeForGateway.TCP, ListenerTypeForGateway.SSL],
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
