export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetSlowSubscriptionsParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
}

export interface SlowSubscribersStatisticsRecord {
  clientid?: string
  node?: string
  topic?: string
  timespan?: number
  last_update_time?: number
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
  threshold?: string
  expire_interval?: string
  top_k_num?: number
  stats_type?: SlowSubsSlowSubsStatsType
}
