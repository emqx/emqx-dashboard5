export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetAlarmsParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
  activated?: boolean
}

export interface PublicMeta {
  count?: number
  hasnext: boolean
  limit?: number
  page?: number
}

export type EmqxMgmtApiAlarmsAlarmDetails = { [key: string]: any }

export interface EmqxMgmtApiAlarmsAlarm {
  activate_at?: string
  deactivate_at?: string
  details?: EmqxMgmtApiAlarmsAlarmDetails
  duration?: number
  message?: string
  name?: string
  node?: string
}

export type GetAlarms200 = {
  data?: EmqxMgmtApiAlarmsAlarm[]
  meta?: PublicMeta
}
