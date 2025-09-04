export const routesRegNamespaceUserCanAccess = [
  /login/,
  /not-found/,
  /^webhook/,
  /^flow/,
  /^rule/,
  /^connector/,
  /^source/,
  /^action/,
]

const useNamespaceUserRouter = () => {
  const store = useStore()
  const isNamespaceUser = computed(() => store.getters.isNamespaceUser)

  const router = useRouter()

  const removeRoutersCanNotAccess = () => {
    const allRoutes = router.getRoutes()
    allRoutes.forEach((route) => {
      if (
        route.name &&
        !routesRegNamespaceUserCanAccess.some((reg) => reg.test(route.name as string))
      ) {
        router.removeRoute(route.name)
      }
    })
  }

  const checkAndRemoveRoutersCanNotAccess = () => {
    if (isNamespaceUser.value) {
      removeRoutersCanNotAccess()
    }
  }

  return {
    checkAndRemoveRoutersCanNotAccess,
  }
}

export default useNamespaceUserRouter
