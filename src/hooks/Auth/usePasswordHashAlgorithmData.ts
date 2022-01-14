import { HashType } from '@/types/enum'

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
    salt_position: 'suffix',
    // when name is bcrypt
    salt_rounds: '',
    // when name is pbkdf2
    mac_fun: '',
    iterations: '',
    dk_length: '',
  },
})

export const getUsefulPasswordHashAlgorithmData = (data: PasswordHashAlgorithm) => {
  const { name, salt_position, salt_rounds, mac_fun, iterations, dk_length } = data
  if (name === HashType.Bcrypt) {
    return { name, salt_position, salt_rounds }
  }
  if (name === HashType.Pbkdf2) {
    return { name, salt_position, mac_fun, iterations, dk_length }
  }
  return { name, salt_position }
}
