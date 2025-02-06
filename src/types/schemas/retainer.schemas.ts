export type PutMqttRetainer400Code =
  (typeof PutMqttRetainer400Code)[keyof typeof PutMqttRetainer400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMqttRetainer400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
} as const

export type PutMqttRetainer400 = {
  code?: PutMqttRetainer400Code
  message?: string
}

export type GetMqttRetainer404Code =
  (typeof GetMqttRetainer404Code)[keyof typeof GetMqttRetainer404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMqttRetainer404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMqttRetainer404 = {
  code?: GetMqttRetainer404Code
  message?: string
}

export type DeleteMqttRetainerMessageTopic404Code =
  (typeof DeleteMqttRetainerMessageTopic404Code)[keyof typeof DeleteMqttRetainerMessageTopic404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMqttRetainerMessageTopic404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteMqttRetainerMessageTopic404 = {
  code?: DeleteMqttRetainerMessageTopic404Code
  message?: string
}

export type DeleteMqttRetainerMessageTopic400Code =
  (typeof DeleteMqttRetainerMessageTopic400Code)[keyof typeof DeleteMqttRetainerMessageTopic400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMqttRetainerMessageTopic400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteMqttRetainerMessageTopic400 = {
  code?: DeleteMqttRetainerMessageTopic400Code
  message?: string
}

export type GetMqttRetainerMessageTopic404Code =
  (typeof GetMqttRetainerMessageTopic404Code)[keyof typeof GetMqttRetainerMessageTopic404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMqttRetainerMessageTopic404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMqttRetainerMessageTopic404 = {
  code?: GetMqttRetainerMessageTopic404Code
  message?: string
}

export type GetMqttRetainerMessageTopic400Code =
  (typeof GetMqttRetainerMessageTopic400Code)[keyof typeof GetMqttRetainerMessageTopic400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMqttRetainerMessageTopic400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetMqttRetainerMessageTopic400 = {
  code?: GetMqttRetainerMessageTopic400Code
  message?: string
}

export type GetMqttRetainerMessages400Code =
  (typeof GetMqttRetainerMessages400Code)[keyof typeof GetMqttRetainerMessages400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMqttRetainerMessages400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetMqttRetainerMessages400 = {
  code?: GetMqttRetainerMessages400Code
  message?: string
}

export type GetMqttRetainerMessages200 = {
  data?: RetainerMessageSummary[]
  meta?: PublicMeta
}

export type GetMqttRetainerMessagesParams = {
  topic?: string
  page?: number
  limit?: number
}

export type RetainerRetainerMsgExpiryIntervalOverride = string | 'disabled'

export type RetainerMnesiaConfigStorageType =
  (typeof RetainerMnesiaConfigStorageType)[keyof typeof RetainerMnesiaConfigStorageType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RetainerMnesiaConfigStorageType = {
  ram: 'ram',
  disc: 'disc',
} as const

export type RetainerMnesiaConfigType =
  (typeof RetainerMnesiaConfigType)[keyof typeof RetainerMnesiaConfigType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RetainerMnesiaConfigType = {
  built_in_database: 'built_in_database',
} as const

export interface RetainerMnesiaConfig {
  type?: RetainerMnesiaConfigType
  storage_type?: RetainerMnesiaConfigStorageType
  max_retained_messages?: number
  index_specs?: number[]
  enable?: boolean
}

export interface RetainerRetainer {
  enable?: boolean
  msg_expiry_interval?: string
  msg_expiry_interval_override?: RetainerRetainerMsgExpiryIntervalOverride
  allow_never_expire?: boolean
  msg_clear_interval?: string
  max_payload_size?: string
  stop_publish_clear_msg?: boolean
  delivery_rate?: string
  max_publish_rate?: string
  backend?: RetainerMnesiaConfig
}

export interface RetainerMessageSummary {
  msgid?: string
  topic?: string
  qos?: number
  publish_at?: string
  from_clientid?: string
  from_username?: string
}

export interface RetainerMessage {
  payload?: string
  msgid?: string
  topic?: string
  qos?: number
  publish_at?: string
  from_clientid?: string
  from_username?: string
}

export interface PublicMeta {
  page?: number
  limit?: number
  count?: number
  hasnext: boolean
}
