import { ref } from 'vue'
import type { Ref } from 'vue'

export default (): {
  isTesting: Ref<boolean>
  testConnectivity: () => Promise<void>
} => {
  const isTesting = ref(false)
  const testConnectivity = async () => {}

  return {
    isTesting,
    testConnectivity,
  }
}
