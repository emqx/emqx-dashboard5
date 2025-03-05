export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetSlowSubscriptionsParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
}

export interface SlowSubscribersStatisticsRecord {
  clientid?: string
  last_update_time?: number
  node?: string
  timespan?: number
  topic?: string
}

export type GetSlowSubscriptions200 = {
  data?: SlowSubscribersStatisticsRecord[]
}

export type SlowSubsSlowSubsStatsType =
  typeof SlowSubsSlowSubsStatsType[keyof typeof SlowSubsSlowSubsStatsType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SlowSubsSlowSubsStatsType = {
  whole: 'whole',
  internal: 'internal',
  response: 'response',
} as const

export interface SlowSubsSlowSubs {
  enable?: boolean
  expire_interval?: string
  stats_type?: SlowSubsSlowSubsStatsType
  threshold?: string
  top_k_num?: number
}
