export type PutLicenseSetting400Code =
  typeof PutLicenseSetting400Code[keyof typeof PutLicenseSetting400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutLicenseSetting400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutLicenseSetting400 = {
  code?: PutLicenseSetting400Code
  message?: string
}

export type PutLicenseSetting200 = {
  connection_low_watermark?: string
  connection_high_watermark?: string
}

export type PutLicenseSettingBody = {
  connection_low_watermark?: string
  connection_high_watermark?: string
}

export type GetLicenseSetting200 = {
  connection_low_watermark?: string
  connection_high_watermark?: string
}

export type PostLicense400Code = typeof PostLicense400Code[keyof typeof PostLicense400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostLicense400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostLicense400 = {
  code?: PostLicense400Code
  message?: string
}

export type PostLicense200 = { [key: string]: any }

export type GetLicense200 = { [key: string]: any }

export type LicenseHttpApiKeyLicenseKey = string | 'default'

export interface LicenseHttpApiKeyLicense {
  key: LicenseHttpApiKeyLicenseKey
}
