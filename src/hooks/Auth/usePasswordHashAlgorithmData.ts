import { DEFAULT_SALT_POSITION } from '@/common/constants'
import { HashType } from '@/types/enum'
import useFormRules from '../useFormRules'
import useI18nTl from '../useI18nTl'
import { FormRules } from '@/types/common'

interface PasswordHashAlgorithm {
  name: string
  salt_position: string
  salt_rounds: string
  mac_fun: number | string
  iterations: number | string
  dk_length: string | string
}

export const getPasswordHashAlgorithmObj = (): {
  password_hash_algorithm: PasswordHashAlgorithm
} => ({
  password_hash_algorithm: {
    name: HashType.SHA256,
    salt_position: DEFAULT_SALT_POSITION,
    // when name is bcrypt
    salt_rounds: '10',
    // when name is pbkdf2
    mac_fun: 'sha256',
    iterations: 4096,
    dk_length: '',
  },
})

export const getUsefulPasswordHashAlgorithmData = (
  data: PasswordHashAlgorithm,
  isBuiltInDatabase = false,
) => {
  const { name, salt_position, salt_rounds, mac_fun, iterations, dk_length } = data
  if (name === HashType.Bcrypt) {
    if (isBuiltInDatabase) {
      return { name, salt_rounds }
    }
    return { name }
  }
  if (name === HashType.Pbkdf2) {
    return { name, mac_fun, iterations, dk_length }
  }
  return { name, salt_position }
}

export const usePasswordHashRules = (): {
  passwordHashRules: FormRules
} => {
  const { tl } = useI18nTl('Auth')
  const { createRequiredRule } = useFormRules()
  const passwordHashRules: FormRules = {
    'password_hash_algorithm.salt_rounds': createRequiredRule('Salt Rounds'),
    'password_hash_algorithm.iterations': createRequiredRule(tl('iterationCount')),
    'password_hash_algorithm.mac_fun': createRequiredRule(tl('pseudorandomFunction')),
  }

  return {
    passwordHashRules,
  }
}
