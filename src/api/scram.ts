import http from '@/common/http'
import {
  createScramClientNonce,
  deriveScramProof,
  ScramLoginError,
  verifyScramServerSignature,
} from '@/common/scram'
import type {
  ScramChallenge,
  ScramChallengeRequest,
  ScramLoginResponse,
  ScramVerifyRequest,
} from '@/types/typeAlias'

interface LoginCredentials {
  password: string
  username: string
  mfa_token?: string
}

export const requestScramChallenge = (
  username: string,
  clientNonce: string,
): Promise<ScramChallenge> => {
  const request: ScramChallengeRequest = { username, client_nonce: clientNonce }
  return http.post('/login/challenge', request, { keepSpaces: true })
}

export const requestScramVerification = (
  request: ScramVerifyRequest,
): Promise<ScramLoginResponse> => http.post('/login/verify', request)

export const scramLogin = async (credentials: LoginCredentials): Promise<ScramLoginResponse> => {
  const { username, password } = credentials
  const mfaToken = credentials.mfa_token || undefined
  const clientNonce = createScramClientNonce()
  const challenge = await requestScramChallenge(username, clientNonce)

  const proof = await deriveScramProof({ username, password, clientNonce, challenge })
  const response = await requestScramVerification({
    challenge_id: challenge.challenge_id,
    combined_nonce: proof.combinedNonce,
    client_proof: proof.clientProof,
    ...(mfaToken ? { mfa_token: mfaToken } : {}),
  })
  if (!response.token || !response.server_signature) {
    throw new ScramLoginError('The SCRAM login response is incomplete.')
  }
  if (!verifyScramServerSignature(response.server_signature, proof.serverSignature)) {
    throw new ScramLoginError('SCRAM server verification failed.')
  }
  return response
}
