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

export const DEFAULT_SSL_VERIFY_VALUE = SSL_VERIFY_VALUE_MAP.get(false)

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
  [GatewayName.STOMP]: [AuthnMechanismType.Scram],
  [GatewayName.CoAP]: [AuthnMechanismType.Scram],
  [GatewayName.ExProto]: [AuthnMechanismType.Scram],
  [GatewayName.MQTT_SN]: [AuthnMechanismType.Scram, AuthnMechanismType.JWT],
  [GatewayName.LwM2M]: [AuthnMechanismType.Scram, AuthnMechanismType.JWT],
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

// coap: ['udp', 'dtls'],
// others: ['tcp', 'ssl', 'udp', 'dtls'],
export const GATEWAY_DISABLED_LISTENER_TYPE_MAP: Record<string, Array<ListenerTypeForGateway>> = {
  [GatewayName.CoAP]: [ListenerTypeForGateway.TCP, ListenerTypeForGateway.SSL],
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
