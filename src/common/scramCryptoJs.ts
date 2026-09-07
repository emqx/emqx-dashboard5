import type { ScramProof, ScramProofInput } from '@/types/scram'
import CryptoJS from 'crypto-js/core'
import Base64 from 'crypto-js/enc-base64'
import HmacSHA256 from 'crypto-js/hmac-sha256'
import 'crypto-js/lib-typedarrays'
import PBKDF2 from 'crypto-js/pbkdf2'
import SHA256 from 'crypto-js/sha256'
import { prepareScramProof } from './scramCore'

const SCRAM_KEY_WORDS = 8

const xor = (left: CryptoJS.lib.WordArray, right: CryptoJS.lib.WordArray) => {
  if (left.sigBytes !== right.sigBytes) {
    throw new Error('Invalid SCRAM proof length.')
  }
  return CryptoJS.lib.WordArray.create(
    left.words.map((word, index) => word ^ right.words[index]),
    left.sigBytes,
  )
}

export const deriveScramProofWithCryptoJs = (input: ScramProofInput): ScramProof => {
  const prepared = prepareScramProof(input)
  const salt = CryptoJS.lib.WordArray.create(prepared.salt)
  const passwordBytes = PBKDF2(prepared.password, salt, {
    keySize: SCRAM_KEY_WORDS,
    iterations: prepared.iterations,
    hasher: CryptoJS.algo.SHA256,
  })
  const clientKey = HmacSHA256('Client Key', passwordBytes)
  const storedKey = SHA256(clientKey)
  const clientSignature = HmacSHA256(prepared.authMessage, storedKey)
  const serverKey = HmacSHA256('Server Key', passwordBytes)
  const serverSignature = HmacSHA256(prepared.authMessage, serverKey)
  return {
    combinedNonce: prepared.combinedNonce,
    clientProof: xor(clientKey, clientSignature).toString(Base64),
    serverSignature: serverSignature.toString(Base64),
  }
}
