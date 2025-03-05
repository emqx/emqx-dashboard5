export type GetTopicsTopic404Code = typeof GetTopicsTopic404Code[keyof typeof GetTopicsTopic404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetTopicsTopic404Code = {
  TOPIC_NOT_FOUND: 'TOPIC_NOT_FOUND',
} as const

export type GetTopicsTopic404 = {
  code?: GetTopicsTopic404Code
  message?: string
}

export type GetTopics200 = {
  data?: EmqxMgmtApiTopicsTopic[]
  meta?: PublicMeta
}

export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetTopicsParams = {
  topic?: string
  node?: string
  page?: PublicPageParameter
  limit?: PublicLimitParameter
}

export interface PublicMeta {
  count?: number
  hasnext: boolean
  limit?: number
  page?: number
}

export interface EmqxMgmtApiTopicsTopic {
  node: string
  session?: string
  topic: string
}
