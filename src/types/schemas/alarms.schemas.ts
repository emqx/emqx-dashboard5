export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetAlarmsParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
  activated?: boolean
}

export interface PublicMeta {
  /** @minimum 0 */
  count?: number
  hasnext: boolean
  /**
   * @minimum 1
   * @maximum 10000
   */
  limit?: number
  /** @minimum 1 */
  page?: number
}

export type EmqxMgmtApiAlarmsAlarmDetails = { [key: string]: unknown }

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
