export type PutMessageQueuesTopicFilter503Code =
  (typeof PutMessageQueuesTopicFilter503Code)[keyof typeof PutMessageQueuesTopicFilter503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageQueuesTopicFilter503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutMessageQueuesTopicFilter503 = {
  code?: PutMessageQueuesTopicFilter503Code
  message?: string
}

export type PutMessageQueuesTopicFilter404Code =
  (typeof PutMessageQueuesTopicFilter404Code)[keyof typeof PutMessageQueuesTopicFilter404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageQueuesTopicFilter404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutMessageQueuesTopicFilter404 = {
  code?: PutMessageQueuesTopicFilter404Code
  message?: string
}

export type PutMessageQueuesTopicFilter400Code =
  (typeof PutMessageQueuesTopicFilter400Code)[keyof typeof PutMessageQueuesTopicFilter400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageQueuesTopicFilter400Code = {
  INVALID_CREDENTIAL: 'INVALID_CREDENTIAL',
} as const

export type PutMessageQueuesTopicFilter400 = {
  code?: PutMessageQueuesTopicFilter400Code
  message?: string
}

export type GetMessageQueuesTopicFilter503Code =
  (typeof GetMessageQueuesTopicFilter503Code)[keyof typeof GetMessageQueuesTopicFilter503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageQueuesTopicFilter503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetMessageQueuesTopicFilter503 = {
  code?: GetMessageQueuesTopicFilter503Code
  message?: string
}

export type GetMessageQueuesTopicFilter404Code =
  (typeof GetMessageQueuesTopicFilter404Code)[keyof typeof GetMessageQueuesTopicFilter404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageQueuesTopicFilter404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMessageQueuesTopicFilter404 = {
  code?: GetMessageQueuesTopicFilter404Code
  message?: string
}

export type DeleteMessageQueuesTopicFilter503Code =
  (typeof DeleteMessageQueuesTopicFilter503Code)[keyof typeof DeleteMessageQueuesTopicFilter503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMessageQueuesTopicFilter503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type DeleteMessageQueuesTopicFilter503 = {
  code?: DeleteMessageQueuesTopicFilter503Code
  message?: string
}

export type DeleteMessageQueuesTopicFilter404Code =
  (typeof DeleteMessageQueuesTopicFilter404Code)[keyof typeof DeleteMessageQueuesTopicFilter404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMessageQueuesTopicFilter404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteMessageQueuesTopicFilter404 = {
  code?: DeleteMessageQueuesTopicFilter404Code
  message?: string
}

export type DeleteMessageQueuesTopicFilter400Code =
  (typeof DeleteMessageQueuesTopicFilter400Code)[keyof typeof DeleteMessageQueuesTopicFilter400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMessageQueuesTopicFilter400Code = {
  INVALID_CREDENTIAL: 'INVALID_CREDENTIAL',
} as const

export type DeleteMessageQueuesTopicFilter400 = {
  code?: DeleteMessageQueuesTopicFilter400Code
  message?: string
}

export type PostMessageQueues503Code =
  (typeof PostMessageQueues503Code)[keyof typeof PostMessageQueues503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageQueues503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostMessageQueues503 = {
  code?: PostMessageQueues503Code
  message?: string
}

export type PostMessageQueues400Code =
  (typeof PostMessageQueues400Code)[keyof typeof PostMessageQueues400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageQueues400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
} as const

export type PostMessageQueues400 = {
  code?: PostMessageQueues400Code
  message?: string
}

export type GetMessageQueues503Code =
  (typeof GetMessageQueues503Code)[keyof typeof GetMessageQueues503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageQueues503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetMessageQueues503 = {
  code?: GetMessageQueues503Code
  message?: string
}

export type GetMessageQueues400Code =
  (typeof GetMessageQueues400Code)[keyof typeof GetMessageQueues400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageQueues400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetMessageQueues400 = {
  code?: GetMessageQueues400Code
  message?: string
}

export type PublicLimitParameter = number

export type PublicCursorParameter = string

export type GetMessageQueuesParams = {
  cursor?: PublicCursorParameter
  limit?: PublicLimitParameter
}

export interface PublicMetaWithCursor {
  /** @minimum 0 */
  count?: number
  cursor?: string
  hasnext: boolean
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

export interface MqMessageQueuesApiGet {
  data?: MqMessageQueueApiGet[]
  meta?: PublicMetaWithCursor
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
