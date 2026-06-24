export type PostOpentelemetryWhitelistType500Code =
  (typeof PostOpentelemetryWhitelistType500Code)[keyof typeof PostOpentelemetryWhitelistType500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostOpentelemetryWhitelistType500Code = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type PostOpentelemetryWhitelistType500 = {
  code?: PostOpentelemetryWhitelistType500Code
  message?: string
}

export type DeleteOpentelemetryWhitelistType500Code =
  (typeof DeleteOpentelemetryWhitelistType500Code)[keyof typeof DeleteOpentelemetryWhitelistType500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteOpentelemetryWhitelistType500Code = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type DeleteOpentelemetryWhitelistType500 = {
  code?: DeleteOpentelemetryWhitelistType500Code
  message?: string
}
