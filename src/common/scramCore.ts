import type { ScramProofInput } from '@/types/scram'
import type { ScramChallenge } from '@/types/typeAlias'
import { SCRAM_SHA_256 } from '@/types/scram'

const SCRAM_SALT_BYTES = 16
const MIN_ITERATIONS = 4096
const MAX_ITERATIONS = 10_000_000
const MIN_NONCE_LENGTH = 20
const MAX_NONCE_LENGTH = 128
const MAX_COMBINED_NONCE_LENGTH = 160
const NONCE_PATTERN = /^[A-Za-z0-9_-]+$/

export class ScramLoginError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ScramLoginError'
  }
}

export const base64ToBytes = (value: string): Uint8Array => {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    const decoded = atob(padded)
    return Uint8Array.from(decoded, (char) => char.charCodeAt(0))
  } catch {
    throw new ScramLoginError('Invalid Base64 value in SCRAM response.')
  }
}

export const bytesToBase64 = (value: Uint8Array): string => {
  let binary = ''
  for (const byte of value) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

const isValidNonce = (value: string, maxLength: number) =>
  value.length >= MIN_NONCE_LENGTH && value.length <= maxLength && NONCE_PATTERN.test(value)

type CompleteScramChallenge = Required<ScramChallenge>

const validateChallenge: (
  clientNonce: string,
  challenge: ScramChallenge,
) => asserts challenge is CompleteScramChallenge = (clientNonce, challenge) => {
  if (challenge.mechanism !== SCRAM_SHA_256) {
    throw new ScramLoginError('Unsupported SCRAM mechanism.')
  }
  if (!isValidNonce(clientNonce, MAX_NONCE_LENGTH)) {
    throw new ScramLoginError('Invalid SCRAM client nonce.')
  }
  if (!isValidNonce(challenge.challenge_id, MAX_NONCE_LENGTH)) {
    throw new ScramLoginError('Invalid SCRAM challenge identifier.')
  }
  if (
    typeof challenge.server_nonce !== 'string' ||
    challenge.server_nonce.length === 0 ||
    challenge.server_nonce.length > MAX_NONCE_LENGTH
  ) {
    throw new ScramLoginError('Invalid SCRAM server nonce.')
  }
  if (
    typeof challenge.iterations !== 'number' ||
    !Number.isInteger(challenge.iterations) ||
    challenge.iterations < MIN_ITERATIONS ||
    challenge.iterations > MAX_ITERATIONS
  ) {
    throw new ScramLoginError('Invalid SCRAM iteration count.')
  }
  if (
    typeof challenge.salt !== 'string' ||
    base64ToBytes(challenge.salt).length !== SCRAM_SALT_BYTES
  ) {
    throw new ScramLoginError('Invalid SCRAM salt.')
  }
  if (clientNonce.length + challenge.server_nonce.length > MAX_COMBINED_NONCE_LENGTH) {
    throw new ScramLoginError('Invalid SCRAM combined nonce.')
  }
}

const escapeScramUsername = (username: string) => username.replace(/=/g, '=3D').replace(/,/g, '=2C')

export const prepareScramProof = ({
  username,
  password,
  clientNonce,
  challenge,
}: ScramProofInput) => {
  validateChallenge(clientNonce, challenge)
  const combinedNonce = clientNonce + challenge.server_nonce
  const escapedUsername = escapeScramUsername(username)
  const authMessage =
    `n=${escapedUsername},r=${clientNonce}` +
    `,r=${combinedNonce},s=${challenge.salt},i=${challenge.iterations}` +
    `,c=biws,r=${combinedNonce}`
  return {
    password,
    salt: base64ToBytes(challenge.salt),
    saltBase64: challenge.salt,
    iterations: challenge.iterations,
    combinedNonce,
    authMessage,
  }
}
