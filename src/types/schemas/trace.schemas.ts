export type PutTraceNameStop404Code =
  (typeof PutTraceNameStop404Code)[keyof typeof PutTraceNameStop404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutTraceNameStop404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutTraceNameStop404 = {
  code?: PutTraceNameStop404Code
  message?: string
}

export type GetTraceNameLogDetail404Code =
  (typeof GetTraceNameLogDetail404Code)[keyof typeof GetTraceNameLogDetail404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetTraceNameLogDetail404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetTraceNameLogDetail404 = {
  code?: GetTraceNameLogDetail404Code
  message?: string
}

export type GetTraceNameLog503Code =
  (typeof GetTraceNameLog503Code)[keyof typeof GetTraceNameLog503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetTraceNameLog503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetTraceNameLog503 = {
  code?: GetTraceNameLog503Code
  message?: string
}

export type GetTraceNameLog404Code =
  (typeof GetTraceNameLog404Code)[keyof typeof GetTraceNameLog404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetTraceNameLog404Code = {
  NODE_ERROR: 'NODE_ERROR',
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetTraceNameLog404 = {
  code?: GetTraceNameLog404Code
  message?: string
}

export type GetTraceNameLog400Code =
  (typeof GetTraceNameLog400Code)[keyof typeof GetTraceNameLog400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetTraceNameLog400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
  INVALID_PARAMETER: 'INVALID_PARAMETER',
  STALE_CURSOR: 'STALE_CURSOR',
} as const

export type GetTraceNameLog400 = {
  code?: GetTraceNameLog400Code
  message?: string
}

export type GetTraceNameLog200 = {
  items?: string
  meta?: GetTraceNameLog200Meta
}

export type GetTraceNameLog200MetaPosition = number | string

export type GetTraceNameLog200MetaHint =
  (typeof GetTraceNameLog200MetaHint)[keyof typeof GetTraceNameLog200MetaHint]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetTraceNameLog200MetaHint = {
  eof: 'eof',
  retry: 'retry',
} as const

export type GetTraceNameLog200Meta = {
  /**
   * @minimum 0
   * @maximum 67108864
   */
  bytes?: number
  hint?: GetTraceNameLog200MetaHint
  position?: GetTraceNameLog200MetaPosition
}

export type GetTraceNameLogParams = {
  bytes?: TraceBytesParameter
  node?: TraceNodeParameter
  position?: TracePositionParameter
}

export type GetTraceNameDownload404Code =
  (typeof GetTraceNameDownload404Code)[keyof typeof GetTraceNameDownload404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetTraceNameDownload404Code = {
  NODE_ERROR: 'NODE_ERROR',
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetTraceNameDownload404 = {
  code?: GetTraceNameDownload404Code
  message?: string
}

export type GetTraceNameDownloadParams = {
  node?: TraceNodeParameter
}

export type DeleteTraceName404Code =
  (typeof DeleteTraceName404Code)[keyof typeof DeleteTraceName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteTraceName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteTraceName404 = {
  code?: DeleteTraceName404Code
  message?: string
}

export type PostTrace409Code = (typeof PostTrace409Code)[keyof typeof PostTrace409Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostTrace409Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  BAD_TYPE: 'BAD_TYPE',
  DUPLICATE_CONDITION: 'DUPLICATE_CONDITION',
} as const

export type PostTrace409 = {
  code?: PostTrace409Code
  message?: string
}

export type PostTrace400Code = (typeof PostTrace400Code)[keyof typeof PostTrace400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostTrace400Code = {
  EXCEED_LIMIT: 'EXCEED_LIMIT',
  INVALID_PARAMS: 'INVALID_PARAMS',
} as const

export type PostTrace400 = {
  code?: PostTrace400Code
  message?: string
}

export type PostTraceBodyType = (typeof PostTraceBodyType)[keyof typeof PostTraceBodyType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostTraceBodyType = {
  clientid: 'clientid',
  ip_address: 'ip_address',
  ruleid: 'ruleid',
  topic: 'topic',
} as const

export type PostTraceBodyStartAt = string | number

export type PostTraceBodyPayloadEncode =
  (typeof PostTraceBodyPayloadEncode)[keyof typeof PostTraceBodyPayloadEncode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostTraceBodyPayloadEncode = {
  hex: 'hex',
  hidden: 'hidden',
  text: 'text',
} as const

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostTraceBodyFormatter = { json: 'json', text: 'text' } as const

export type PostTraceBodyEndAt = string | number

export type PostTraceBody = {
  clientid?: string
  end_at?: PostTraceBodyEndAt
  formatter?: (typeof PostTraceBodyFormatter)[keyof typeof PostTraceBodyFormatter]
  ip_address?: string
  name: string
  payload_encode?: PostTraceBodyPayloadEncode
  payload_limit?: number
  ruleid?: string
  start_at?: PostTraceBodyStartAt
  topic?: string
  type: PostTraceBodyType
}

export type TracePositionParameter = number | string

export type TraceNodeParameter = string

export type TraceBytesParameter = number

export type TraceTraceType = (typeof TraceTraceType)[keyof typeof TraceTraceType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const TraceTraceType = {
  clientid: 'clientid',
  ip_address: 'ip_address',
  ruleid: 'ruleid',
  topic: 'topic',
} as const

export type TraceTraceStatus = (typeof TraceTraceStatus)[keyof typeof TraceTraceStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const TraceTraceStatus = {
  running: 'running',
  stopped: 'stopped',
  waiting: 'waiting',
} as const

export type TraceTraceStartAt = string | number

export type TraceTracePayloadEncode =
  (typeof TraceTracePayloadEncode)[keyof typeof TraceTracePayloadEncode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const TraceTracePayloadEncode = {
  hex: 'hex',
  hidden: 'hidden',
  text: 'text',
} as const

export type TraceTraceLogSizeItem = { [key: string]: unknown }

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const TraceTraceFormatter = { json: 'json', text: 'text' } as const

export type TraceTraceEndAt = string | number

export interface TraceTrace {
  clientid?: string
  end_at?: TraceTraceEndAt
  formatter?: (typeof TraceTraceFormatter)[keyof typeof TraceTraceFormatter]
  ip_address?: string
  log_size?: TraceTraceLogSizeItem[]
  name: string
  payload_encode?: TraceTracePayloadEncode
  payload_limit?: number
  ruleid?: string
  start_at?: TraceTraceStartAt
  status?: TraceTraceStatus
  topic?: string
  type: TraceTraceType
}

export interface TraceLogFileDetail {
  mtime?: number
  node?: string
  size?: number
}
