import { testConnector } from '@/api/ruleengine'
import { checkNOmitFromObj } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { ConnectorMQTT } from '@/types/rule'
import { ElMessage } from 'element-plus'
import { computed, ref, Ref, ComputedRef } from 'vue'

export default (
  bridgeData: any,
): {
  isTesting: Ref<boolean>
  canTest: ComputedRef<boolean>
  testTheConnection: () => Promise<void>
} => {
  const { tl } = useI18nTl('RuleEngine')

  const isTesting = ref(false)

  const canTest = computed(() => {
    return bridgeData.value?.connector?.type === BridgeType.MQTT
  })

  const testTheConnection = async () => {
    try {
      isTesting.value = true
      await testConnector(checkNOmitFromObj(bridgeData.value.connector) as ConnectorMQTT)
      ElMessage.success(tl('connectionSuccessful'))
    } catch (error) {
      console.error(error)
    } finally {
      isTesting.value = false
    }
  }

  return {
    isTesting,
    canTest,
    testTheConnection,
  }
}
