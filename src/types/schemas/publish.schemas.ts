export interface EmqxMgmtApiPublishPublishOk {
  id?: string
}

export type EmqxMgmtApiPublishPublishMessagePayloadEncoding =
  (typeof EmqxMgmtApiPublishPublishMessagePayloadEncoding)[keyof typeof EmqxMgmtApiPublishPublishMessagePayloadEncoding]

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
  /**
   * @minimum 0
   * @maximum 2
   */
  qos?: number
  retain?: boolean
  topic: string
}

export interface EmqxMgmtApiPublishPublishError {
  message?: string
  reason_code?: number
}

export type PostPublishBulk400 = EmqxMgmtApiPublishPublishError[] | EmqxMgmtApiPublishBadRequest

export type EmqxMgmtApiPublishMessagePropertiesUserProperties = { [key: string]: unknown }

export interface EmqxMgmtApiPublishMessageProperties {
  content_type?: string
  correlation_data?: string
  message_expiry_interval?: number
  /**
   * @minimum 0
   * @maximum 1
   */
  payload_format_indicator?: number
  response_topic?: string
  user_properties?: EmqxMgmtApiPublishMessagePropertiesUserProperties
}

export interface EmqxMgmtApiPublishBadRequest {
  code?: string
  message?: string
}
