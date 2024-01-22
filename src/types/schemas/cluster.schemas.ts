export type PutClusterNodeInvite400Code =
  typeof PutClusterNodeInvite400Code[keyof typeof PutClusterNodeInvite400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterNodeInvite400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutClusterNodeInvite400 = {
  code?: PutClusterNodeInvite400Code
  message?: string
}

export type PutClusterNodeInviteAsync400Code =
  typeof PutClusterNodeInviteAsync400Code[keyof typeof PutClusterNodeInviteAsync400Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutClusterNodeInviteAsync400Code = {
  BAD_REQUEST: 'BAD_REQUEST',
} as const

export type PutClusterNodeInviteAsync400 = {
  code?: PutClusterNodeInviteAsync400Code
  message?: string
}

export type DeleteClusterNodeForceLeave404Code =
  typeof DeleteClusterNodeForceLeave404Code[keyof typeof DeleteClusterNodeForceLeave404Code]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const DeleteClusterNodeForceLeave404Code = {
  NOT_FOUND: 'NOT_FOUND',
} as const

export type DeleteClusterNodeForceLeave404 = {
  code?: DeleteClusterNodeForceLeave404Code
  message?: string
}

export type GetCluster200 = {
  name?: string
  nodes?: string[]
  self?: string
}

export interface ClusterTimeout {
  timeout?: number
}

export interface ClusterReplicantInfo {
  node?: string
  streams?: number
}

export type ClusterNodeInvitationSucceedFinishedAt = number | string

export type ClusterNodeInvitationSucceedStartedAt = number | string

export interface ClusterNodeInvitationSucceed {
  node?: string
  started_at?: ClusterNodeInvitationSucceedStartedAt
  finished_at?: ClusterNodeInvitationSucceedFinishedAt
}

export type ClusterNodeInvitationInProgressStartedAt = number | string

export interface ClusterNodeInvitationInProgress {
  node?: string
  started_at?: ClusterNodeInvitationInProgressStartedAt
}

export type ClusterNodeInvitationFailedFinishedAt = number | string

export type ClusterNodeInvitationFailedStartedAt = number | string

export interface ClusterNodeInvitationFailed {
  node?: string
  started_at?: ClusterNodeInvitationFailedStartedAt
  finished_at?: ClusterNodeInvitationFailedFinishedAt
  reason?: string
}

export interface ClusterInvitationStatus {
  succeed?: ClusterNodeInvitationSucceed[]
  in_progress?: ClusterNodeInvitationInProgress[]
  failed?: ClusterNodeInvitationFailed[]
}

export interface ClusterCoreReplicants {
  core_node?: string
  replicant_nodes?: ClusterReplicantInfo[]
}
