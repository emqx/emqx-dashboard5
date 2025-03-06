export type DeleteBannedAsWho404Code =
  (typeof DeleteBannedAsWho404Code)[keyof typeof DeleteBannedAsWho404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteBannedAsWho404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteBannedAsWho404 = {
  code?: DeleteBannedAsWho404Code
  message?: string
}

export type PostBanned400Code = (typeof PostBanned400Code)[keyof typeof PostBanned400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostBanned400Code = {
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostBanned400 = {
  code?: PostBanned400Code
  message?: string
}

export type PostBanned200 = {
  data?: EmqxMgmtApiBannedBan[]
}

export type GetBanned400Code = (typeof GetBanned400Code)[keyof typeof GetBanned400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetBanned400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type GetBanned400 = {
  code?: GetBanned400Code
  message?: string
}

export type GetBanned200 = {
  data?: EmqxMgmtApiBannedBan[]
  meta?: PublicMeta
}

export type PublicPageParameter = number

export type PublicLimitParameter = number

export type GetBannedParams = {
  page?: PublicPageParameter
  limit?: PublicLimitParameter
  clientid?: string
  username?: string
  peerhost?: string
  like_clientid?: string
  like_username?: string
  like_peerhost?: string
  like_peerhost_net?: string
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

export type EmqxMgmtApiBannedBanUntilOneOf = number | string

export type EmqxMgmtApiBannedBanUntil = EmqxMgmtApiBannedBanUntilOneOf | 'infinity'

export type EmqxMgmtApiBannedBanAt = number | string

export type EmqxMgmtApiBannedBanAs =
  (typeof EmqxMgmtApiBannedBanAs)[keyof typeof EmqxMgmtApiBannedBanAs]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EmqxMgmtApiBannedBanAs = {
  clientid: 'clientid',
  username: 'username',
  peerhost: 'peerhost',
  clientid_re: 'clientid_re',
  username_re: 'username_re',
  peerhost_net: 'peerhost_net',
} as const

export interface EmqxMgmtApiBannedBan {
  as: EmqxMgmtApiBannedBanAs
  at?: EmqxMgmtApiBannedBanAt
  by?: string
  reason?: string
  until?: EmqxMgmtApiBannedBanUntil
  who: string
}
