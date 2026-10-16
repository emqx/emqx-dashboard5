import type { AuthenticationUserForm } from '@/types/auth'
import type {
  AuthenticationUserCreateRequest,
  AuthenticationUserUpdateRequest,
} from '@/types/typeAlias'

export interface BuiltinPasswordHash {
  name: string
  salt_position?: string
  salt_rounds?: string | number
  mac_fun?: string
  iterations?: string | number
  dk_length?: string | number
}

export const builtinHashOptions = (): string[] => ['sha256', 'sha512', 'pbkdf2']

export const builtinMacOptions = (): string[] => ['sha224', 'sha256', 'sha384', 'sha512']

export const builtinPbkdf2Iterations = (mac: string): number => (mac === 'sha512' ? 220000 : 600000)

export function createBuiltinHash(generated: boolean, name = 'pbkdf2'): BuiltinPasswordHash {
  if (generated) return { name: 'sha256', salt_position: 'disable' }
  if (name === 'pbkdf2') {
    return {
      name,
      mac_fun: 'sha256',
      iterations: builtinPbkdf2Iterations('sha256'),
      dk_length: '',
    }
  }
  if (name === 'bcrypt') return { name, salt_rounds: 10 }
  return { name, salt_position: name === 'plain' ? 'disable' : 'suffix' }
}

export function resolveBuiltinPasswordMode(config: {
  autogenerate_password?: boolean
  password_hash_algorithm?: unknown
}): boolean {
  // Pre-7.0 configurations carry a hash algorithm but no mode discriminator.
  return config.autogenerate_password ?? !config.password_hash_algorithm
}

export function isBuiltinHashSupported(hash: BuiltinPasswordHash | undefined): boolean {
  return (
    !!hash &&
    builtinHashOptions().includes(hash.name) &&
    (hash.name !== 'pbkdf2' || builtinMacOptions().includes(hash.mac_fun ?? ''))
  )
}

export function normalizeBuiltinPasswordConfig<
  T extends {
    autogenerate_password?: boolean
    password_hash_algorithm?: BuiltinPasswordHash
  },
>(config: T): T {
  const generated = resolveBuiltinPasswordMode(config)
  const result = { ...config, autogenerate_password: generated }
  if (generated) result.password_hash_algorithm = createBuiltinHash(true)
  return result
}

export function createAuthenticationUserBody(
  form: AuthenticationUserForm,
  generated: boolean,
  namespaced: boolean,
  editing: boolean,
): AuthenticationUserCreateRequest | AuthenticationUserUpdateRequest {
  const body: AuthenticationUserUpdateRequest & { user_id?: string } = {}
  if (!editing) {
    body.user_id = form.user_id
    if (form.namespace !== undefined) body.namespace = form.namespace
  }
  if (!generated && (!editing || form.password !== '')) body.password = form.password
  if (!namespaced) body.is_superuser = form.is_superuser
  return body
}
