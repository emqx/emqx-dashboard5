import { UserRole } from '@/types/enum'

const useNsResource = () => {
  const store = useStore()
  const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
  const isOpNsResourceDisabled = ({
    namespace = undefined,
  }: { namespace?: string | null } & unknown = {}): boolean => {
    return !!(!isNamespaceUser.value && namespace && store.state.user.role !== UserRole.Admin)
  }
  return {
    isOpNsResourceDisabled,
  }
}

export default useNsResource
