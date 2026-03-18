import http from '@/common/http'
import forge from 'node-forge'

/**
 * Login encryption utilities for EMQX Dashboard.
 *
 * Implements the two-stage encrypted login flow:
 * 1. Key negotiation: generate AES-256 key, encrypt with server RSA public key,
 *    POST to /login/key → receive key_id
 * 2. Encrypted login: encrypt credentials with AES-256-GCM,
 *    POST to /login with text/plain body and x-dashboard-login-key-id header
 *
 * Binary format for the encrypted body / response:
 *   IV (12 bytes) || AuthTag (16 bytes) || Ciphertext → base64
 *
 * Public key resolution order (first non-null wins):
 *   1. window.__EMQX_DASHBOARD_LOGIN_RSA_PUBLIC_KEY__  (server-side injection into index.html)
 *   2. GET /api/v5/login/public_key → { public_key }   (backend derives from private key config)
 *
 * When crypto.subtle is unavailable (HTTP non-secure context), the module
 * automatically falls back to a pure-JS implementation via node-forge.
 */

type LoginCredentials = {
  username: string
  password: string
  mfa_token?: string
}

function isSubtleCryptoAvailable(): boolean {
  return typeof globalThis.crypto?.subtle !== 'undefined'
}

/* ---------- helpers for native Web Crypto path ---------- */

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/* ---------- public API ---------- */

/**
 * Returns the RSA public key PEM string, or null when login encryption is not configured.
 * Result is cached in memory — at most one network request per page load.
 */
export async function getLoginPublicKey(): Promise<string | null> {
  try {
    // Backend derives the RSA public key from the configured private key.
    // Suppress error popups: a 404 just means encryption is disabled.
    const data = await http.get('/login/public_key', {
      doNotTriggerProgress: true,
      errorsHandleCustom: [404],
    } as any)
    const key: string | null = (data as { public_key?: string })?.public_key || null
    return key
  } catch {
    return null
  }
}

export interface EncryptedLoginPrep {
  /** RSA-OAEP-SHA256 encrypted AES key, base64 encoded — send to POST /login/key */
  encryptedAesKey: string
  /** Encrypts the given credentials with AES-256-GCM and returns a base64 string */
  encryptCredentials: (credentials: LoginCredentials) => Promise<string>
  /**
   * Decrypts the base64-encoded encrypted login response using the same AES session key.
   * Expected binary layout: IV(12) || AuthTag(16) || Ciphertext
   */
  decryptResponse: (ciphertext: string) => Promise<unknown>
}

/* ================================================================
 *  Native Web Crypto implementation (HTTPS / localhost)
 * ================================================================ */

async function prepareWithSubtleCrypto(publicKeyPem: string): Promise<EncryptedLoginPrep> {
  const aesKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ])

  const aesKeyRaw = await crypto.subtle.exportKey('raw', aesKey)

  const rsaPublicKey = await crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(publicKeyPem),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt'],
  )

  // Encrypt the AES key with RSA-OAEP
  const encryptedAesKeyRaw = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    rsaPublicKey,
    aesKeyRaw,
  )
  const encryptedAesKey = arrayBufferToBase64(encryptedAesKeyRaw)

  const encryptCredentials = async (credentials: LoginCredentials): Promise<string> => {
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const plaintext = new TextEncoder().encode(JSON.stringify(credentials))

    // Web Crypto AES-GCM output: Ciphertext || AuthTag (last 16 bytes)
    const gcmOutput = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      aesKey,
      plaintext,
    )

    const gcmBytes = new Uint8Array(gcmOutput)
    const tagOffset = gcmBytes.length - 16
    const ciphertext = gcmBytes.slice(0, tagOffset)
    const authTag = gcmBytes.slice(tagOffset)

    // Binary format required by backend: IV(12) || AuthTag(16) || Ciphertext
    const combined = new Uint8Array(12 + 16 + ciphertext.length)
    combined.set(iv, 0)
    combined.set(authTag, 12)
    combined.set(ciphertext, 28)

    return arrayBufferToBase64(combined.buffer)
  }

  const decryptResponse = async (ciphertext: string): Promise<unknown> => {
    const combined = new Uint8Array(
      atob(ciphertext)
        .split('')
        .map((c) => c.charCodeAt(0)),
    )
    const iv = combined.slice(0, 12)
    const authTag = combined.slice(12, 28)
    const ciphertextBytes = combined.slice(28)

    // Web Crypto AES-GCM decrypt expects: Ciphertext || AuthTag
    const ciphertextWithTag = new Uint8Array(ciphertextBytes.length + 16)
    ciphertextWithTag.set(ciphertextBytes, 0)
    ciphertextWithTag.set(authTag, ciphertextBytes.length)

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      aesKey,
      ciphertextWithTag,
    )
    return JSON.parse(new TextDecoder().decode(decrypted))
  }

  return { encryptedAesKey, encryptCredentials, decryptResponse }
}

/* ================================================================
 *  node-forge fallback (HTTP non-secure context)
 * ================================================================ */

function prepareWithForge(publicKeyPem: string): EncryptedLoginPrep {
  // Generate one-time AES-256 key (32 bytes, as a forge binary string)
  const aesKeyBytes = forge.random.getBytesSync(32)

  // Encrypt the AES key with the server's RSA public key (RSA-OAEP, SHA-256)
  const rsaPublicKey = forge.pki.publicKeyFromPem(publicKeyPem)
  const encryptedAesKeyBytes = rsaPublicKey.encrypt(aesKeyBytes, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: { md: forge.md.sha256.create() },
  })
  const encryptedAesKey = forge.util.encode64(encryptedAesKeyBytes)

  const encryptCredentials = async (credentials: LoginCredentials): Promise<string> => {
    const iv = forge.random.getBytesSync(12)
    const plaintext = JSON.stringify(credentials)

    const cipher = forge.cipher.createCipher('AES-GCM', aesKeyBytes)
    cipher.start({ iv, tagLength: 128 })
    cipher.update(forge.util.createBuffer(plaintext, 'utf8'))
    cipher.finish()

    const ciphertext = cipher.output.getBytes()
    const authTag = cipher.mode.tag.getBytes()

    // Binary format: IV(12) || AuthTag(16) || Ciphertext
    return forge.util.encode64(iv + authTag + ciphertext)
  }

  const decryptResponse = async (ciphertextB64: string): Promise<unknown> => {
    const combined = forge.util.decode64(ciphertextB64)
    const iv = combined.substring(0, 12)
    const authTag = combined.substring(12, 28)
    const ciphertextBytes = combined.substring(28)

    const decipher = forge.cipher.createDecipher('AES-GCM', aesKeyBytes)
    decipher.start({
      iv,
      tagLength: 128,
      tag: forge.util.createBuffer(authTag),
    })
    decipher.update(forge.util.createBuffer(ciphertextBytes))
    if (!decipher.finish()) {
      throw new Error('AES-GCM authentication failed')
    }
    return JSON.parse(decipher.output.toString())
  }

  return { encryptedAesKey, encryptCredentials, decryptResponse }
}

/* ---------- entry point ---------- */

/**
 * Prepares materials for an encrypted login:
 * - Generates a one-time AES-256-GCM session key
 * - Encrypts the session key with the server RSA public key (RSA-OAEP-SHA256)
 *
 * Automatically uses native Web Crypto when available (HTTPS / localhost),
 * otherwise falls back to node-forge for HTTP environments.
 *
 * @param publicKeyPem  RSA public key in PEM / SPKI format
 */
export async function prepareEncryptedLogin(publicKeyPem: string): Promise<EncryptedLoginPrep> {
  if (isSubtleCryptoAvailable()) {
    return prepareWithSubtleCrypto(publicKeyPem)
  }
  return prepareWithForge(publicKeyPem)
}
