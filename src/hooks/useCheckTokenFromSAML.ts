import { verifyTokenFromSAML } from '@/api/sso'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

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

export default () => {
  const router = useRouter()
  const { commit } = useStore()

  const getTokenData = () => {
    const tokenData = getDataFromParams(location.search)
  }

  const loginInBySAML = async () => {
    try {
      const data = getTokenData()
      let res = await verifyTokenFromSAML(data)
      commit('UPDATE_USER_INFO', { token: res.token, username })
      commit('UPDATE_EDITION', res.license?.edition)
      router.push({ name: 'overview' })
    } catch (error) {
      //
    }
  }

  loginInBySAML()
}
