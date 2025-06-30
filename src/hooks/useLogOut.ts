import { toLogin } from '@/router'
import { logout } from '@/api/common'

const useLogOut = () => {
  const store = useStore()
  const handleLogOut = async () => {
    try {
      const { user, loginBackend } = store.state
      await logout(user.username, loginBackend)
      toLogin()
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject(error)
    }
  }

  return {
    handleLogOut,
  }
}

export default useLogOut
