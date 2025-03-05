export type PutGcpDevicesDeviceid400Code =
  typeof PutGcpDevicesDeviceid400Code[keyof typeof PutGcpDevicesDeviceid400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutGcpDevicesDeviceid400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutGcpDevicesDeviceid400 = {
  code?: PutGcpDevicesDeviceid400Code
  message?: string
}

export type GetGcpDevicesDeviceid404Code =
  typeof GetGcpDevicesDeviceid404Code[keyof typeof GetGcpDevicesDeviceid404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetGcpDevicesDeviceid404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetGcpDevicesDeviceid404 = {
  code?: GetGcpDevicesDeviceid404Code
  message?: string
}

export type PostGcpDevices400Code = typeof PostGcpDevices400Code[keyof typeof PostGcpDevices400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostGcpDevices400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostGcpDevices400 = {
  code?: PostGcpDevices400Code
  message?: string
}

export type GetGcpDevices200 = {
  data?: EmqxGcpDeviceApiGcpDeviceAllInfo[]
  meta?: PublicMeta
}

export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetGcpDevicesParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
}

export interface PublicMeta {
  count?: number
  hasnext: boolean
  limit?: number
  page?: number
}

export interface EmqxGcpDeviceApiKey {
  expires_at: number
  key: string
  key_type: string
}

export interface EmqxGcpDeviceApiImportResult {
  errors: number
  imported: number
}

export interface EmqxGcpDeviceApiGcpExportedDevice {
  blocked: boolean
  config: string
  deviceid: string
  keys?: EmqxGcpDeviceApiKey[]
  location?: string
  project?: string
  registry?: string
}

export interface EmqxGcpDeviceApiGcpDeviceInfo {
  config: string
  deviceid: string
  keys?: EmqxGcpDeviceApiKey[]
  location?: string
  project?: string
  registry?: string
}

export interface EmqxGcpDeviceApiGcpDeviceAllInfo {
  config: string
  created_at: number
  deviceid: string
  keys?: EmqxGcpDeviceApiKey[]
  location?: string
  project?: string
  registry?: string
}

export interface EmqxGcpDeviceApiGcpDevice {
  config: string
  keys?: EmqxGcpDeviceApiKey[]
  location?: string
  project?: string
  registry?: string
}
