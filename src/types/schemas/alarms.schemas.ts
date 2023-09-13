export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetAlarmsParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
  activated?: boolean
}

export interface PublicMeta {
  page?: number
  limit?: number
  count?: number
  hasnext: boolean
}

export type EmqxMgmtApiAlarmsAlarmDetails = { [key: string]: any }

export interface EmqxMgmtApiAlarmsAlarm {
  node?: string
  name?: string
  message?: string
  details?: EmqxMgmtApiAlarmsAlarmDetails
  duration?: number
  activate_at?: string
  deactivate_at?: string
}

export type GetAlarms200 = {
  data?: EmqxMgmtApiAlarmsAlarm[]
  meta?: PublicMeta
}
