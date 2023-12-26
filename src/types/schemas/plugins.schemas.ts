export type PostPluginsInstall400Code =
  typeof PostPluginsInstall400Code[keyof typeof PostPluginsInstall400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostPluginsInstall400Code = {
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  ALREADY_INSTALLED: 'ALREADY_INSTALLED',
  BAD_PLUGIN_INFO: 'BAD_PLUGIN_INFO',
} as const

export type PostPluginsInstall400 = {
  code?: PostPluginsInstall400Code
  message?: string
}

export type PostPluginsInstallBody = {
  plugin?: Blob
}

export type PostPluginsNameMove400Code =
  typeof PostPluginsNameMove400Code[keyof typeof PostPluginsNameMove400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostPluginsNameMove400Code = {
  MOVE_FAILED: 'MOVE_FAILED',
} as const

export type PostPluginsNameMove400 = {
  code?: PostPluginsNameMove400Code
  message?: string
}

export type PutPluginsNameAction404Code =
  typeof PutPluginsNameAction404Code[keyof typeof PutPluginsNameAction404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutPluginsNameAction404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type PutPluginsNameAction404 = {
  code?: PutPluginsNameAction404Code
  message?: string
}

export type DeletePluginsName404Code =
  typeof DeletePluginsName404Code[keyof typeof DeletePluginsName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeletePluginsName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeletePluginsName404 = {
  code?: DeletePluginsName404Code
  message?: string
}

export type DeletePluginsName400Code =
  typeof DeletePluginsName400Code[keyof typeof DeletePluginsName400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeletePluginsName400Code = {
  PARAM_ERROR: 'PARAM_ERROR',
} as const

export type DeletePluginsName400 = {
  code?: DeletePluginsName400Code
  message?: string
}

export type GetPluginsName404Code = typeof GetPluginsName404Code[keyof typeof GetPluginsName404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetPluginsName404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetPluginsName404 = {
  code?: GetPluginsName404Code
  message?: string
}

export type PluginsRunningStatusStatus =
  typeof PluginsRunningStatusStatus[keyof typeof PluginsRunningStatusStatus]

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

export type PluginsPluginCompatibility = { [key: string]: any }

export interface PluginsBuilder {
  contact?: string
  name?: string
  website?: string
}

export interface PluginsPlugin {
  name: string
  author?: string[]
  builder?: PluginsBuilder
  built_on_otp_release?: string
  compatibility?: PluginsPluginCompatibility
  git_commit_or_build_date?: string
  functionality?: string[]
  git_ref?: string
  metadata_vsn?: string
  rel_vsn: string
  rel_apps: string[]
  repo?: string
  description: string
  running_status: PluginsRunningStatus[]
  readme?: string
}
