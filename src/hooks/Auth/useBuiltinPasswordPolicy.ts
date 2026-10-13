import http from '@/common/http'
import type { NodeInfo, SecurityProfile } from '@/types/dashboard'
import { onMounted, ref } from 'vue'

export default function useBuiltinPasswordPolicy() {
  const securityProfile = ref<SecurityProfile>('hardened')
  const policyLoading = ref(true)
  onMounted(async () => {
    try {
      const nodes: NodeInfo[] = await http.get('/nodes', {
        doNotTriggerProgress: true,
        errorsHandleCustom: [403],
      })
      // Offer weak algorithms only when every node explicitly accepts them.
      securityProfile.value =
        nodes.length > 0 && nodes.every((node) => node.security_profile === 'legacy')
          ? 'legacy'
          : 'hardened'
    } catch {
      // Restricted choices work for both profiles when node information is unavailable.
    } finally {
      policyLoading.value = false
    }
  })
  return { securityProfile, policyLoading }
}
