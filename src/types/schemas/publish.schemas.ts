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
  /** @deprecated */
  clientid?: string
  payload: string
  payload_encoding?: EmqxMgmtApiPublishPublishMessagePayloadEncoding
  properties?: EmqxMgmtApiPublishMessageProperties
  qos?: number
  retain?: boolean
  topic: string
}

export interface EmqxMgmtApiPublishPublishError {
  message?: string
  reason_code?: number
}

export type PostPublishBulk400 = EmqxMgmtApiPublishBadRequest | EmqxMgmtApiPublishPublishError[]

export type EmqxMgmtApiPublishMessagePropertiesUserProperties = { [key: string]: any }

export interface EmqxMgmtApiPublishMessageProperties {
  content_type?: string
  correlation_data?: string
  message_expiry_interval?: number
  payload_format_indicator?: number
  response_topic?: string
  user_properties?: EmqxMgmtApiPublishMessagePropertiesUserProperties
}

export interface EmqxMgmtApiPublishBadRequest {
  code?: string
  message?: string
}
