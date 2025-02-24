import { BridgeItem } from '@/types/rule'

interface DeleteBridgeResult {
  showSecondConfirm: Ref<boolean>
  usingBridgeRules: Ref<string[]>
  currentDeleteBridgeId: Ref<string>
  handleDeleteSuc: () => void
  handleDeleteBridge: (data: BridgeItem) => Promise<void>
}

export default (deletedCallBack: () => void): DeleteBridgeResult => {
  const { t } = useI18nTl('RuleEngine')

  const showSecondConfirm = ref(false)
  const usingBridgeRules: Ref<Array<string>> = ref([])
  const currentDeleteBridgeId = ref('')

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

  const { deleteAction } = useHandleActionItem()
  const handleDeleteBridge = async (item: BridgeItem) => {
    if (judgeIsWebhookAction(item)) {
      return
    }
    if (item.rules?.length) {
      currentDeleteBridgeId.value = item.id
      secondConfirmToDelete(item.rules)
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
      await deleteAction(id)
      handleDeleteSuc()
    } catch (error: any) {
      //
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
