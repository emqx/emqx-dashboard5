export type PutLicenseSetting400Code =
  (typeof PutLicenseSetting400Code)[keyof typeof PutLicenseSetting400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutLicenseSetting400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutLicenseSetting400 = {
  code?: PutLicenseSetting400Code
  message?: string
}

export type PutLicenseSetting200HighWatermarkTimezone = string | 'system'

export type PutLicenseSetting200 = {
  connection_high_watermark?: string
  connection_low_watermark?: string
  high_watermark_timezone?: PutLicenseSetting200HighWatermarkTimezone
}

export type PutLicenseSettingBodyHighWatermarkTimezone = string | 'system'

export type PutLicenseSettingBody = {
  connection_high_watermark?: string
  connection_low_watermark?: string
  high_watermark_timezone?: PutLicenseSettingBodyHighWatermarkTimezone
}

export type GetLicenseSetting200HighWatermarkTimezone = string | 'system'

export type GetLicenseSetting200 = {
  connection_high_watermark?: string
  connection_low_watermark?: string
  high_watermark_timezone?: GetLicenseSetting200HighWatermarkTimezone
}

export type GetLicenseSessionHwmHistoryPeriod =
  (typeof GetLicenseSessionHwmHistoryPeriod)[keyof typeof GetLicenseSessionHwmHistoryPeriod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetLicenseSessionHwmHistoryPeriod = {
  daily: 'daily',
  monthly: 'monthly',
} as const

export type GetLicenseSessionHwmHistoryParams = {
  period?: GetLicenseSessionHwmHistoryPeriod
  limit?: number
}

export type PostLicense400Code = (typeof PostLicense400Code)[keyof typeof PostLicense400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostLicense400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostLicense400 = {
  code?: PostLicense400Code
  message?: string
}

export type PostLicense200 = { [key: string]: unknown }

export type GetLicense200 = { [key: string]: unknown }

export interface LicenseHttpApiSessionHwmRow {
  /** @minimum 0 */
  high_watermark?: number
  observed_at?: string
  period?: string
}

export type LicenseHttpApiSessionHwmHistoryPeriod =
  (typeof LicenseHttpApiSessionHwmHistoryPeriod)[keyof typeof LicenseHttpApiSessionHwmHistoryPeriod]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LicenseHttpApiSessionHwmHistoryPeriod = {
  daily: 'daily',
  monthly: 'monthly',
} as const

export interface LicenseHttpApiSessionHwmHistory {
  /** @minimum 0 */
  count?: number
  data?: LicenseHttpApiSessionHwmRow[]
  period?: LicenseHttpApiSessionHwmHistoryPeriod
}

export type LicenseHttpApiKeyLicenseKey = string | 'evaluation' | 'default'

export interface LicenseHttpApiKeyLicense {
  key: LicenseHttpApiKeyLicenseKey
}
