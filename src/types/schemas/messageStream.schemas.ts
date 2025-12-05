export type PutMessageStreamsStreamsTopicFilter503Code =
  (typeof PutMessageStreamsStreamsTopicFilter503Code)[keyof typeof PutMessageStreamsStreamsTopicFilter503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageStreamsStreamsTopicFilter503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutMessageStreamsStreamsTopicFilter503 = {
  code?: PutMessageStreamsStreamsTopicFilter503Code
  message?: string
}

export type PutMessageStreamsStreamsTopicFilter404Code =
  (typeof PutMessageStreamsStreamsTopicFilter404Code)[keyof typeof PutMessageStreamsStreamsTopicFilter404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageStreamsStreamsTopicFilter404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutMessageStreamsStreamsTopicFilter404 = {
  code?: PutMessageStreamsStreamsTopicFilter404Code
  message?: string
}

export type PutMessageStreamsStreamsTopicFilter400Code =
  (typeof PutMessageStreamsStreamsTopicFilter400Code)[keyof typeof PutMessageStreamsStreamsTopicFilter400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageStreamsStreamsTopicFilter400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutMessageStreamsStreamsTopicFilter400 = {
  code?: PutMessageStreamsStreamsTopicFilter400Code
  message?: string
}

export type PutMessageStreamsStreamsTopicFilter200 =
  | StreamsStreamLastvalueApiGet
  | StreamsStreamRegularApiGet

export type PutMessageStreamsStreamsTopicFilterBody =
  | StreamsStreamLastvalueApiPut
  | StreamsStreamRegularApiPut

export type GetMessageStreamsStreamsTopicFilter503Code =
  (typeof GetMessageStreamsStreamsTopicFilter503Code)[keyof typeof GetMessageStreamsStreamsTopicFilter503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageStreamsStreamsTopicFilter503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetMessageStreamsStreamsTopicFilter503 = {
  code?: GetMessageStreamsStreamsTopicFilter503Code
  message?: string
}

export type GetMessageStreamsStreamsTopicFilter404Code =
  (typeof GetMessageStreamsStreamsTopicFilter404Code)[keyof typeof GetMessageStreamsStreamsTopicFilter404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageStreamsStreamsTopicFilter404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetMessageStreamsStreamsTopicFilter404 = {
  code?: GetMessageStreamsStreamsTopicFilter404Code
  message?: string
}

export type GetMessageStreamsStreamsTopicFilter200 =
  | StreamsStreamLastvalueApiGet
  | StreamsStreamRegularApiGet

export type DeleteMessageStreamsStreamsTopicFilter503Code =
  (typeof DeleteMessageStreamsStreamsTopicFilter503Code)[keyof typeof DeleteMessageStreamsStreamsTopicFilter503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMessageStreamsStreamsTopicFilter503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type DeleteMessageStreamsStreamsTopicFilter503 = {
  code?: DeleteMessageStreamsStreamsTopicFilter503Code
  message?: string
}

export type DeleteMessageStreamsStreamsTopicFilter404Code =
  (typeof DeleteMessageStreamsStreamsTopicFilter404Code)[keyof typeof DeleteMessageStreamsStreamsTopicFilter404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMessageStreamsStreamsTopicFilter404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteMessageStreamsStreamsTopicFilter404 = {
  code?: DeleteMessageStreamsStreamsTopicFilter404Code
  message?: string
}

export type DeleteMessageStreamsStreamsTopicFilter400Code =
  (typeof DeleteMessageStreamsStreamsTopicFilter400Code)[keyof typeof DeleteMessageStreamsStreamsTopicFilter400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteMessageStreamsStreamsTopicFilter400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteMessageStreamsStreamsTopicFilter400 = {
  code?: DeleteMessageStreamsStreamsTopicFilter400Code
  message?: string
}

export type PostMessageStreamsStreams503Code =
  (typeof PostMessageStreamsStreams503Code)[keyof typeof PostMessageStreamsStreams503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageStreamsStreams503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostMessageStreamsStreams503 = {
  code?: PostMessageStreamsStreams503Code
  message?: string
}

export type PostMessageStreamsStreams400Code =
  (typeof PostMessageStreamsStreams400Code)[keyof typeof PostMessageStreamsStreams400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMessageStreamsStreams400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  MAX_STREAM_COUNT_REACHED: 'MAX_STREAM_COUNT_REACHED',
} as const

export type PostMessageStreamsStreams400 = {
  code?: PostMessageStreamsStreams400Code
  message?: string
}

export type PostMessageStreamsStreams200 = StreamsStreamLastvalueApiGet | StreamsStreamRegularApiGet

export type PostMessageStreamsStreamsBody =
  | StreamsStreamLastvalueApiPost
  | StreamsStreamRegularApiPost

export type GetMessageStreamsStreams503Code =
  (typeof GetMessageStreamsStreams503Code)[keyof typeof GetMessageStreamsStreams503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageStreamsStreams503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetMessageStreamsStreams503 = {
  code?: GetMessageStreamsStreams503Code
  message?: string
}

export type GetMessageStreamsStreams400Code =
  (typeof GetMessageStreamsStreams400Code)[keyof typeof GetMessageStreamsStreams400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetMessageStreamsStreams400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetMessageStreamsStreams400 = {
  code?: GetMessageStreamsStreams400Code
  message?: string
}

export type GetMessageStreamsStreams200Item =
  | StreamsStreamRegularApiGet
  | StreamsStreamLastvalueApiGet

export type PutMessageStreamsConfig400Code =
  (typeof PutMessageStreamsConfig400Code)[keyof typeof PutMessageStreamsConfig400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMessageStreamsConfig400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutMessageStreamsConfig400 = {
  code?: PutMessageStreamsConfig400Code
  message?: string
}

export type PublicLimitParameter = number

export type PublicCursorParameter = string

export type GetMessageStreamsStreamsParams = {
  cursor?: PublicCursorParameter
  limit?: PublicLimitParameter
}

export type StreamsStreamRegularApiPutIsLastvalue =
  (typeof StreamsStreamRegularApiPutIsLastvalue)[keyof typeof StreamsStreamRegularApiPutIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const StreamsStreamRegularApiPutIsLastvalue = {
  false: false,
} as const

export type StreamsStreamRegularApiPostIsLastvalue =
  (typeof StreamsStreamRegularApiPostIsLastvalue)[keyof typeof StreamsStreamRegularApiPostIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const StreamsStreamRegularApiPostIsLastvalue = {
  false: false,
} as const

export type StreamsStreamRegularApiGetIsLastvalue =
  (typeof StreamsStreamRegularApiGetIsLastvalue)[keyof typeof StreamsStreamRegularApiGetIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const StreamsStreamRegularApiGetIsLastvalue = {
  false: false,
} as const

export type StreamsStreamLastvalueApiPutIsLastvalue =
  (typeof StreamsStreamLastvalueApiPutIsLastvalue)[keyof typeof StreamsStreamLastvalueApiPutIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const StreamsStreamLastvalueApiPutIsLastvalue = {
  true: true,
} as const

export type StreamsStreamLastvalueApiPostIsLastvalue =
  (typeof StreamsStreamLastvalueApiPostIsLastvalue)[keyof typeof StreamsStreamLastvalueApiPostIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const StreamsStreamLastvalueApiPostIsLastvalue = {
  true: true,
} as const

export interface StreamsStreamLastvalueApiPost {
  data_retention_period?: string
  is_lastvalue: StreamsStreamLastvalueApiPostIsLastvalue
  key_expression: string
  limits: StreamsStreamIndividualLimits
  topic_filter: string
}

export type StreamsStreamLastvalueApiGetIsLastvalue =
  (typeof StreamsStreamLastvalueApiGetIsLastvalue)[keyof typeof StreamsStreamLastvalueApiGetIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const StreamsStreamLastvalueApiGetIsLastvalue = {
  true: true,
} as const

export interface StreamsStreamLastvalueApiGet {
  data_retention_period?: string
  is_lastvalue: StreamsStreamLastvalueApiGetIsLastvalue
  key_expression: string
  limits: StreamsStreamIndividualLimits
  topic_filter: string
}

export type StreamsStreamIndividualLimitsMaxShardMessageCount = number | 'infinity'

export type StreamsStreamIndividualLimitsMaxShardMessageBytes = string | 'infinity'

export interface StreamsStreamIndividualLimits {
  max_shard_message_bytes: StreamsStreamIndividualLimitsMaxShardMessageBytes
  max_shard_message_count: StreamsStreamIndividualLimitsMaxShardMessageCount
}

export interface StreamsStreamRegularApiPut {
  data_retention_period?: string
  is_lastvalue: StreamsStreamRegularApiPutIsLastvalue
  key_expression: string
  limits: StreamsStreamIndividualLimits
}

export interface StreamsStreamRegularApiPost {
  data_retention_period?: string
  is_lastvalue: StreamsStreamRegularApiPostIsLastvalue
  key_expression: string
  limits: StreamsStreamIndividualLimits
  topic_filter: string
}

export interface StreamsStreamRegularApiGet {
  data_retention_period?: string
  is_lastvalue: StreamsStreamRegularApiGetIsLastvalue
  key_expression: string
  limits: StreamsStreamIndividualLimits
  topic_filter: string
}

export interface StreamsStreamLastvalueApiPut {
  data_retention_period?: string
  is_lastvalue: StreamsStreamLastvalueApiPutIsLastvalue
  key_expression: string
  limits: StreamsStreamIndividualLimits
}

export interface StreamsAutoCreateRegular {
  data_retention_period?: string
  key_expression: string
  limits: StreamsStreamIndividualLimits
}

export interface StreamsAutoCreateLastvalue {
  data_retention_period?: string
  key_expression: string
  limits: StreamsStreamIndividualLimits
}

export type StreamsAutoCreateRegularProperty = StreamsAutoCreateRegular | false

export type StreamsAutoCreateLastvalueProperty = StreamsAutoCreateLastvalue | false

export interface StreamsAutoCreate {
  lastvalue: StreamsAutoCreateLastvalueProperty
  regular: StreamsAutoCreateRegularProperty
}

export interface StreamsApiConfigPut {
  auto_create: StreamsAutoCreate
  enable?: boolean
  gc_interval: string
  /** @minimum 0 */
  max_stream_count?: number
  regular_stream_retention_period: string
}

export interface StreamsApiConfigGet {
  auto_create: StreamsAutoCreate
  enable?: boolean
  gc_interval: string
  /** @minimum 0 */
  max_stream_count?: number
  regular_stream_retention_period: string
}
