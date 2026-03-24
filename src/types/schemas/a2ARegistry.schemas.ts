export type GetA2aCardsList503Code =
  (typeof GetA2aCardsList503Code)[keyof typeof GetA2aCardsList503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetA2aCardsList503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetA2aCardsList503 = {
  code?: GetA2aCardsList503Code
  message?: string
}

export type GetA2aCardsListParams = {
  org_id?: string
  unit_id?: string
  agent_id?: string
}

export type PostA2aCardsCardOrgIdUnitIdAgentId503Code =
  (typeof PostA2aCardsCardOrgIdUnitIdAgentId503Code)[keyof typeof PostA2aCardsCardOrgIdUnitIdAgentId503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostA2aCardsCardOrgIdUnitIdAgentId503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type PostA2aCardsCardOrgIdUnitIdAgentId503 = {
  code?: PostA2aCardsCardOrgIdUnitIdAgentId503Code
  message?: string
}

export type PostA2aCardsCardOrgIdUnitIdAgentId500Code =
  (typeof PostA2aCardsCardOrgIdUnitIdAgentId500Code)[keyof typeof PostA2aCardsCardOrgIdUnitIdAgentId500Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostA2aCardsCardOrgIdUnitIdAgentId500Code = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

export type PostA2aCardsCardOrgIdUnitIdAgentId500 = {
  code?: PostA2aCardsCardOrgIdUnitIdAgentId500Code
  message?: string
}

export type PostA2aCardsCardOrgIdUnitIdAgentId400Code =
  (typeof PostA2aCardsCardOrgIdUnitIdAgentId400Code)[keyof typeof PostA2aCardsCardOrgIdUnitIdAgentId400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostA2aCardsCardOrgIdUnitIdAgentId400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PostA2aCardsCardOrgIdUnitIdAgentId400 = {
  code?: PostA2aCardsCardOrgIdUnitIdAgentId400Code
  message?: string
}

export type GetA2aCardsCardOrgIdUnitIdAgentId503Code =
  (typeof GetA2aCardsCardOrgIdUnitIdAgentId503Code)[keyof typeof GetA2aCardsCardOrgIdUnitIdAgentId503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetA2aCardsCardOrgIdUnitIdAgentId503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type GetA2aCardsCardOrgIdUnitIdAgentId503 = {
  code?: GetA2aCardsCardOrgIdUnitIdAgentId503Code
  message?: string
}

export type GetA2aCardsCardOrgIdUnitIdAgentId404Code =
  (typeof GetA2aCardsCardOrgIdUnitIdAgentId404Code)[keyof typeof GetA2aCardsCardOrgIdUnitIdAgentId404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetA2aCardsCardOrgIdUnitIdAgentId404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type GetA2aCardsCardOrgIdUnitIdAgentId404 = {
  code?: GetA2aCardsCardOrgIdUnitIdAgentId404Code
  message?: string
}

export type DeleteA2aCardsCardOrgIdUnitIdAgentId503Code =
  (typeof DeleteA2aCardsCardOrgIdUnitIdAgentId503Code)[keyof typeof DeleteA2aCardsCardOrgIdUnitIdAgentId503Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteA2aCardsCardOrgIdUnitIdAgentId503Code = {
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const

export type DeleteA2aCardsCardOrgIdUnitIdAgentId503 = {
  code?: DeleteA2aCardsCardOrgIdUnitIdAgentId503Code
  message?: string
}

export interface A2aRegisterCardIn {
  card: string
}

export type A2aCardOutStatus = (typeof A2aCardOutStatus)[keyof typeof A2aCardOutStatus]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const A2aCardOutStatus = {
  offline: 'offline',
  online: 'online',
} as const

export interface A2aCardOut {
  description?: string
  name?: string
  raw?: string
  status?: A2aCardOutStatus
  version?: string
}
