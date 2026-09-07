import type { ScramProof, ScramProofInput } from '@/types/scram'
import CryptoJS from 'crypto-js'
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
  const salt = CryptoJS.enc.Base64.parse(prepared.saltBase64)
  const passwordBytes = CryptoJS.PBKDF2(prepared.password, salt, {
    keySize: SCRAM_KEY_WORDS,
    iterations: prepared.iterations,
    hasher: CryptoJS.algo.SHA256,
  })
  const clientKey = CryptoJS.HmacSHA256('Client Key', passwordBytes)
  const storedKey = CryptoJS.SHA256(clientKey)
  const clientSignature = CryptoJS.HmacSHA256(prepared.authMessage, storedKey)
  const serverKey = CryptoJS.HmacSHA256('Server Key', passwordBytes)
  const serverSignature = CryptoJS.HmacSHA256(prepared.authMessage, serverKey)
  return {
    combinedNonce: prepared.combinedNonce,
    clientProof: xor(clientKey, clientSignature).toString(CryptoJS.enc.Base64),
    serverSignature: serverSignature.toString(CryptoJS.enc.Base64),
  }
}
