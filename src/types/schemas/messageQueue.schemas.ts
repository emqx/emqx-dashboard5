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

export type PutMessageQueuesQueuesTopicFilter200 =
  | MqMessageQueueLastvalueApiGet
  | MqMessageQueueRegularApiGet

export type PutMessageQueuesQueuesTopicFilterBody =
  | MqMessageQueueApiLastvaluePut
  | MqMessageQueueApiRegularPut

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

export type GetMessageQueuesQueuesTopicFilter200 =
  | MqMessageQueueLastvalueApiGet
  | MqMessageQueueRegularApiGet

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
  MAX_QUEUE_COUNT_REACHED: 'MAX_QUEUE_COUNT_REACHED',
} as const

export type PostMessageQueuesQueues400 = {
  code?: PostMessageQueuesQueues400Code
  message?: string
}

export type PostMessageQueuesQueues200 = MqMessageQueueLastvalueApiGet | MqMessageQueueRegularApiGet

export type PostMessageQueuesQueuesBody =
  | MqMessageQueueLastvalueApiPost
  | MqMessageQueueRegularApiPost

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

export type MqMessageQueueRegularApiPostIsLastvalue =
  (typeof MqMessageQueueRegularApiPostIsLastvalue)[keyof typeof MqMessageQueueRegularApiPostIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueRegularApiPostIsLastvalue = {
  false: false,
} as const

export type MqMessageQueueRegularApiPostDispatchStrategy =
  (typeof MqMessageQueueRegularApiPostDispatchStrategy)[keyof typeof MqMessageQueueRegularApiPostDispatchStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueRegularApiPostDispatchStrategy = {
  least_inflight: 'least_inflight',
  random: 'random',
  round_robin: 'round_robin',
} as const

export interface MqMessageQueueRegularApiPost {
  data_retention_period?: string
  dispatch_strategy?: MqMessageQueueRegularApiPostDispatchStrategy
  is_lastvalue: MqMessageQueueRegularApiPostIsLastvalue
  topic_filter: string
}

export type MqMessageQueueRegularApiGetIsLastvalue =
  (typeof MqMessageQueueRegularApiGetIsLastvalue)[keyof typeof MqMessageQueueRegularApiGetIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueRegularApiGetIsLastvalue = {
  false: false,
} as const

export type MqMessageQueueRegularApiGetDispatchStrategy =
  (typeof MqMessageQueueRegularApiGetDispatchStrategy)[keyof typeof MqMessageQueueRegularApiGetDispatchStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueRegularApiGetDispatchStrategy = {
  least_inflight: 'least_inflight',
  random: 'random',
  round_robin: 'round_robin',
} as const

export interface MqMessageQueueRegularApiGet {
  data_retention_period?: string
  dispatch_strategy?: MqMessageQueueRegularApiGetDispatchStrategy
  is_lastvalue: MqMessageQueueRegularApiGetIsLastvalue
  topic_filter: string
}

export type MqMessageQueueLastvalueApiPostIsLastvalue =
  (typeof MqMessageQueueLastvalueApiPostIsLastvalue)[keyof typeof MqMessageQueueLastvalueApiPostIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueLastvalueApiPostIsLastvalue = {
  true: true,
} as const

export type MqMessageQueueLastvalueApiPostDispatchStrategy =
  (typeof MqMessageQueueLastvalueApiPostDispatchStrategy)[keyof typeof MqMessageQueueLastvalueApiPostDispatchStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueLastvalueApiPostDispatchStrategy = {
  least_inflight: 'least_inflight',
  random: 'random',
  round_robin: 'round_robin',
} as const

export interface MqMessageQueueLastvalueApiPost {
  data_retention_period?: string
  dispatch_strategy?: MqMessageQueueLastvalueApiPostDispatchStrategy
  is_lastvalue: MqMessageQueueLastvalueApiPostIsLastvalue
  key_expression: string
  topic_filter: string
}

export type MqMessageQueueLastvalueApiGetIsLastvalue =
  (typeof MqMessageQueueLastvalueApiGetIsLastvalue)[keyof typeof MqMessageQueueLastvalueApiGetIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueLastvalueApiGetIsLastvalue = {
  true: true,
} as const

export type MqMessageQueueLastvalueApiGetDispatchStrategy =
  (typeof MqMessageQueueLastvalueApiGetDispatchStrategy)[keyof typeof MqMessageQueueLastvalueApiGetDispatchStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueLastvalueApiGetDispatchStrategy = {
  least_inflight: 'least_inflight',
  random: 'random',
  round_robin: 'round_robin',
} as const

export interface MqMessageQueueLastvalueApiGet {
  data_retention_period?: string
  dispatch_strategy?: MqMessageQueueLastvalueApiGetDispatchStrategy
  is_lastvalue: MqMessageQueueLastvalueApiGetIsLastvalue
  key_expression: string
  topic_filter: string
}

export type GetMessageQueuesQueues200Item =
  | MqMessageQueueLastvalueApiGet
  | MqMessageQueueRegularApiGet

export type MqMessageQueueApiRegularPutIsLastvalue =
  (typeof MqMessageQueueApiRegularPutIsLastvalue)[keyof typeof MqMessageQueueApiRegularPutIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueApiRegularPutIsLastvalue = {
  false: false,
} as const

export type MqMessageQueueApiRegularPutDispatchStrategy =
  (typeof MqMessageQueueApiRegularPutDispatchStrategy)[keyof typeof MqMessageQueueApiRegularPutDispatchStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueApiRegularPutDispatchStrategy = {
  least_inflight: 'least_inflight',
  random: 'random',
  round_robin: 'round_robin',
} as const

export interface MqMessageQueueApiRegularPut {
  data_retention_period?: string
  dispatch_strategy?: MqMessageQueueApiRegularPutDispatchStrategy
  is_lastvalue: MqMessageQueueApiRegularPutIsLastvalue
}

export type MqMessageQueueApiLastvaluePutIsLastvalue =
  (typeof MqMessageQueueApiLastvaluePutIsLastvalue)[keyof typeof MqMessageQueueApiLastvaluePutIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueApiLastvaluePutIsLastvalue = {
  true: true,
} as const

export type MqMessageQueueApiLastvaluePutDispatchStrategy =
  (typeof MqMessageQueueApiLastvaluePutDispatchStrategy)[keyof typeof MqMessageQueueApiLastvaluePutDispatchStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqMessageQueueApiLastvaluePutDispatchStrategy = {
  least_inflight: 'least_inflight',
  random: 'random',
  round_robin: 'round_robin',
} as const

export interface MqMessageQueueApiLastvaluePut {
  data_retention_period?: string
  dispatch_strategy?: MqMessageQueueApiLastvaluePutDispatchStrategy
  is_lastvalue: MqMessageQueueApiLastvaluePutIsLastvalue
  key_expression: string
}

export type MqAutoCreateRegularDispatchStrategy =
  (typeof MqAutoCreateRegularDispatchStrategy)[keyof typeof MqAutoCreateRegularDispatchStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqAutoCreateRegularDispatchStrategy = {
  least_inflight: 'least_inflight',
  random: 'random',
  round_robin: 'round_robin',
} as const

export interface MqAutoCreateRegular {
  data_retention_period?: string
  dispatch_strategy?: MqAutoCreateRegularDispatchStrategy
}

export type MqAutoCreateLastvalueDispatchStrategy =
  (typeof MqAutoCreateLastvalueDispatchStrategy)[keyof typeof MqAutoCreateLastvalueDispatchStrategy]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const MqAutoCreateLastvalueDispatchStrategy = {
  least_inflight: 'least_inflight',
  random: 'random',
  round_robin: 'round_robin',
} as const

export interface MqAutoCreateLastvalue {
  data_retention_period?: string
  dispatch_strategy?: MqAutoCreateLastvalueDispatchStrategy
  key_expression: string
}

export type MqAutoCreateRegularProperty = MqAutoCreateRegular | false

export type MqAutoCreateLastvalueProperty = MqAutoCreateLastvalue | false

export interface MqAutoCreate {
  lastvalue: MqAutoCreateLastvalueProperty
  regular: MqAutoCreateRegularProperty
}

export interface MqApiConfigPut {
  auto_create: MqAutoCreate
  enable: boolean
  find_queue_retry_interval: string
  gc_interval: string
  /** @minimum 1 */
  max_queue_count: number
  regular_queue_retention_period: string
}

export interface MqApiConfigGet {
  auto_create: MqAutoCreate
  enable: boolean
  find_queue_retry_interval: string
  gc_interval: string
  /** @minimum 1 */
  max_queue_count: number
  regular_queue_retention_period: string
}
