import { LoginResponse } from '@/types/typeAlias'

export default (): {
  updateBaseInfo: (username: string, info: LoginResponse, backend?: string) => void
} => {
  const { commit } = useStore()

  const updateBaseInfo = (
    username: string,
    { token, role, namespace }: LoginResponse,
    backend?: string,
  ) => {
    commit('UPDATE_USER_INFO', { token, username, role, namespace })
    if (backend) {
      commit('UPDATE_LOGIN_BACKEND', backend)
    }
  }

  return {
    updateBaseInfo,
  }
}
