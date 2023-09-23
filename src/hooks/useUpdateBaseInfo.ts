import { PostLogin200 } from '@/types/schemas/dashboard.schemas'
import { useStore } from 'vuex'

export default (): {
  updateBaseInfo: (username: string, info: PostLogin200, backend: string) => void
} => {
  const { commit } = useStore()

  const updateBaseInfo = (username: string, { token, license }: PostLogin200, backend: string) => {
    commit('UPDATE_USER_INFO', { token, username })
    commit('UPDATE_EDITION', license?.edition)
    commit('UPDATE_LOGIN_BACKEND', backend)
  }

  return {
    updateBaseInfo,
  }
}
