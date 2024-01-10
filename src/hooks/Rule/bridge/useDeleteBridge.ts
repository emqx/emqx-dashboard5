import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isFunction } from 'lodash'
import { Ref, ref } from 'vue'
import useHandleActionItem from '../action/useHandleActionItem'
import { useBridgeDirection } from './useBridgeTypeValue'

interface DeleteBridgeResult {
  showSecondConfirm: Ref<boolean>
  usingBridgeRules: Ref<string[]>
  currentDeleteBridgeId: Ref<string>
  currentDelName: Ref<string>
  showDeleteWebhookAssociatedTip: Ref<boolean>
  handleDeleteSuc: () => void
  delBridgeDirection: Ref<number>
  handleDeleteBridge: (data: BridgeItem) => Promise<void>
}

export default (deletedCallBack: () => void): DeleteBridgeResult => {
  const { t } = useI18nTl('RuleEngine')

  const showSecondConfirm = ref(false)
  const usingBridgeRules: Ref<Array<string>> = ref([])
  const currentDeleteBridgeId = ref('')

  const currentDelName = ref('')
  const showDeleteWebhookAssociatedTip = ref(false)
  const { judgeIsWebhookAction } = useWebhookUtils()

  const handleDeleteSuc = () => {
    ElMessage.success(t('Base.deleteSuccess'))
    if (deletedCallBack && isFunction(deletedCallBack)) {
      deletedCallBack()
    }
  }

  const secondConfirmToDelete = async (ruleList: Array<string>) => {
    usingBridgeRules.value = ruleList
    showSecondConfirm.value = true
  }

  const delBridgeDirection = ref(BridgeDirection.Egress)
  const { judgeBridgeDirection } = useBridgeDirection()
  const { deleteAction } = useHandleActionItem()
  const handleDeleteBridge = async (item: BridgeItem) => {
    if (judgeIsWebhookAction(item)) {
      currentDelName.value = item.name
      showDeleteWebhookAssociatedTip.value = true
      return
    }
    const { id } = item
    await ElMessageBox.confirm(t('Base.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    try {
      delBridgeDirection.value = judgeBridgeDirection(item)
      await deleteAction(id)
      handleDeleteSuc()
    } catch (error: any) {
      const { status, data } = error?.response || {}
      if (status === 400) {
        currentDeleteBridgeId.value = id
        secondConfirmToDelete(data?.rules || [])
      } else {
        console.error(error)
      }
    }
  }

  return {
    showSecondConfirm,
    usingBridgeRules,
    currentDeleteBridgeId,
    currentDelName,
    showDeleteWebhookAssociatedTip,
    handleDeleteSuc,
    delBridgeDirection,
    handleDeleteBridge,
  }
}
