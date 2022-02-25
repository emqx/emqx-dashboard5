import { PayloadShowByType, QoSLevel } from '@/types/enum'

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
]

export const RULE_INPUT_EVENT_PREFIX = '$events/'

export const RULE_TOPOLOGY_ID = 'rule-topology'

export const QoSOptions = [QoSLevel.QoS0, QoSLevel.QoS1, QoSLevel.QoS2]
