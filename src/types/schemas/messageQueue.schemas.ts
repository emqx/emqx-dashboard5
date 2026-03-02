export type PutQueuesConfig400Code =
  (typeof PutQueuesConfig400Code)[keyof typeof PutQueuesConfig400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutQueuesConfig400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutQueuesConfig400 = {
  code?: PutQueuesConfig400Code
  message?: string
}

export type PostQueues503Code = (typeof PostQueues503Code)[keyof typeof PostQueues503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostQueues503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostQueues503 = {
  code?: PostQueues503Code
  message?: string
}

export type PostQueues400Code = (typeof PostQueues400Code)[keyof typeof PostQueues400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostQueues400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  MAX_QUEUE_COUNT_REACHED: 'MAX_QUEUE_COUNT_REACHED',
} as const

export type PostQueues400 = {
  code?: PostQueues400Code
  message?: string
}

export type PostQueues200 = MqMessageQueueLastvalueApiGet | MqMessageQueueRegularApiGet

export type PostQueuesBody = MqMessageQueueLastvalueApiPost | MqMessageQueueRegularApiPost

export type GetQueues503Code = (typeof GetQueues503Code)[keyof typeof GetQueues503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetQueues503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetQueues503 = {
  code?: GetQueues503Code
  message?: string
}

export type GetQueues400Code = (typeof GetQueues400Code)[keyof typeof GetQueues400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetQueues400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetQueues400 = {
  code?: GetQueues400Code
  message?: string
}

export type GetQueues200Item = MqMessageQueueRegularApiGet | MqMessageQueueLastvalueApiGet

export type GetQueuesParams = {
  cursor?: PublicCursorParameter
  limit?: PublicLimitParameter
}

export type PutQueueName503Code = (typeof PutQueueName503Code)[keyof typeof PutQueueName503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutQueueName503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutQueueName503 = {
  code?: PutQueueName503Code
  message?: string
}

export type PutQueueName404Code = (typeof PutQueueName404Code)[keyof typeof PutQueueName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutQueueName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutQueueName404 = {
  code?: PutQueueName404Code
  message?: string
}

export type PutQueueName400Code = (typeof PutQueueName400Code)[keyof typeof PutQueueName400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutQueueName400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutQueueName400 = {
  code?: PutQueueName400Code
  message?: string
}

export type PutQueueName200 = MqMessageQueueLastvalueApiGet | MqMessageQueueRegularApiGet

export type PutQueueNameBody = MqMessageQueueApiLastvaluePut | MqMessageQueueApiRegularPut

export type GetQueueName503Code = (typeof GetQueueName503Code)[keyof typeof GetQueueName503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetQueueName503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetQueueName503 = {
  code?: GetQueueName503Code
  message?: string
}

export type GetQueueName404Code = (typeof GetQueueName404Code)[keyof typeof GetQueueName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetQueueName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetQueueName404 = {
  code?: GetQueueName404Code
  message?: string
}

export type GetQueueName200 = MqMessageQueueLastvalueApiGet | MqMessageQueueRegularApiGet

export type DeleteQueueName503Code =
  (typeof DeleteQueueName503Code)[keyof typeof DeleteQueueName503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteQueueName503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type DeleteQueueName503 = {
  code?: DeleteQueueName503Code
  message?: string
}

export type DeleteQueueName404Code =
  (typeof DeleteQueueName404Code)[keyof typeof DeleteQueueName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteQueueName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteQueueName404 = {
  code?: DeleteQueueName404Code
  message?: string
}

export type DeleteQueueName400Code =
  (typeof DeleteQueueName400Code)[keyof typeof DeleteQueueName400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteQueueName400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteQueueName400 = {
  code?: DeleteQueueName400Code
  message?: string
}

export type PublicLimitParameter = number

export type PublicCursorParameter = string

export type MqMqIndividualLimitsMaxShardMessageCount = number | 'infinity'

export type MqMqIndividualLimitsMaxShardMessageBytes = string | 'infinity'

export interface MqMqIndividualLimits {
  max_shard_message_bytes: MqMqIndividualLimitsMaxShardMessageBytes
  max_shard_message_count: MqMqIndividualLimitsMaxShardMessageCount
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
  limits: MqMqIndividualLimits
  name: string
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
  limits: MqMqIndividualLimits
  name: string
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
  limits: MqMqIndividualLimits
  name: string
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
  limits: MqMqIndividualLimits
  name: string
  topic_filter: string
}

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
  limits: MqMqIndividualLimits
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
  limits: MqMqIndividualLimits
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
  limits: MqMqIndividualLimits
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
  limits: MqMqIndividualLimits
}

export type MqAutoCreateRegularProperty = MqAutoCreateRegular | false

export type MqAutoCreateLastvalueProperty = MqAutoCreateLastvalue | false

export interface MqAutoCreate {
  lastvalue: MqAutoCreateLastvalueProperty
  regular: MqAutoCreateRegularProperty
}

export type MqApiConfigPutEnable = 'auto' | boolean

export interface MqApiConfigPut {
  auto_create: MqAutoCreate
  enable: MqApiConfigPutEnable
  find_queue_retry_interval: string
  gc_interval: string
  /** @minimum 1 */
  max_queue_count: number
  regular_queue_retention_period: string
}

export type MqApiConfigGetEnable = 'auto' | boolean

export interface MqApiConfigGet {
  auto_create: MqAutoCreate
  enable: MqApiConfigGetEnable
  find_queue_retry_interval: string
  gc_interval: string
  /** @minimum 1 */
  max_queue_count: number
  regular_queue_retention_period: string
}
