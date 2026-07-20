import { FeatureName } from '@/types/enum'

export default () => {
  const store = useStore()

  return computed<boolean>(() => store.getters.isFeatureEnabled(FeatureName.MultiTenancy))
}
