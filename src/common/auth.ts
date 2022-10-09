import { createRandomString, parseJSONSafely, stringifyObjSafely } from './tools'
import AES from 'crypto-js/aes'
import encUTF8 from 'crypto-js/enc-utf8'
import { UserInfo } from '@/types/common'

/**
 * key for set/get local storage
 */
const USER_INFO_KEY = 'uK'
const ENCRYPTION_KEY = 'eK'

const getUserInfoKey = () => {
  return localStorage.getItem(USER_INFO_KEY)
}

const setUserInfoKey = () => {
  const uk = createRandomString(8)
  localStorage.setItem(USER_INFO_KEY, uk)
  return uk
}

const getEncryptionKey = () => {
  return localStorage.getItem(ENCRYPTION_KEY)
}

const setEncryptionKey = () => {
  const ek = createRandomString(10)
  localStorage.setItem(ENCRYPTION_KEY, ek)
  return ek
}

const encryptSafely = (str: string, key: string) => {
  try {
    return AES.encrypt(str, key)
  } catch (error) {
    console.error(error)
    return str
  }
}

const decryptSafely = (str: string, key: string) => {
  try {
    const bytes = AES.decrypt(str, key)
    return bytes.toString(encUTF8)
  } catch (error) {
    console.error(error)
    return str
  }
}

/**
 * 1. generate uk
 * 2. generate ek
 * 3. set user info
 */
export const setUser = (user: UserInfo): void => {
  const uk = setUserInfoKey()
  const ek = setEncryptionKey()
  const userInfo = encryptSafely(stringifyObjSafely(user), ek)
  localStorage.setItem(uk, userInfo as string)
}

export const getUser = (): undefined | UserInfo => {
  const uk = getUserInfoKey()
  const ek = getEncryptionKey()
  if (!uk || !ek) {
    return
  }
  const user = localStorage.getItem(uk)
  if (!user) {
    return
  }
  const userInfoStr = decryptSafely(user, ek) as string
  const userInfo = parseJSONSafely(userInfoStr) as UserInfo
  return userInfo
}

export const removeUser = (): void => {
  const uk = getUserInfoKey()
  if (!uk) {
    return
  }
  localStorage.removeItem(uk)
  localStorage.removeItem(USER_INFO_KEY)
  localStorage.removeItem(ENCRYPTION_KEY)
}
