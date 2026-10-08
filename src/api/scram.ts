import http from '@/common/http'
import { NAME_PWD_ERROR } from '@/common/customErrorCode'
import { isAxiosError } from 'axios'
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
  LoginResponse,
} from '@/types/typeAlias'

const requestScramChallenge = (username: string, clientNonce: string): Promise<ScramChallenge> => {
  const request: ScramChallengeRequest = { username, client_nonce: clientNonce }
  return http.post('/login/challenge', request)
}

const requestScramVerification = (request: ScramVerifyRequest): Promise<ScramLoginResponse> =>
  http.post('/login/verify', request, {
    errorsHandleCustomByCode: [{ status: 401, code: NAME_PWD_ERROR }],
  })

export const loginWithPasswordFallback = async (
  credentials: ScramLoginCredentials,
): Promise<LoginResponse> => {
  try {
    return await scramLogin(credentials)
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      error.response.data?.code === NAME_PWD_ERROR
    ) {
      // Legacy password hashes cannot produce a SCRAM verifier. Let the final
      // password-login result drive notifications, MFA and lockout handling.
      return http.post('/login', credentials)
    }
    throw error
  }
}

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
