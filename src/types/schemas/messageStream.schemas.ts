export type PutStreamsConfig400Code =
  (typeof PutStreamsConfig400Code)[keyof typeof PutStreamsConfig400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutStreamsConfig400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutStreamsConfig400 = {
  code?: PutStreamsConfig400Code
  message?: string
}

export type PostStreams503Code = (typeof PostStreams503Code)[keyof typeof PostStreams503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostStreams503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostStreams503 = {
  code?: PostStreams503Code
  message?: string
}

export type PostStreams400Code = (typeof PostStreams400Code)[keyof typeof PostStreams400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostStreams400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  MAX_STREAM_COUNT_REACHED: 'MAX_STREAM_COUNT_REACHED',
} as const

export type PostStreams400 = {
  code?: PostStreams400Code
  message?: string
}

export type PostStreams200 = StreamsStreamLastvalueApiGet | StreamsStreamRegularApiGet

export type PostStreamsBody = StreamsStreamLastvalueApiPost | StreamsStreamRegularApiPost

export type GetStreams503Code = (typeof GetStreams503Code)[keyof typeof GetStreams503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetStreams503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetStreams503 = {
  code?: GetStreams503Code
  message?: string
}

export type GetStreams400Code = (typeof GetStreams400Code)[keyof typeof GetStreams400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetStreams400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetStreams400 = {
  code?: GetStreams400Code
  message?: string
}

export type GetStreams200Item = StreamsStreamLastvalueApiGet | StreamsStreamRegularApiGet

export type GetStreamsParams = {
  cursor?: PublicCursorParameter
  limit?: PublicLimitParameter
}

export type PutStreamName503Code = (typeof PutStreamName503Code)[keyof typeof PutStreamName503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutStreamName503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PutStreamName503 = {
  code?: PutStreamName503Code
  message?: string
}

export type PutStreamName404Code = (typeof PutStreamName404Code)[keyof typeof PutStreamName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutStreamName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutStreamName404 = {
  code?: PutStreamName404Code
  message?: string
}

export type PutStreamName400Code = (typeof PutStreamName400Code)[keyof typeof PutStreamName400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutStreamName400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutStreamName400 = {
  code?: PutStreamName400Code
  message?: string
}

export type PutStreamName200 = StreamsStreamLastvalueApiGet | StreamsStreamRegularApiGet

export type GetStreamName503Code = (typeof GetStreamName503Code)[keyof typeof GetStreamName503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetStreamName503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetStreamName503 = {
  code?: GetStreamName503Code
  message?: string
}

export type GetStreamName404Code = (typeof GetStreamName404Code)[keyof typeof GetStreamName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetStreamName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetStreamName404 = {
  code?: GetStreamName404Code
  message?: string
}

export type GetStreamName200 = StreamsStreamLastvalueApiGet | StreamsStreamRegularApiGet

export type DeleteStreamName503Code =
  (typeof DeleteStreamName503Code)[keyof typeof DeleteStreamName503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteStreamName503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type DeleteStreamName503 = {
  code?: DeleteStreamName503Code
  message?: string
}

export type DeleteStreamName404Code =
  (typeof DeleteStreamName404Code)[keyof typeof DeleteStreamName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteStreamName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteStreamName404 = {
  code?: DeleteStreamName404Code
  message?: string
}

export type DeleteStreamName400Code =
  (typeof DeleteStreamName400Code)[keyof typeof DeleteStreamName400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteStreamName400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type DeleteStreamName400 = {
  code?: DeleteStreamName400Code
  message?: string
}

export type PublicLimitParameter = number

export type PublicCursorParameter = string

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

export interface StreamsStreamRegularApiGet {
  data_retention_period?: string
  is_lastvalue: StreamsStreamRegularApiGetIsLastvalue
  key_expression: string
  limits: StreamsStreamIndividualLimits
  name: string
  topic_filter: string
}

export type StreamsStreamLastvalueApiPutIsLastvalue =
  (typeof StreamsStreamLastvalueApiPutIsLastvalue)[keyof typeof StreamsStreamLastvalueApiPutIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const StreamsStreamLastvalueApiPutIsLastvalue = {
  true: true,
} as const

export interface StreamsStreamLastvalueApiPut {
  data_retention_period?: string
  is_lastvalue: StreamsStreamLastvalueApiPutIsLastvalue
  key_expression: string
  limits: StreamsStreamIndividualLimits
}

export type PutStreamNameBody = StreamsStreamLastvalueApiPut | StreamsStreamRegularApiPut

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
  name: string
  topic_filter: string
}

export type StreamsStreamLastvalueApiGetIsLastvalue =
  (typeof StreamsStreamLastvalueApiGetIsLastvalue)[keyof typeof StreamsStreamLastvalueApiGetIsLastvalue]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const StreamsStreamLastvalueApiGetIsLastvalue = {
  true: true,
} as const

export type StreamsStreamIndividualLimitsMaxShardMessageCount = 'infinity' | number

export type StreamsStreamIndividualLimitsMaxShardMessageBytes = 'infinity' | string

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
  name: string
  topic_filter: string
}

export interface StreamsStreamLastvalueApiGet {
  data_retention_period?: string
  is_lastvalue: StreamsStreamLastvalueApiGetIsLastvalue
  key_expression: string
  limits: StreamsStreamIndividualLimits
  name: string
  topic_filter: string
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

export type StreamsApiConfigPutEnable = 'auto' | boolean

export interface StreamsApiConfigPut {
  auto_create: StreamsAutoCreate
  enable: StreamsApiConfigPutEnable
  gc_interval: string
  /** @minimum 0 */
  max_stream_count?: number
  regular_stream_retention_period: string
}

export type StreamsApiConfigGetEnable = 'auto' | boolean

export interface StreamsApiConfigGet {
  auto_create: StreamsAutoCreate
  enable: StreamsApiConfigGetEnable
  gc_interval: string
  /** @minimum 0 */
  max_stream_count?: number
  regular_stream_retention_period: string
}
