import type { ScramProof, ScramProofInput, ScramWorkerResponse } from '@/types/scram'
import { base64ToBytes, bytesToBase64, prepareScramProof, ScramLoginError } from './scramCore'

export { base64ToBytes, bytesToBase64, prepareScramProof, ScramLoginError } from './scramCore'

const SCRAM_KEY_BYTES = 32
const SCRAM_NONCE_BYTES = 24
const CRYPTO_JS_TIMEOUT = 55_000

const utf8 = (value: string) => new TextEncoder().encode(value)

const bytesToBase64Url = (value: Uint8Array): string =>
  bytesToBase64(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')

export const createScramClientNonce = (): string => {
  if (!globalThis.crypto?.getRandomValues) {
    throw new ScramLoginError('This browser does not provide a secure random source.')
  }
  return bytesToBase64Url(globalThis.crypto.getRandomValues(new Uint8Array(SCRAM_NONCE_BYTES)))
}

const hmac = async (key: Uint8Array, value: Uint8Array): Promise<Uint8Array> => {
  const cryptoKey = await globalThis.crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return new Uint8Array(await globalThis.crypto.subtle.sign('HMAC', cryptoKey, value))
}

const sha256 = async (value: Uint8Array): Promise<Uint8Array> =>
  new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', value))

const saltedPassword = async (
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> => {
  const cryptoKey = await globalThis.crypto.subtle.importKey(
    'raw',
    utf8(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await globalThis.crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    cryptoKey,
    SCRAM_KEY_BYTES * 8,
  )
  return new Uint8Array(bits)
}

const xor = (left: Uint8Array, right: Uint8Array): Uint8Array => {
  if (left.length !== right.length) {
    throw new ScramLoginError('Invalid SCRAM proof length.')
  }
  return Uint8Array.from(left, (byte, index) => byte ^ right[index])
}

export const deriveScramProofWithWebCrypto = async (
  input: ScramProofInput,
): Promise<ScramProof> => {
  if (!globalThis.crypto?.subtle) {
    throw new ScramLoginError('Web Crypto is unavailable.')
  }
  const prepared = prepareScramProof(input)
  const passwordBytes = await saltedPassword(prepared.password, prepared.salt, prepared.iterations)
  const clientKey = await hmac(passwordBytes, utf8('Client Key'))
  const storedKey = await sha256(clientKey)
  const clientSignature = await hmac(storedKey, utf8(prepared.authMessage))
  const serverKey = await hmac(passwordBytes, utf8('Server Key'))
  const serverSignature = await hmac(serverKey, utf8(prepared.authMessage))
  return {
    combinedNonce: prepared.combinedNonce,
    clientProof: bytesToBase64(xor(clientKey, clientSignature)),
    serverSignature: bytesToBase64(serverSignature),
  }
}

export const canUseWebCrypto = (): boolean =>
  globalThis.isSecureContext === true && !!globalThis.crypto?.subtle

const deriveScramProofWithCryptoJsWorker = (input: ScramProofInput): Promise<ScramProof> => {
  if (typeof Worker === 'undefined') {
    return Promise.reject(new ScramLoginError('Web Workers are unavailable.'))
  }
  return new Promise((resolve, reject) => {
    let worker: Worker
    try {
      worker = new Worker(new URL('./scramCryptoJs.worker.ts', import.meta.url), { type: 'module' })
    } catch (error) {
      reject(
        new ScramLoginError(
          error instanceof Error ? error.message : 'Unable to start SCRAM worker.',
        ),
      )
      return
    }

    const timer = window.setTimeout(() => {
      worker.terminate()
      reject(new ScramLoginError('SCRAM password derivation timed out.'))
    }, CRYPTO_JS_TIMEOUT)
    const finish = () => {
      window.clearTimeout(timer)
      worker.terminate()
    }

    worker.onmessage = ({ data }: MessageEvent<ScramWorkerResponse>) => {
      finish()
      if (data.result) {
        resolve(data.result)
      } else {
        reject(new ScramLoginError(data.error || 'SCRAM password derivation failed.'))
      }
    }
    worker.onerror = (event) => {
      finish()
      reject(new ScramLoginError(event.message || 'SCRAM password derivation failed.'))
    }
    worker.postMessage(input)
  })
}

export const deriveScramProof = (input: ScramProofInput): Promise<ScramProof> =>
  canUseWebCrypto()
    ? deriveScramProofWithWebCrypto(input)
    : deriveScramProofWithCryptoJsWorker(input)

const equalBytes = (left: Uint8Array, right: Uint8Array): boolean => {
  if (left.length !== right.length) {
    return false
  }
  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index]
  }
  return difference === 0
}

export const verifyScramServerSignature = (actual: string, expected: string): boolean => {
  try {
    return equalBytes(base64ToBytes(actual), base64ToBytes(expected))
  } catch {
    return false
  }
}
