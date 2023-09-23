import { decode } from 'js-base64'

const getDataFromParams = (params: string) => {
  const str = params.slice(1)
  if (URLSearchParams) {
    const ret: Record<string, string> = {}
    for (const [key, value] of new URLSearchParams(str).entries()) {
      ret[key] = value
    }
    return ret
  } else {
    str.split('&').reduce((ret: Record<string, string>, curr) => {
      const pair = curr.split('=')
      ret[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
      return ret
    }, {})
  }
}

const INFO_KEY = 'login_meta'
export default (): {
  getInfoFromQuery: () => any | undefined
} => {
  const getInfoFromQuery = () => {
    try {
      const info = getDataFromParams(location.search) || {}
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
