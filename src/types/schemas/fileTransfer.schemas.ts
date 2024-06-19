export type GetFileTransferFilesClientidFileid503Code =
  typeof GetFileTransferFilesClientidFileid503Code[keyof typeof GetFileTransferFilesClientidFileid503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFileTransferFilesClientidFileid503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetFileTransferFilesClientidFileid503 = {
  code?: GetFileTransferFilesClientidFileid503Code
  message?: string
}

export type GetFileTransferFilesClientidFileid404Code =
  typeof GetFileTransferFilesClientidFileid404Code[keyof typeof GetFileTransferFilesClientidFileid404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFileTransferFilesClientidFileid404Code = {
  FILES_NOT_FOUND: 'FILES_NOT_FOUND',
} as const

export type GetFileTransferFilesClientidFileid404 = {
  code?: GetFileTransferFilesClientidFileid404Code
  message?: string
}

export type PutFileTransfer400Code =
  typeof PutFileTransfer400Code[keyof typeof PutFileTransfer400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutFileTransfer400Code = {
  UPDATE_FAILED: 'UPDATE_FAILED',
  INVALID_CONFIG: 'INVALID_CONFIG',
} as const

export type PutFileTransfer400 = {
  code?: PutFileTransfer400Code
  message?: string
}

export type GetFileTransferFiles503Code =
  typeof GetFileTransferFiles503Code[keyof typeof GetFileTransferFiles503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFileTransferFiles503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetFileTransferFiles503 = {
  code?: GetFileTransferFiles503Code
  message?: string
}

export type GetFileTransferFiles400Code =
  typeof GetFileTransferFiles400Code[keyof typeof GetFileTransferFiles400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFileTransferFiles400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetFileTransferFiles400 = {
  code?: GetFileTransferFiles400Code
  message?: string
}

export type GetFileTransferFilesParams = {
  following?: FileTransferFollowingParameter
  limit?: PublicLimitParameter
}

export type GetFileTransferFile503Code =
  typeof GetFileTransferFile503Code[keyof typeof GetFileTransferFile503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFileTransferFile503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetFileTransferFile503 = {
  code?: GetFileTransferFile503Code
  message?: string
}

export type GetFileTransferFile404Code =
  typeof GetFileTransferFile404Code[keyof typeof GetFileTransferFile404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetFileTransferFile404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetFileTransferFile404 = {
  code?: GetFileTransferFile404Code
  message?: string
}

export type PublicLimitParameter = number

export type FileTransferFollowingParameter = string

export type FileTransferFileRefParameter = string

export type FileTransferFileNodeParameter = string

export type GetFileTransferFileParams = {
  node: FileTransferFileNodeParameter
  fileref: FileTransferFileRefParameter
}

export type S3TransportOptionsHeaders = { [key: string]: any }

export type S3TransportOptionsPoolType =
  typeof S3TransportOptionsPoolType[keyof typeof S3TransportOptionsPoolType]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const S3TransportOptionsPoolType = {
  random: 'random',
  hash: 'hash',
} as const

export interface S3TransportOptions {
  ipv6_probe?: boolean
  connect_timeout?: string
  pool_type?: S3TransportOptionsPoolType
  pool_size?: number
  enable_pipelining?: number
  ssl?: EmqxSslClientOpts
  headers?: S3TransportOptionsHeaders
  max_retries?: number
  request_timeout?: string
}

export type FileTransferS3ExporterAcl =
  typeof FileTransferS3ExporterAcl[keyof typeof FileTransferS3ExporterAcl]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const FileTransferS3ExporterAcl = {
  private: 'private',
  public_read: 'public_read',
  public_read_write: 'public_read_write',
  authenticated_read: 'authenticated_read',
  bucket_owner_read: 'bucket_owner_read',
  bucket_owner_full_control: 'bucket_owner_full_control',
} as const

export interface FileTransferS3Exporter {
  access_key_id?: string
  secret_access_key?: string
  host: string
  port: number
  transport_options?: S3TransportOptions
  min_part_size?: string
  max_part_size?: string
  url_expire_time?: string
  bucket: string
  acl?: FileTransferS3ExporterAcl
  enable?: boolean
}

export interface FileTransferLocalStorageSegmentsGc {
  interval?: string
  maximum_segments_ttl?: string
  minimum_segments_ttl?: string
}

export interface FileTransferLocalStorageSegments {
  root?: string
  gc?: FileTransferLocalStorageSegmentsGc
}

export interface FileTransferLocalStorageExporter {
  root?: string
  enable?: boolean
}

export interface FileTransferLocalStorageExporterBackend {
  local?: FileTransferLocalStorageExporter
  s3?: FileTransferS3Exporter
}

export interface FileTransferLocalStorage {
  segments?: FileTransferLocalStorageSegments
  exporter?: FileTransferLocalStorageExporterBackend
  enable?: boolean
}

export interface FileTransferStorageBackend {
  local?: FileTransferLocalStorage
}

export interface FileTransferFileTransfer {
  enable?: boolean
  init_timeout?: string
  store_segment_timeout?: string
  assemble_timeout?: string
  storage?: FileTransferStorageBackend
}

export type EmqxSslClientOptsServerNameIndication = string | 'disable'

export type EmqxSslClientOptsPartialChain =
  typeof EmqxSslClientOptsPartialChain[keyof typeof EmqxSslClientOptsPartialChain]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsPartialChain = {
  true: 'true',
  false: 'false',
  two_cacerts_from_cacertfile: 'two_cacerts_from_cacertfile',
  cacert_from_cacertfile: 'cacert_from_cacertfile',
} as const

export type EmqxSslClientOptsLogLevel =
  typeof EmqxSslClientOptsLogLevel[keyof typeof EmqxSslClientOptsLogLevel]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsLogLevel = {
  emergency: 'emergency',
  alert: 'alert',
  critical: 'critical',
  error: 'error',
  warning: 'warning',
  notice: 'notice',
  info: 'info',
  debug: 'debug',
  none: 'none',
  all: 'all',
} as const

export type EmqxSslClientOptsVerify =
  typeof EmqxSslClientOptsVerify[keyof typeof EmqxSslClientOptsVerify]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxSslClientOptsVerify = {
  verify_peer: 'verify_peer',
  verify_none: 'verify_none',
} as const

export interface EmqxSslClientOpts {
  cacertfile?: string
  /** @deprecated */
  cacerts?: boolean
  certfile?: string
  keyfile?: string
  verify?: EmqxSslClientOptsVerify
  reuse_sessions?: boolean
  depth?: number
  password?: string
  versions?: string[]
  ciphers?: string[]
  secure_renegotiate?: boolean
  log_level?: EmqxSslClientOptsLogLevel
  hibernate_after?: string
  partial_chain?: EmqxSslClientOptsPartialChain
  verify_peer_ext_key_usage?: string
  enable?: boolean
  server_name_indication?: EmqxSslClientOptsServerNameIndication
}
