export type GetRelupPackage404Code =
  typeof GetRelupPackage404Code[keyof typeof GetRelupPackage404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetRelupPackage404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetRelupPackage404 = {
  code?: GetRelupPackage404Code
  message?: string
}

export type PostRelupPackageUpload400Code =
  typeof PostRelupPackageUpload400Code[keyof typeof PostRelupPackageUpload400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostRelupPackageUpload400Code = {
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  BAD_PLUGIN_INFO: 'BAD_PLUGIN_INFO',
} as const

export type PostRelupPackageUpload400 = {
  code?: PostRelupPackageUpload400Code
  message?: string
}

export type PostRelupPackageUploadBody = {
  plugin?: Blob
}

export type PostRelupUpgrade500Code =
  typeof PostRelupUpgrade500Code[keyof typeof PostRelupUpgrade500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostRelupUpgrade500Code = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type PostRelupUpgrade500 = {
  code?: PostRelupUpgrade500Code
  message?: string
}

export type PostRelupUpgrade400Code =
  typeof PostRelupUpgrade400Code[keyof typeof PostRelupUpgrade400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostRelupUpgrade400Code = {
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const

export type PostRelupUpgrade400 = {
  code?: PostRelupUpgrade400Code
  message?: string
}

export type PostRelupUpgradeNode500Code =
  typeof PostRelupUpgradeNode500Code[keyof typeof PostRelupUpgradeNode500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostRelupUpgradeNode500Code = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type PostRelupUpgradeNode500 = {
  code?: PostRelupUpgradeNode500Code
  message?: string
}

export type PostRelupUpgradeNode404Code =
  typeof PostRelupUpgradeNode404Code[keyof typeof PostRelupUpgradeNode404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostRelupUpgradeNode404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostRelupUpgradeNode404 = {
  code?: PostRelupUpgradeNode404Code
  message?: string
}

export type PostRelupUpgradeNode400Code =
  typeof PostRelupUpgradeNode400Code[keyof typeof PostRelupUpgradeNode400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostRelupUpgradeNode400Code = {
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const

export type PostRelupUpgradeNode400 = {
  code?: PostRelupUpgradeNode400Code
  message?: string
}

export type RelupUpgradeHistoryResult = RelupUpgradeError | 'success'

export type RelupUpgradeHistoryStatus =
  typeof RelupUpgradeHistoryStatus[keyof typeof RelupUpgradeHistoryStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RelupUpgradeHistoryStatus = {
  'in-progress': 'in-progress',
  finished: 'finished',
} as const

export type RelupUpgradeHistoryUpgradeOpts = { [key: string]: any }

export interface RelupUpgradeHistory {
  started_at?: string
  finished_at?: string
  from_vsn?: string
  target_vsn?: string
  upgrade_opts?: RelupUpgradeHistoryUpgradeOpts
  status?: RelupUpgradeHistoryStatus
  result?: RelupUpgradeHistoryResult
}

export type RelupUpgradeErrorDetails = { [key: string]: any }

export interface RelupUpgradeError {
  err_type?: string
  details?: RelupUpgradeErrorDetails
}

export type RelupRunningStatusRole =
  typeof RelupRunningStatusRole[keyof typeof RelupRunningStatusRole]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RelupRunningStatusRole = {
  core: 'core',
  replicant: 'replicant',
} as const

export type RelupRunningStatusStatus =
  typeof RelupRunningStatusStatus[keyof typeof RelupRunningStatusStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const RelupRunningStatusStatus = {
  'in-progress': 'in-progress',
  idle: 'idle',
} as const

export interface RelupRunningStatus {
  node?: string
  status?: RelupRunningStatusStatus
  role?: RelupRunningStatusRole
  live_connections?: number
  current_vsn?: string
  upgrade_history?: RelupUpgradeHistory[]
}

export interface RelupPackage {
  name?: string
  target_vsn?: string
  built_on_otp_release?: string
  applicable_vsns?: string[]
  build_date?: string
  change_logs?: string
  md5_sum?: string
}
