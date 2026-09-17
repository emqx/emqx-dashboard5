import type { ScramProof, ScramProofInput } from '@/types/scram'
import { createHMAC, createSHA256, pbkdf2 } from 'hash-wasm'
import { bytesToBase64, prepareScramProof, ScramLoginError } from './scramCore'

const SCRAM_KEY_BYTES = 32

const hmac = async (key: Uint8Array, value: string): Promise<Uint8Array> => {
  const hash = await createHMAC(createSHA256(), key)
  return hash.init().update(value).digest('binary')
}

const xor = (left: Uint8Array, right: Uint8Array): Uint8Array => {
  if (left.length !== right.length) {
    throw new ScramLoginError('Invalid SCRAM proof length.')
  }
  return Uint8Array.from(left, (byte, index) => byte ^ right[index])
}

export const deriveScramProofWithWasm = async (input: ScramProofInput): Promise<ScramProof> => {
  const prepared = prepareScramProof(input)
  const passwordBytes = await pbkdf2({
    password: prepared.password,
    salt: prepared.salt,
    hashLength: SCRAM_KEY_BYTES,
    iterations: prepared.iterations,
    hashFunction: createSHA256(),
    outputType: 'binary',
  })
  const clientKey = await hmac(passwordBytes, 'Client Key')
  const hash = await createSHA256()
  const storedKey = hash.init().update(clientKey).digest('binary')
  const clientSignature = await hmac(storedKey, prepared.authMessage)
  const serverKey = await hmac(passwordBytes, 'Server Key')
  const serverSignature = await hmac(serverKey, prepared.authMessage)
  return {
    combinedNonce: prepared.combinedNonce,
    clientProof: bytesToBase64(xor(clientKey, clientSignature)),
    serverSignature: bytesToBase64(serverSignature),
  }
}
