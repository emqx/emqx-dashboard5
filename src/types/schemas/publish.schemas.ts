export interface EmqxMgmtApiPublishPublishOk {
  id?: string
}

export type EmqxMgmtApiPublishPublishMessagePayloadEncoding =
  typeof EmqxMgmtApiPublishPublishMessagePayloadEncoding[keyof typeof EmqxMgmtApiPublishPublishMessagePayloadEncoding]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMgmtApiPublishPublishMessagePayloadEncoding = {
  plain: 'plain',
  base64: 'base64',
} as const

export interface EmqxMgmtApiPublishPublishMessage {
  payload_encoding?: EmqxMgmtApiPublishPublishMessagePayloadEncoding
  topic: string
  qos?: number
  /** @deprecated */
  clientid?: string
  payload: string
  properties?: EmqxMgmtApiPublishMessageProperties
  retain?: boolean
}

export interface EmqxMgmtApiPublishPublishError {
  reason_code?: number
  message?: string
}

export type PostPublishBulk400 = EmqxMgmtApiPublishPublishError[] | EmqxMgmtApiPublishBadRequest

export type EmqxMgmtApiPublishMessagePropertiesUserProperties = { [key: string]: any }

export interface EmqxMgmtApiPublishMessageProperties {
  payload_format_indicator?: number
  message_expiry_interval?: number
  response_topic?: string
  correlation_data?: string
  user_properties?: EmqxMgmtApiPublishMessagePropertiesUserProperties
  content_type?: string
}

export interface EmqxMgmtApiPublishBadRequest {
  code?: string
  message?: string
}
