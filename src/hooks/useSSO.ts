import { ref, Ref } from 'vue'
import { getSSOList } from '@/api/sso'

export default function useSSO(): {
  SSOConfig: Ref<unknown>
  getSSOList: () => Promise<unknown[]>
} {
  const SSOConfig = ref<unknown>(null)
  const getSSOConfig = async () => {
    try {
      SSOConfig.value = await getSSOList()
    } catch (error) {
      //
    }
  }
  getSSOConfig()

  return {
    SSOConfig,
    getSSOList,
  }
}
