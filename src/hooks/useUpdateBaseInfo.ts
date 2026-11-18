import type { LoginResponse } from '@/types/typeAlias'

export default (): {
  updateBaseInfo: (
    username: string,
    info: LoginResponse,
    backend?: string,
    mfaEnabled?: boolean,
  ) => void
} => {
  const { commit } = useStore()

  const updateBaseInfo = (
    username: string,
    { token, license, role, namespace }: LoginResponse,
    backend?: string,
    mfaEnabled?: boolean,
  ) => {
    commit('UPDATE_USER_INFO', { token, username, role, namespace, mfaEnabled })
    commit('UPDATE_EDITION', license?.edition)
    if (backend) {
      commit('UPDATE_LOGIN_BACKEND', backend)
    }
  }

  return {
    updateBaseInfo,
  }
}
