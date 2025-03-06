export type PutMqttTopicRewrite413Code =
  (typeof PutMqttTopicRewrite413Code)[keyof typeof PutMqttTopicRewrite413Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMqttTopicRewrite413Code = {
  EXCEED_LIMIT: 'EXCEED_LIMIT',
} as const

export type PutMqttTopicRewrite413 = {
  code?: PutMqttTopicRewrite413Code
  message?: string
}

export type PutMqttTopicRewrite400Code =
  (typeof PutMqttTopicRewrite400Code)[keyof typeof PutMqttTopicRewrite400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMqttTopicRewrite400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutMqttTopicRewrite400 = {
  code?: PutMqttTopicRewrite400Code
  message?: string
}

export type DeleteMqttTopicMetricsTopic404Code =
  (typeof DeleteMqttTopicMetricsTopic404Code)[keyof typeof DeleteMqttTopicMetricsTopic404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMqttTopicMetricsTopic404Code = {
  TOPIC_NOT_FOUND: 'TOPIC_NOT_FOUND',
} as const

export type DeleteMqttTopicMetricsTopic404 = {
  code?: DeleteMqttTopicMetricsTopic404Code
  message?: string
}

export type GetMqttTopicMetricsTopic404Code =
  (typeof GetMqttTopicMetricsTopic404Code)[keyof typeof GetMqttTopicMetricsTopic404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMqttTopicMetricsTopic404Code = {
  TOPIC_NOT_FOUND: 'TOPIC_NOT_FOUND',
} as const

export type GetMqttTopicMetricsTopic404 = {
  code?: GetMqttTopicMetricsTopic404Code
  message?: string
}

export type PostMqttTopicMetrics409Code =
  (typeof PostMqttTopicMetrics409Code)[keyof typeof PostMqttTopicMetrics409Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMqttTopicMetrics409Code = {
  EXCEED_LIMIT: 'EXCEED_LIMIT',
} as const

export type PostMqttTopicMetrics409 = {
  code?: PostMqttTopicMetrics409Code
  message?: string
}

export type PostMqttTopicMetrics400Code =
  (typeof PostMqttTopicMetrics400Code)[keyof typeof PostMqttTopicMetrics400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMqttTopicMetrics400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
  BAD_TOPIC: 'BAD_TOPIC',
} as const

export type PostMqttTopicMetrics400 = {
  code?: PostMqttTopicMetrics400Code
  message?: string
}

export type PostMqttTopicMetricsBody = {
  topic: string
}

export type PutMqttTopicMetrics404Code =
  (typeof PutMqttTopicMetrics404Code)[keyof typeof PutMqttTopicMetrics404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMqttTopicMetrics404Code = {
  TOPIC_NOT_FOUND: 'TOPIC_NOT_FOUND',
} as const

export type PutMqttTopicMetrics404 = {
  code?: PutMqttTopicMetrics404Code
  message?: string
}

export type DeleteMqttDelayedMessagesTopic404Code =
  (typeof DeleteMqttDelayedMessagesTopic404Code)[keyof typeof DeleteMqttDelayedMessagesTopic404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMqttDelayedMessagesTopic404Code = {
  MESSAGE_NOT_FOUND: 'MESSAGE_NOT_FOUND',
} as const

export type DeleteMqttDelayedMessagesTopic404 = {
  code?: DeleteMqttDelayedMessagesTopic404Code
  message?: string
}

export type DeleteMqttDelayedMessagesTopic400Code =
  (typeof DeleteMqttDelayedMessagesTopic400Code)[keyof typeof DeleteMqttDelayedMessagesTopic400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMqttDelayedMessagesTopic400Code = {
  INVALID_TOPIC_NAME: 'INVALID_TOPIC_NAME',
} as const

export type DeleteMqttDelayedMessagesTopic400 = {
  code?: DeleteMqttDelayedMessagesTopic400Code
  message?: string
}

export type DeleteMqttDelayedMessagesNodeMsgid404Code =
  (typeof DeleteMqttDelayedMessagesNodeMsgid404Code)[keyof typeof DeleteMqttDelayedMessagesNodeMsgid404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMqttDelayedMessagesNodeMsgid404Code = {
  MESSAGE_ID_NOT_FOUND: 'MESSAGE_ID_NOT_FOUND',
} as const

export type DeleteMqttDelayedMessagesNodeMsgid404 = {
  code?: DeleteMqttDelayedMessagesNodeMsgid404Code
  message?: string
}

export type DeleteMqttDelayedMessagesNodeMsgid400Code =
  (typeof DeleteMqttDelayedMessagesNodeMsgid400Code)[keyof typeof DeleteMqttDelayedMessagesNodeMsgid400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMqttDelayedMessagesNodeMsgid400Code = {
  MESSAGE_ID_SCHEMA_ERROR: 'MESSAGE_ID_SCHEMA_ERROR',
  INVALID_NODE: 'INVALID_NODE',
} as const

export type DeleteMqttDelayedMessagesNodeMsgid400 = {
  code?: DeleteMqttDelayedMessagesNodeMsgid400Code
  message?: string
}

export type GetMqttDelayedMessagesNodeMsgid404Code =
  (typeof GetMqttDelayedMessagesNodeMsgid404Code)[keyof typeof GetMqttDelayedMessagesNodeMsgid404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMqttDelayedMessagesNodeMsgid404Code = {
  MESSAGE_ID_NOT_FOUND: 'MESSAGE_ID_NOT_FOUND',
} as const

export type GetMqttDelayedMessagesNodeMsgid404 = {
  code?: GetMqttDelayedMessagesNodeMsgid404Code
  message?: string
}

export type GetMqttDelayedMessagesNodeMsgid400Code =
  (typeof GetMqttDelayedMessagesNodeMsgid400Code)[keyof typeof GetMqttDelayedMessagesNodeMsgid400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMqttDelayedMessagesNodeMsgid400Code = {
  MESSAGE_ID_SCHEMA_ERROR: 'MESSAGE_ID_SCHEMA_ERROR',
  INVALID_NODE: 'INVALID_NODE',
} as const

export type GetMqttDelayedMessagesNodeMsgid400 = {
  code?: GetMqttDelayedMessagesNodeMsgid400Code
  message?: string
}

export type GetMqttDelayedMessages200Meta = {
  /** @minimum 0 */
  count?: number
  /** @minimum 1 */
  limit?: number
  /** @minimum 1 */
  page?: number
}

export type GetMqttDelayedMessages200 = {
  data?: EmqxDelayedApiMessage[]
  meta?: GetMqttDelayedMessages200Meta
}

export type PutMqttDelayed400Code =
  (typeof PutMqttDelayed400Code)[keyof typeof PutMqttDelayed400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMqttDelayed400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutMqttDelayed400 = {
  code?: PutMqttDelayed400Code
  message?: string
}

export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetMqttDelayedMessagesParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
}

export type ModulesRewriteAction = (typeof ModulesRewriteAction)[keyof typeof ModulesRewriteAction]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ModulesRewriteAction = {
  subscribe: 'subscribe',
  publish: 'publish',
  all: 'all',
} as const

export interface ModulesRewrite {
  action: ModulesRewriteAction
  dest_topic: string
  re: string
  source_topic: string
}

export interface ModulesDelayed {
  enable?: boolean
  max_delayed_messages?: number
}

export type EmqxTopicMetricsApiTopicMetricsResetTime = number | string

export type EmqxTopicMetricsApiTopicMetricsCreateTime = number | string

export interface EmqxTopicMetricsApiReset {
  action: string
  topic?: string
}

export interface EmqxTopicMetricsApiMetrics {
  'message.dropped.count'?: number
  'message.dropped.rate'?: number
  'message.in.count'?: number
  'message.in.rate'?: number
  'message.out.count'?: number
  'message.out.rate'?: number
  'message.qos0.in.count'?: number
  'message.qos0.in.rate'?: number
  'message.qos0.out.count'?: number
  'message.qos0.out.rate'?: number
  'message.qos1.in.count'?: number
  'message.qos1.in.rate'?: number
  'message.qos1.out.count'?: number
  'message.qos1.out.rate'?: number
  'message.qos2.in.count'?: number
  'message.qos2.in.rate'?: number
  'message.qos2.out.count'?: number
  'message.qos2.out.rate'?: number
}

export interface EmqxTopicMetricsApiTopicMetrics {
  create_time: EmqxTopicMetricsApiTopicMetricsCreateTime
  metrics: EmqxTopicMetricsApiMetrics
  reset_time?: EmqxTopicMetricsApiTopicMetricsResetTime
  topic: string
}

export interface EmqxDelayedApiMessageWithoutPayload {
  /** @minimum 1 */
  delayed_interval?: number
  /** @minimum 0 */
  delayed_remaining?: number
  expected_at?: string
  from_clientid?: string
  from_username?: string
  msgid?: number
  node?: string
  publish_at?: string
  /**
   * @minimum 0
   * @maximum 2
   */
  qos?: number
  topic?: string
}

export interface EmqxDelayedApiMessage {
  /** @minimum 1 */
  delayed_interval?: number
  /** @minimum 0 */
  delayed_remaining?: number
  expected_at?: string
  from_clientid?: string
  from_username?: string
  msgid?: number
  node?: string
  payload?: string
  publish_at?: string
  /**
   * @minimum 0
   * @maximum 2
   */
  qos?: number
  topic?: string
}
