import { PostLogin200 } from '@/types/schemas/dashboard.schemas'

export default (): {
  updateBaseInfo: (username: string, info: PostLogin200, backend?: string) => void
} => {
  const { commit } = useStore()

  const updateBaseInfo = (
    username: string,
    { token, license, role }: PostLogin200,
    backend?: string,
  ) => {
    commit('UPDATE_USER_INFO', { token, username, role })
    commit('UPDATE_EDITION', license?.edition)
    if (backend) {
      commit('UPDATE_LOGIN_BACKEND', backend)
    }
  }

  return {
    updateBaseInfo,
  }
}
