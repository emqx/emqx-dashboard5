import { decode } from 'js-base64'

export const USER_INFO_KEY = 'login_meta'
export default (): {
  getUserInfoFromQuery: () => any | undefined
} => {
  const getUserInfoFromQuery = () => {
    try {
      const base64Str = getValueFromQuery(USER_INFO_KEY)
      if (!base64Str) {
        return
      }
      const jsonStr = decode(base64Str)
      const infoObj = JSON.parse(jsonStr)
      return infoObj
    } catch (error) {
      console.error(error)
      return
    }
  }

  return {
    getUserInfoFromQuery,
  }
}
