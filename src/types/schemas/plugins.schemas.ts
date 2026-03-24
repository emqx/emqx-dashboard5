export type PostPluginsInstall400Code =
  (typeof PostPluginsInstall400Code)[keyof typeof PostPluginsInstall400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostPluginsInstall400Code = {
  ALREADY_INSTALLED: 'ALREADY_INSTALLED',
  BAD_FORM_DATA: 'BAD_FORM_DATA',
  BAD_PLUGIN_INFO: 'BAD_PLUGIN_INFO',
  FORBIDDEN: 'FORBIDDEN',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const

export type PostPluginsInstall400 = {
  code?: PostPluginsInstall400Code
  message?: string
}

export type PostPluginsInstallBody = {
  plugin?: Blob
}

export type PostPluginsClusterSync404Code =
  (typeof PostPluginsClusterSync404Code)[keyof typeof PostPluginsClusterSync404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostPluginsClusterSync404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostPluginsClusterSync404 = {
  code?: PostPluginsClusterSync404Code
  message?: string
}

export type PostPluginsClusterSync400Code =
  (typeof PostPluginsClusterSync400Code)[keyof typeof PostPluginsClusterSync400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostPluginsClusterSync400Code = {
  BAD_PLUGIN_INFO: 'BAD_PLUGIN_INFO',
} as const

export type PostPluginsClusterSync400 = {
  code?: PostPluginsClusterSync400Code
  message?: string
}

export type GetPluginsNameSchema404Code =
  (typeof GetPluginsNameSchema404Code)[keyof typeof GetPluginsNameSchema404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetPluginsNameSchema404Code = {
  FILE_NOT_EXISTED: 'FILE_NOT_EXISTED',
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetPluginsNameSchema404 = {
  code?: GetPluginsNameSchema404Code
  message?: string
}

export type PostPluginsNameMove400Code =
  (typeof PostPluginsNameMove400Code)[keyof typeof PostPluginsNameMove400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostPluginsNameMove400Code = {
  MOVE_FAILED: 'MOVE_FAILED',
} as const

export type PostPluginsNameMove400 = {
  code?: PostPluginsNameMove400Code
  message?: string
}

export type PostPluginsNameConfigUpload500Code =
  (typeof PostPluginsNameConfigUpload500Code)[keyof typeof PostPluginsNameConfigUpload500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostPluginsNameConfigUpload500Code = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type PostPluginsNameConfigUpload500 = {
  code?: PostPluginsNameConfigUpload500Code
  message?: string
}

export type PostPluginsNameConfigUpload404Code =
  (typeof PostPluginsNameConfigUpload404Code)[keyof typeof PostPluginsNameConfigUpload404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostPluginsNameConfigUpload404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PostPluginsNameConfigUpload404 = {
  code?: PostPluginsNameConfigUpload404Code
  message?: string
}

export type PostPluginsNameConfigUpload400Code =
  (typeof PostPluginsNameConfigUpload400Code)[keyof typeof PostPluginsNameConfigUpload400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostPluginsNameConfigUpload400Code = {
  BAD_CONFIG: 'BAD_CONFIG',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const

export type PostPluginsNameConfigUpload400 = {
  code?: PostPluginsNameConfigUpload400Code
  message?: string
}

export type PostPluginsNameConfigUploadBody = {
  config?: Blob
}

export type GetPluginsNameConfigDownload404Code =
  (typeof GetPluginsNameConfigDownload404Code)[keyof typeof GetPluginsNameConfigDownload404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetPluginsNameConfigDownload404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetPluginsNameConfigDownload404 = {
  code?: GetPluginsNameConfigDownload404Code
  message?: string
}

export type GetPluginsNameConfigDownload400Code =
  (typeof GetPluginsNameConfigDownload400Code)[keyof typeof GetPluginsNameConfigDownload400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetPluginsNameConfigDownload400Code = {
  BAD_CONFIG: 'BAD_CONFIG',
} as const

export type GetPluginsNameConfigDownload400 = {
  code?: GetPluginsNameConfigDownload400Code
  message?: string
}

export type PutPluginsNameConfig500Code =
  (typeof PutPluginsNameConfig500Code)[keyof typeof PutPluginsNameConfig500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutPluginsNameConfig500Code = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type PutPluginsNameConfig500 = {
  code?: PutPluginsNameConfig500Code
  message?: string
}

export type PutPluginsNameConfig404Code =
  (typeof PutPluginsNameConfig404Code)[keyof typeof PutPluginsNameConfig404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutPluginsNameConfig404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutPluginsNameConfig404 = {
  code?: PutPluginsNameConfig404Code
  message?: string
}

export type PutPluginsNameConfig400Code =
  (typeof PutPluginsNameConfig400Code)[keyof typeof PutPluginsNameConfig400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutPluginsNameConfig400Code = {
  BAD_CONFIG: 'BAD_CONFIG',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
} as const

export type PutPluginsNameConfig400 = {
  code?: PutPluginsNameConfig400Code
  message?: string
}

export type PutPluginsNameConfigBody = { [key: string]: unknown }

export type GetPluginsNameConfig404Code =
  (typeof GetPluginsNameConfig404Code)[keyof typeof GetPluginsNameConfig404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetPluginsNameConfig404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetPluginsNameConfig404 = {
  code?: GetPluginsNameConfig404Code
  message?: string
}

export type GetPluginsNameConfig400Code =
  (typeof GetPluginsNameConfig400Code)[keyof typeof GetPluginsNameConfig400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetPluginsNameConfig400Code = {
  BAD_CONFIG: 'BAD_CONFIG',
} as const

export type GetPluginsNameConfig400 = {
  code?: GetPluginsNameConfig400Code
  message?: string
}

export type PutPluginsNameAction404Code =
  (typeof PutPluginsNameAction404Code)[keyof typeof PutPluginsNameAction404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutPluginsNameAction404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutPluginsNameAction404 = {
  code?: PutPluginsNameAction404Code
  message?: string
}

export type PutPluginsNameAction400Code =
  (typeof PutPluginsNameAction400Code)[keyof typeof PutPluginsNameAction400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutPluginsNameAction400Code = {
  PARAM_ERROR: 'PARAM_ERROR',
} as const

export type PutPluginsNameAction400 = {
  code?: PutPluginsNameAction400Code
  message?: string
}

export type GetPluginsName404Code =
  (typeof GetPluginsName404Code)[keyof typeof GetPluginsName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetPluginsName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetPluginsName404 = {
  code?: GetPluginsName404Code
  message?: string
}

export type DeletePluginsName404Code =
  (typeof DeletePluginsName404Code)[keyof typeof DeletePluginsName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeletePluginsName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeletePluginsName404 = {
  code?: DeletePluginsName404Code
  message?: string
}

export type DeletePluginsName400Code =
  (typeof DeletePluginsName400Code)[keyof typeof DeletePluginsName400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeletePluginsName400Code = {
  PARAM_ERROR: 'PARAM_ERROR',
} as const

export type DeletePluginsName400 = {
  code?: DeletePluginsName400Code
  message?: string
}

export type PutPluginApiPlugin503 = { [key: string]: unknown }

export type PutPluginApiPlugin500 = { [key: string]: unknown }

export type PutPluginApiPlugin404 = { [key: string]: unknown }

export type PutPluginApiPlugin401 = { [key: string]: unknown }

export type PutPluginApiPlugin400 = { [key: string]: unknown }

export type PutPluginApiPlugin200 = { [key: string]: unknown }

export type PutPluginApiPluginBody = { [key: string]: unknown }

export type PostPluginApiPlugin503 = { [key: string]: unknown }

export type PostPluginApiPlugin500 = { [key: string]: unknown }

export type PostPluginApiPlugin404 = { [key: string]: unknown }

export type PostPluginApiPlugin401 = { [key: string]: unknown }

export type PostPluginApiPlugin400 = { [key: string]: unknown }

export type PostPluginApiPlugin200 = { [key: string]: unknown }

export type PostPluginApiPluginBody = { [key: string]: unknown }

export type PatchPluginApiPlugin503 = { [key: string]: unknown }

export type PatchPluginApiPlugin500 = { [key: string]: unknown }

export type PatchPluginApiPlugin404 = { [key: string]: unknown }

export type PatchPluginApiPlugin401 = { [key: string]: unknown }

export type PatchPluginApiPlugin400 = { [key: string]: unknown }

export type PatchPluginApiPlugin200 = { [key: string]: unknown }

export type PatchPluginApiPluginBody = { [key: string]: unknown }

export type GetPluginApiPlugin503 = { [key: string]: unknown }

export type GetPluginApiPlugin500 = { [key: string]: unknown }

export type GetPluginApiPlugin404 = { [key: string]: unknown }

export type GetPluginApiPlugin401 = { [key: string]: unknown }

export type GetPluginApiPlugin400 = { [key: string]: unknown }

export type GetPluginApiPlugin200 = { [key: string]: unknown }

export type DeletePluginApiPlugin503 = { [key: string]: unknown }

export type DeletePluginApiPlugin500 = { [key: string]: unknown }

export type DeletePluginApiPlugin404 = { [key: string]: unknown }

export type DeletePluginApiPlugin401 = { [key: string]: unknown }

export type DeletePluginApiPlugin400 = { [key: string]: unknown }

export type DeletePluginApiPlugin200 = { [key: string]: unknown }

export interface PluginsSyncRequest {
  name: string
}

export type PluginsRunningStatusStatus =
  (typeof PluginsRunningStatusStatus)[keyof typeof PluginsRunningStatusStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PluginsRunningStatusStatus = {
  running: 'running',
  stopped: 'stopped',
} as const

export interface PluginsRunningStatus {
  node?: string
  status?: PluginsRunningStatusStatus
}

export type PluginsPositionPosition = string | 'rear' | 'front'

export interface PluginsPosition {
  position?: PluginsPositionPosition
}

export type PluginsPluginCompatibility = { [key: string]: unknown }

export type PluginsHealthStatusStatus =
  (typeof PluginsHealthStatusStatus)[keyof typeof PluginsHealthStatusStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PluginsHealthStatusStatus = {
  error: 'error',
  ok: 'ok',
} as const

export interface PluginsHealthStatus {
  message?: string
  status?: PluginsHealthStatusStatus
}

export interface PluginsBuilder {
  contact?: string
  name?: string
  website?: string
}

export interface PluginsPlugin {
  author?: string[]
  builder?: PluginsBuilder
  built_on_otp_release?: string
  compatibility?: PluginsPluginCompatibility
  description: string
  functionality?: string[]
  git_commit_or_build_date?: string
  git_ref?: string
  health_status?: PluginsHealthStatus
  metadata_vsn?: string
  name: string
  readme?: string
  rel_apps: string[]
  rel_vsn: string
  repo?: string
  running_status: PluginsRunningStatus[]
}
