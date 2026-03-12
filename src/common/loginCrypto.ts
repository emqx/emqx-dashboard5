import http from '@/common/http'

/**
 * Login encryption utilities for EMQX Dashboard.
 *
 * Implements the two-stage encrypted login flow:
 * 1. Key negotiation: generate AES-256 key, encrypt with server RSA public key,
 *    POST to /login/key → receive key_id
 * 2. Encrypted login: encrypt credentials with AES-256-GCM,
 *    POST to /login with text/plain body and x-dashboard-login-key-id header
 *
 * Binary format for the encrypted body:
 *   IV (12 bytes) || AuthTag (16 bytes) || Ciphertext → base64
 *
 * Public key resolution order (first non-null wins):
 *   1. window.__EMQX_DASHBOARD_LOGIN_RSA_PUBLIC_KEY__  (server-side injection into index.html)
 *   2. GET /api/v5/login/public-key                    (dedicated API endpoint, recommended)
 *   3. GET /dashboard.config.json → .login_rsa_public_key  (static config file)
 */

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

/**
 * Returns the configured RSA public key PEM string, or null if not configured.
 * The public key can be injected by setting window.__EMQX_DASHBOARD_LOGIN_RSA_PUBLIC_KEY__
 * before the app starts (e.g. via index.html or server-side templating).
 */
export async function getLoginPublicKey(): Promise<string | null> {
  return http.get('/dashboard_login_public.pem', { baseURL: '' })
}

export interface EncryptedLoginPrep {
  /** RSA-OAEP-SHA256 encrypted AES key, base64 encoded — send to POST /login/key */
  encryptedAesKey: string
  /** Encrypts the given credentials with AES-256-GCM and returns a base64 string */
  encryptCredentials: (credentials: {
    username: string
    password: string
    mfa_token?: string
  }) => Promise<string>
  /**
   * Decrypts the base64-encoded encrypted login response using the same AES session key.
   * Expected binary layout: IV(12) || AuthTag(16) || Ciphertext
   */
  decryptResponse: (ciphertext: string) => Promise<unknown>
}

/**
 * Prepares materials for an encrypted login:
 * - Generates a one-time AES-256-GCM session key
 * - Encrypts the session key with the server RSA public key (RSA-OAEP-SHA256)
 *
 * @param publicKeyPem  RSA public key in PEM / SPKI format
 */
export async function prepareEncryptedLogin(publicKeyPem: string): Promise<EncryptedLoginPrep> {
  // Generate one-time AES-256-GCM session key (used for both request and response)
  const aesKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ])

  // Export raw key bytes for RSA encryption
  const aesKeyRaw = await crypto.subtle.exportKey('raw', aesKey)

  // Import RSA public key
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

  const encryptCredentials = async (credentials: {
    username: string
    password: string
    mfa_token?: string
  }): Promise<string> => {
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
