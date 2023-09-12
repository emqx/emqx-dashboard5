export type PutMqttAutoSubscribe409Code =
  typeof PutMqttAutoSubscribe409Code[keyof typeof PutMqttAutoSubscribe409Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutMqttAutoSubscribe409Code = {
  EXCEED_LIMIT: 'EXCEED_LIMIT',
} as const

export type PutMqttAutoSubscribe409 = {
  code?: PutMqttAutoSubscribe409Code
  message?: string
}

export interface AutoSubscribeTopic {
  topic: string
  qos?: number
  rh?: number
  rap?: number
  nl?: number
}
