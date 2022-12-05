import { deleteBridge } from '@/api/ruleengine'
import useI18nTl from '@/hooks/useI18nTl'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isFunction } from 'lodash'
import { ref, Ref } from 'vue'

const getRuleArrFromErrorMsg = (msg: string) => {
  const reg = /\[(?<rules>.+)\]/
  const ruleReg = /<<"(.+?)">>/g

  const ruleStr = msg.match(reg)?.groups?.rules || ''
  return ruleStr.match(ruleReg)?.map((rule) => rule.slice(3, -3)) || []
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

  const handleDeleteBridge = async (id: string) => {
    await ElMessageBox.confirm(t('Base.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      type: 'warning',
    })
    try {
      await deleteBridge(id)
      handleDeleteSuc()
    } catch (error: any) {
      const { status, data } = error?.response || {}
      if (status === 403) {
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
