export type PutTraceNameStop404Code =
  typeof PutTraceNameStop404Code[keyof typeof PutTraceNameStop404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutTraceNameStop404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutTraceNameStop404 = {
  code?: PutTraceNameStop404Code
  message?: string
}

export type DeleteTraceName404Code =
  typeof DeleteTraceName404Code[keyof typeof DeleteTraceName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteTraceName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteTraceName404 = {
  code?: DeleteTraceName404Code
  message?: string
}

export type GetTraceNameLog503Code =
  typeof GetTraceNameLog503Code[keyof typeof GetTraceNameLog503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetTraceNameLog503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetTraceNameLog503 = {
  code?: GetTraceNameLog503Code
  message?: string
}

export type GetTraceNameLog404Code =
  typeof GetTraceNameLog404Code[keyof typeof GetTraceNameLog404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetTraceNameLog404Code = {
  NOT_FOUND: 'NOT_FOUND',
  NODE_ERROR: 'NODE_ERROR',
} as const

export type GetTraceNameLog404 = {
  code?: GetTraceNameLog404Code
  message?: string
}

export type GetTraceNameLog400Code =
  typeof GetTraceNameLog400Code[keyof typeof GetTraceNameLog400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetTraceNameLog400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetTraceNameLog400 = {
  code?: GetTraceNameLog400Code
  message?: string
}

export type GetTraceNameLog200Meta = {
  bytes?: number
  position?: number
}

export type GetTraceNameLog200 = {
  items?: string
  meta?: GetTraceNameLog200Meta
}

export type GetTraceNameLogParams = {
  bytes?: TraceBytesParameter
  position?: TracePositionParameter
  node?: TraceNodeParameter
}

export type PostTrace409Code = typeof PostTrace409Code[keyof typeof PostTrace409Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostTrace409Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  DUPLICATE_CONDITION: 'DUPLICATE_CONDITION',
  BAD_TYPE: 'BAD_TYPE',
} as const

export type PostTrace409 = {
  code?: PostTrace409Code
  message?: string
}

export type PostTrace400Code = typeof PostTrace400Code[keyof typeof PostTrace400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostTrace400Code = {
  INVALID_PARAMS: 'INVALID_PARAMS',
} as const

export type PostTrace400 = {
  code?: PostTrace400Code
  message?: string
}

export type PostTraceBodyEndAt = number | string

export type PostTraceBodyStartAt = number | string

export type PostTraceBodyPayloadEncode =
  typeof PostTraceBodyPayloadEncode[keyof typeof PostTraceBodyPayloadEncode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostTraceBodyPayloadEncode = {
  hex: 'hex',
  text: 'text',
  hidden: 'hidden',
} as const

export type PostTraceBodyType = typeof PostTraceBodyType[keyof typeof PostTraceBodyType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostTraceBodyType = {
  clientid: 'clientid',
  topic: 'topic',
  ip_address: 'ip_address',
} as const

export type PostTraceBody = {
  name: string
  type: PostTraceBodyType
  topic?: string
  clientid?: string
  ip_address?: string
  payload_encode?: PostTraceBodyPayloadEncode
  start_at?: PostTraceBodyStartAt
  end_at?: PostTraceBodyEndAt
}

export type GetTraceNameDownload404Code =
  typeof GetTraceNameDownload404Code[keyof typeof GetTraceNameDownload404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetTraceNameDownload404Code = {
  NOT_FOUND: 'NOT_FOUND',
  NODE_ERROR: 'NODE_ERROR',
} as const

export type GetTraceNameDownload404 = {
  code?: GetTraceNameDownload404Code
  message?: string
}

export type GetTraceNameLogDetail404Code =
  typeof GetTraceNameLogDetail404Code[keyof typeof GetTraceNameLogDetail404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetTraceNameLogDetail404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetTraceNameLogDetail404 = {
  code?: GetTraceNameLogDetail404Code
  message?: string
}

export type TracePositionParameter = number

export type TraceNodeParameter = string

export type GetTraceNameDownloadParams = {
  node?: TraceNodeParameter
}

export type TraceBytesParameter = number

export type TraceTraceLogSizeItem = { [key: string]: any }

export type TraceTraceEndAt = number | string

export type TraceTraceStartAt = number | string

export type TraceTracePayloadEncode =
  typeof TraceTracePayloadEncode[keyof typeof TraceTracePayloadEncode]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const TraceTracePayloadEncode = {
  hex: 'hex',
  text: 'text',
  hidden: 'hidden',
} as const

export type TraceTraceStatus = typeof TraceTraceStatus[keyof typeof TraceTraceStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const TraceTraceStatus = {
  running: 'running',
  stopped: 'stopped',
  waiting: 'waiting',
} as const

export type TraceTraceType = typeof TraceTraceType[keyof typeof TraceTraceType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const TraceTraceType = {
  clientid: 'clientid',
  topic: 'topic',
  ip_address: 'ip_address',
} as const

export interface TraceTrace {
  name: string
  type: TraceTraceType
  topic?: string
  clientid?: string
  ip_address?: string
  status?: TraceTraceStatus
  payload_encode?: TraceTracePayloadEncode
  start_at?: TraceTraceStartAt
  end_at?: TraceTraceEndAt
  log_size?: TraceTraceLogSizeItem[]
}

export interface TraceLogFileDetail {
  node?: string
  size?: number
  mtime?: number
}
