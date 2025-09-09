export type PutMessageQueuesQueuesTopicFilter503Code =
  (typeof PutMessageQueuesQueuesTopicFilter503Code)[keyof typeof PutMessageQueuesQueuesTopicFilter503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageQueuesQueuesTopicFilter503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutMessageQueuesQueuesTopicFilter503 = {
  code?: PutMessageQueuesQueuesTopicFilter503Code
  message?: string
}

export type PutMessageQueuesQueuesTopicFilter404Code =
  (typeof PutMessageQueuesQueuesTopicFilter404Code)[keyof typeof PutMessageQueuesQueuesTopicFilter404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageQueuesQueuesTopicFilter404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutMessageQueuesQueuesTopicFilter404 = {
  code?: PutMessageQueuesQueuesTopicFilter404Code
  message?: string
}

export type PutMessageQueuesQueuesTopicFilter400Code =
  (typeof PutMessageQueuesQueuesTopicFilter400Code)[keyof typeof PutMessageQueuesQueuesTopicFilter400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageQueuesQueuesTopicFilter400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutMessageQueuesQueuesTopicFilter400 = {
  code?: PutMessageQueuesQueuesTopicFilter400Code
  message?: string
}

export type GetMessageQueuesQueuesTopicFilter503Code =
  (typeof GetMessageQueuesQueuesTopicFilter503Code)[keyof typeof GetMessageQueuesQueuesTopicFilter503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageQueuesQueuesTopicFilter503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetMessageQueuesQueuesTopicFilter503 = {
  code?: GetMessageQueuesQueuesTopicFilter503Code
  message?: string
}

export type GetMessageQueuesQueuesTopicFilter404Code =
  (typeof GetMessageQueuesQueuesTopicFilter404Code)[keyof typeof GetMessageQueuesQueuesTopicFilter404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageQueuesQueuesTopicFilter404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMessageQueuesQueuesTopicFilter404 = {
  code?: GetMessageQueuesQueuesTopicFilter404Code
  message?: string
}

export type DeleteMessageQueuesQueuesTopicFilter503Code =
  (typeof DeleteMessageQueuesQueuesTopicFilter503Code)[keyof typeof DeleteMessageQueuesQueuesTopicFilter503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMessageQueuesQueuesTopicFilter503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type DeleteMessageQueuesQueuesTopicFilter503 = {
  code?: DeleteMessageQueuesQueuesTopicFilter503Code
  message?: string
}

export type DeleteMessageQueuesQueuesTopicFilter404Code =
  (typeof DeleteMessageQueuesQueuesTopicFilter404Code)[keyof typeof DeleteMessageQueuesQueuesTopicFilter404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMessageQueuesQueuesTopicFilter404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteMessageQueuesQueuesTopicFilter404 = {
  code?: DeleteMessageQueuesQueuesTopicFilter404Code
  message?: string
}

export type DeleteMessageQueuesQueuesTopicFilter400Code =
  (typeof DeleteMessageQueuesQueuesTopicFilter400Code)[keyof typeof DeleteMessageQueuesQueuesTopicFilter400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMessageQueuesQueuesTopicFilter400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteMessageQueuesQueuesTopicFilter400 = {
  code?: DeleteMessageQueuesQueuesTopicFilter400Code
  message?: string
}

export type PostMessageQueuesQueues503Code =
  (typeof PostMessageQueuesQueues503Code)[keyof typeof PostMessageQueuesQueues503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageQueuesQueues503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostMessageQueuesQueues503 = {
  code?: PostMessageQueuesQueues503Code
  message?: string
}

export type PostMessageQueuesQueues400Code =
  (typeof PostMessageQueuesQueues400Code)[keyof typeof PostMessageQueuesQueues400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageQueuesQueues400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostMessageQueuesQueues400 = {
  code?: PostMessageQueuesQueues400Code
  message?: string
}

export type GetMessageQueuesQueues503Code =
  (typeof GetMessageQueuesQueues503Code)[keyof typeof GetMessageQueuesQueues503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageQueuesQueues503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetMessageQueuesQueues503 = {
  code?: GetMessageQueuesQueues503Code
  message?: string
}

export type GetMessageQueuesQueues400Code =
  (typeof GetMessageQueuesQueues400Code)[keyof typeof GetMessageQueuesQueues400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageQueuesQueues400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetMessageQueuesQueues400 = {
  code?: GetMessageQueuesQueues400Code
  message?: string
}

export type PutMessageQueuesConfig400Code =
  (typeof PutMessageQueuesConfig400Code)[keyof typeof PutMessageQueuesConfig400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageQueuesConfig400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutMessageQueuesConfig400 = {
  code?: PutMessageQueuesConfig400Code
  message?: string
}

export type PublicLimitParameter = number

export type PublicCursorParameter = string

export type GetMessageQueuesQueuesParams = {
  cursor?: PublicCursorParameter
  limit?: PublicLimitParameter
}

export interface PublicMetaWithCursor {
  /** @minimum 0 */
  count?: number
  cursor?: string
  hasnext: boolean
}

export interface MqMessageQueuesApiGet {
  data?: MqMessageQueueApiGet[]
  meta?: PublicMetaWithCursor
}

export type MqMessageQueueApiPutDispatchStrategy =
  (typeof MqMessageQueueApiPutDispatchStrategy)[keyof typeof MqMessageQueueApiPutDispatchStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueApiPutDispatchStrategy = {
  least_inflight: 'least_inflight',
  random: 'random',
  round_robin: 'round_robin',
} as const

export interface MqMessageQueueApiPut {
  data_retention_period?: string
  dispatch_strategy?: MqMessageQueueApiPutDispatchStrategy
}

export type MqMessageQueueApiGetDispatchStrategy =
  (typeof MqMessageQueueApiGetDispatchStrategy)[keyof typeof MqMessageQueueApiGetDispatchStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueApiGetDispatchStrategy = {
  least_inflight: 'least_inflight',
  random: 'random',
  round_robin: 'round_robin',
} as const

export interface MqMessageQueueApiGet {
  data_retention_period?: string
  dispatch_strategy?: MqMessageQueueApiGetDispatchStrategy
  is_lastvalue?: boolean
  topic_filter: string
}

export type MqMessageQueueDispatchStrategy =
  (typeof MqMessageQueueDispatchStrategy)[keyof typeof MqMessageQueueDispatchStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueDispatchStrategy = {
  least_inflight: 'least_inflight',
  random: 'random',
  round_robin: 'round_robin',
} as const

export interface MqMessageQueue {
  data_retention_period?: string
  dispatch_strategy?: MqMessageQueueDispatchStrategy
  is_lastvalue?: boolean
  topic_filter: string
}

export interface MqApiConfigPut {
  gc_interval: string
  regular_queue_retention_period: string
}

export interface MqApiConfigGet {
  gc_interval: string
  regular_queue_retention_period: string
}
