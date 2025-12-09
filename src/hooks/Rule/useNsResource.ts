const useNsResource = () => {
  const store = useStore()
  const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
  const isOpNsResourceDisabled = ({
    namespace = undefined,
  }: { namespace?: string | null } & unknown = {}): boolean => {
    return !!(!isNamespaceUser.value && namespace)
  }
  return {
    isOpNsResourceDisabled,
  }
}

export default useNsResource
