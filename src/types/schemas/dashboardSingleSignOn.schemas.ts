export type PostSsoMfaVerify401Code =
  (typeof PostSsoMfaVerify401Code)[keyof typeof PostSsoMfaVerify401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoMfaVerify401Code = {
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const

export type PostSsoMfaVerify401 = {
  code?: PostSsoMfaVerify401Code
  message?: string
}

export type PostSsoMfaVerify400Code =
  (typeof PostSsoMfaVerify400Code)[keyof typeof PostSsoMfaVerify400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoMfaVerify400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostSsoMfaVerify400 = {
  code?: PostSsoMfaVerify400Code
  message?: string
}

export type PostSsoMfaSetupInfo401Code =
  (typeof PostSsoMfaSetupInfo401Code)[keyof typeof PostSsoMfaSetupInfo401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoMfaSetupInfo401Code = {
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const

export type PostSsoMfaSetupInfo401 = {
  code?: PostSsoMfaSetupInfo401Code
  message?: string
}

export type PostSsoMfaSetup401Code =
  (typeof PostSsoMfaSetup401Code)[keyof typeof PostSsoMfaSetup401Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoMfaSetup401Code = {
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const

export type PostSsoMfaSetup401 = {
  code?: PostSsoMfaSetup401Code
  message?: string
}

export type PostSsoMfaSetup400Code =
  (typeof PostSsoMfaSetup400Code)[keyof typeof PostSsoMfaSetup400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostSsoMfaSetup400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostSsoMfaSetup400 = {
  code?: PostSsoMfaSetup400Code
  message?: string
}

export type DashboardSsoLoginSuccessResponseLicenseEdition =
  (typeof DashboardSsoLoginSuccessResponseLicenseEdition)[keyof typeof DashboardSsoLoginSuccessResponseLicenseEdition]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DashboardSsoLoginSuccessResponseLicenseEdition = {
  enterprise: 'enterprise',
  opensource: 'opensource',
} as const

export type DashboardSsoLoginSuccessResponseLicense = {
  edition?: DashboardSsoLoginSuccessResponseLicenseEdition
}

export interface DashboardSsoLoginSuccessResponse {
  backend?: string
  license?: DashboardSsoLoginSuccessResponseLicense
  role?: string
  token?: string
  username?: string
  version?: string
}

export interface DashboardSsoMfaMfaVerifyRequest {
  backend: string
  totp_code: string
  username: string
  verify_token: string
}

export interface DashboardSsoMfaMfaSetupRequest {
  backend: string
  setup_token: string
  totp_code: string
  username: string
}

export interface DashboardSsoMfaMfaSetupInfoResponse {
  mechanism: string
  secret: string
}

export interface DashboardSsoMfaMfaSetupInfoRequest {
  backend: string
  setup_token: string
  username: string
}
