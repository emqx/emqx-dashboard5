import http from '@/common/http'
import {
  createScramClientNonce,
  deriveScramProof,
  verifyScramServerSignature,
} from '@/common/scram'
import { ScramLoginError } from '@/common/scramCore'
import type { ScramLoginCredentials } from '@/types/scram'
import type {
  ScramChallenge,
  ScramChallengeRequest,
  ScramLoginResponse,
  ScramVerifyRequest,
} from '@/types/typeAlias'

const requestScramChallenge = (username: string, clientNonce: string): Promise<ScramChallenge> => {
  const request: ScramChallengeRequest = { username, client_nonce: clientNonce }
  return http.post('/login/challenge', request)
}

const requestScramVerification = (request: ScramVerifyRequest): Promise<ScramLoginResponse> =>
  http.post('/login/verify', request)

export const scramLogin = async (
  credentials: ScramLoginCredentials,
): Promise<ScramLoginResponse> => {
  const { username, password } = credentials
  const clientNonce = createScramClientNonce()
  const challenge = await requestScramChallenge(username, clientNonce)

  const proof = await deriveScramProof({ username, password, clientNonce, challenge })
  const response = await requestScramVerification({
    challenge_id: challenge.challenge_id,
    combined_nonce: proof.combinedNonce,
    client_proof: proof.clientProof,
    ...(credentials.mfa_token ? { mfa_token: credentials.mfa_token } : {}),
  })
  if (!response.token || !response.server_signature) {
    throw new ScramLoginError('The SCRAM login response is incomplete.')
  }
  if (!verifyScramServerSignature(response.server_signature, proof.serverSignature)) {
    throw new ScramLoginError('SCRAM server verification failed.')
  }
  return response
}
