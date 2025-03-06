export type GetSubscriptions500Code =
  (typeof GetSubscriptions500Code)[keyof typeof GetSubscriptions500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSubscriptions500Code = {
  NODE_DOWN: 'NODE_DOWN',
} as const

export type GetSubscriptions500 = {
  code?: GetSubscriptions500Code
  message?: string
}

export type GetSubscriptions400Code =
  (typeof GetSubscriptions400Code)[keyof typeof GetSubscriptions400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetSubscriptions400Code = {
  INVALID_PARAMETER: 'INVALID_PARAMETER',
} as const

export type GetSubscriptions400 = {
  code?: GetSubscriptions400Code
  message?: string
}

export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetSubscriptionsParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
  node?: string
  clientid?: string
  qos?: number
  topic?: string
  match_topic?: string
  share_group?: string
  durable?: boolean
}

export interface EmqxMgmtApiSubscriptionsSubscription {
  clientid?: string
  durable?: boolean
  nl?: number
  node?: string
  /**
   * @minimum 0
   * @maximum 2
   */
  qos?: number
  rap?: number
  rh?: number
  topic?: string
}
