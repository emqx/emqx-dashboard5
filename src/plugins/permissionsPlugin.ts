import store from '@/store'

const PERMISSIONS_KEY = Symbol('PERMISSIONS')

export type ActionType = 'post' | 'get' | 'delete' | 'put'

interface Permissions {
  hasPermission: (actionType: ActionType) => boolean
}

export function usePerms(): Permissions {
  const perms = inject<Permissions | undefined>(PERMISSIONS_KEY)
  if (!perms) {
    throw new Error('Permissions are not provided.')
  }
  return perms
}

export default {
  install: (
    app: App,
    options: {
      store: typeof store
    },
  ): void => {
    const store = options.store
    const hasPermission = (actionType: ActionType) => {
      const isViewer = store.state.user.role === 'viewer'
      return !(isViewer && ['post', 'put', 'delete'].includes(actionType))
    }

    app.provide(PERMISSIONS_KEY, { hasPermission })

    app.config.globalProperties.$hasPermission = hasPermission
  },
}
