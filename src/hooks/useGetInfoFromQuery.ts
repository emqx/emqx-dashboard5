import { decode } from 'js-base64'

const getDataFromParams = (params: string): Record<string, string> => {
  const str = params
  if (URLSearchParams) {
    const ret: Record<string, string> = {}
    for (const [key, value] of new URLSearchParams(str).entries()) {
      ret[key] = value
    }
    return ret
  } else {
    return str.split('&').reduce((ret: Record<string, string>, curr) => {
      const pair = curr.split('=')
      ret[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
      return ret
    }, {})
  }
}

const getQueryInHash = (hash: string) => hash.slice(1).split('?')[1]

const INFO_KEY = 'login_meta'
export default (): {
  getInfoFromQuery: () => any | undefined
} => {
  const getInfoFromQuery = () => {
    try {
      let info: Record<string, string> = {}
      if (location.search) {
        info = getDataFromParams(location.search.slice(1))
      } else if (location.hash) {
        info = getDataFromParams(getQueryInHash(location.hash))
      }
      const base64Str = info[INFO_KEY]
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
    getInfoFromQuery,
  }
}
