import useI18nTl from '@/hooks/useI18nTl'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isFunction } from 'lodash'
import { Ref, ref } from 'vue'
import useHandleActionItem from '../action/useHandleActionItem'

const getRuleArrFromErrorMsg = (msg: string) => {
  const reg = /Cannot delete bridge while active rules are depending on it: /
  const ruleStr = msg.replace(reg, '')
  return ruleStr.split(' ').filter(Boolean)
}

export default (
  deletedCallBack: () => void,
): {
  showSecondConfirm: Ref<boolean>
  usingBridgeRules: Ref<string[]>
  currentDeleteBridgeId: Ref<string>
  handleDeleteSuc: () => void
  handleDeleteBridge: (id: string) => Promise<void>
} => {
  const { t } = useI18nTl('RuleEngine')

  const showSecondConfirm = ref(false)
  const usingBridgeRules: Ref<Array<string>> = ref([])
  const currentDeleteBridgeId = ref('')

  const handleDeleteSuc = () => {
    ElMessage.success(t('Base.deleteSuccess'))
    if (deletedCallBack && isFunction(deletedCallBack)) {
      deletedCallBack()
    }
  }

  const secondConfirmToDelete = async (msg: string) => {
    usingBridgeRules.value = getRuleArrFromErrorMsg(msg)
    showSecondConfirm.value = true
  }

  const { deleteAction } = useHandleActionItem()
  const handleDeleteBridge = async (id: string) => {
    await ElMessageBox.confirm(t('Base.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    try {
      await deleteAction(id)
      handleDeleteSuc()
    } catch (error: any) {
      const { status, data } = error?.response || {}
      if (status === 400) {
        currentDeleteBridgeId.value = id
        secondConfirmToDelete(data?.message || '')
      } else {
        console.error(error)
      }
    }
  }

  return {
    showSecondConfirm,
    usingBridgeRules,
    currentDeleteBridgeId,
    handleDeleteSuc,
    handleDeleteBridge,
  }
}
