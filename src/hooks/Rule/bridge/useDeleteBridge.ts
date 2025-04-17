import { BridgeItem } from '@/types/rule'

interface DeleteBridgeResult {
  showSecondConfirm: Ref<boolean>
  usingBridgeRules: Ref<string[]>
  showFallbackConfirm: Ref<boolean>
  usingAsFallbackAction: Ref<Array<{ type: string; name: string }>>
  currentDeleteBridgeId: Ref<string>
  handleDeleteSuc: () => void
  handleDeleteBridge: (data: BridgeItem) => Promise<void>
}

export default (deletedCallBack: () => void): DeleteBridgeResult => {
  const { t } = useI18nTl('RuleEngine')

  const showSecondConfirm = ref(false)
  const usingBridgeRules: Ref<Array<string>> = ref([])
  const currentDeleteBridgeId = ref('')

  const showFallbackConfirm = ref(false)
  const usingAsFallbackAction: Ref<Array<{ type: string; name: string }>> = ref([])

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

  const { getActionList } = useActionList()
  const isUsedAsFallbackAction = async (item: BridgeItem) => {
    try {
      let { referenced_as_fallback_action_by } = item
      if (isUndefined(referenced_as_fallback_action_by)) {
        const totalList = await getActionList()
        const targetAction = totalList.find((action) => action.id === item.id)
        referenced_as_fallback_action_by = targetAction?.referenced_as_fallback_action_by ?? []
      }
      return referenced_as_fallback_action_by
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const { deleteAction } = useHandleActionItem()
  const handleDeleteBridge = async (item: BridgeItem) => {
    if (judgeIsWebhookAction(item)) {
      return
    }
    usingAsFallbackAction.value = await isUsedAsFallbackAction(item)
    if (usingAsFallbackAction.value?.length) {
      showFallbackConfirm.value = true
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
    showFallbackConfirm,
    usingAsFallbackAction,
    handleDeleteSuc,
    handleDeleteBridge,
  }
}
