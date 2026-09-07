import type { ScramChallenge } from './typeAlias'

export const SCRAM_SHA_256 = 'SCRAM-SHA-256' as const

export interface ScramProofInput {
  username: string
  password: string
  clientNonce: string
  challenge: ScramChallenge
}

export interface ScramProof {
  combinedNonce: string
  clientProof: string
  serverSignature: string
}

export interface ScramWorkerResponse {
  result?: ScramProof
  error?: string
}
