<template>
  <el-dialog v-model="showDialog" width="400px" :title="tl('saveAsCopy')" :z-index="2000">
    <el-form label-position="top">
      <el-form-item :label="formItemLabel" :error="inputError">
        <el-input v-model="inputValue" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">
          {{ t('Base.cancel') }}
        </el-button>
        <el-button type="primary" @click="submit" :loading="isSubmitting">
          {{ t('Base.create') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <CreateRuleWithConnector v-model="showCreateRuleDialog" :connector="createdConnector" />
</template>

<script lang="ts" setup>
import { createRules } from '@/api/ruleengine'
import { checkNOmitFromObj } from '@/common/tools'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import useHandleConnectorItem from '@/hooks/Rule/connector/useHandleConnectorItem'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeItem, Connector, RuleItem } from '@/types/rule'
import CreateRuleWithConnector from '../Connector/components/CreateRuleWithConnector.vue'

interface CopyTarget {
  type: 'bridge' | 'rule' | 'connector'
  obj: BridgeItem | RuleItem | Connector
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  target: {
    type: Object as PropType<CopyTarget>,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('RuleEngine')
const router = useRouter()

const isRule = computed(() => props.target.type === 'rule')

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, (val) => {
  if (!val) {
    inputError.value = ''
  } else {
    const defaultInputValue = isRule.value
      ? (props.target.obj.id as RuleItem)
      : (props.target.obj.name as BridgeItem)
    inputValue.value = `${defaultInputValue}_copy`
  }
})

const inputValue = ref('')
const inputError = ref('')

const isSubmitting = ref(false)

const formItemLabel = computed(() => (isRule.value ? 'ID' : t('Base.name')))

const checkName = () => {
  if (!inputValue.value) {
    inputError.value = t('Rule.inputFieldRequiredError', { name: formItemLabel.value })
    return false
  }
  inputError.value = ''
  return true
}

const submitRule = async () => {
  const { sql, enable, description, actions } = props.target.obj as RuleItem
  return createRules({ sql, enable, description, actions, id: inputValue.value })
}

const { addAction } = useHandleActionItem()
const submitBridge = () => {
  return addAction({
    ...checkNOmitFromObj(props.target.obj as BridgeItem),
    name: inputValue.value,
  })
}

const { addConnector } = useHandleConnectorItem()
const submitConnector = () => {
  return addConnector({
    ...(checkNOmitFromObj(props.target.obj) as Connector),
    name: inputValue.value,
  })
}

const showCreateRuleDialog = ref(false)
const createdConnector = ref(undefined)

const confirmAfterCreatedBridge = (id: string) => {
  if (id) {
    showDialog.value = false
    ElMessageBox.confirm(tl('useConnectorCreateRule'), t('Base.createSuccess'), {
      confirmButtonText: tl('createRule'),
      cancelButtonText: tl('backBridgeList'),
      type: 'success',
    })
      .then(() => {
        router.push({ name: 'rule-create', query: { actionId: id } })
      })
      .catch(() => {
        router.push({ name: 'actions' })
      })
  } else {
    router.push({ name: 'actions' })
  }
}

const submitFuncMap = new Map([
  ['rule', submitRule],
  ['bridge', submitBridge],
  ['connector', submitConnector],
])
const submit = async () => {
  if (!checkName()) {
    return
  }

  try {
    isSubmitting.value = true
    const submitFunc = submitFuncMap.get(props.target.type)
    if (!submitFunc) {
      console.error('can not find func to submit')
      return
    }
    const res = await submitFunc()
    ElMessage.success(t('Base.createSuccess'))
    if (isRule.value) {
      router.push({ name: 'rule' })
    } else if (props.target.type === 'bridge') {
      confirmAfterCreatedBridge(res.id)
    } else if (props.target.type === 'connector') {
      createdConnector.value = res
      showDialog.value = false
      showCreateRuleDialog.value = true
    }
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>
