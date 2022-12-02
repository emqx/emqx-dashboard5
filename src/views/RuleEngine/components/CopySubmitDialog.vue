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
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits, ref, watch, PropType } from 'vue'
import { ElDialog, ElMessage, ElMessageBox } from 'element-plus'
import useI18nTl from '@/hooks/useI18nTl'
import { createRules, createBridge } from '@/api/ruleengine'
import { useRouter } from 'vue-router'
import { BridgeItem, RuleItem } from '@/types/rule'
import { checkNOmitFromObj } from '@/common/tools'

interface CopyTarget {
  type: 'bridge' | 'rule'
  obj: BridgeItem | RuleItem
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
    inputError.value = t('Rule.inputFieldRequiredError', { name: formItemLabel })
    return false
  }
  inputError.value = ''
  return true
}

const submitRule = async () => {
  const { sql, enable, description, actions } = props.target.obj as RuleItem
  return createRules({ sql, enable, description, actions, id: inputValue.value })
}

const submitBridge = () => {
  return createBridge({
    ...checkNOmitFromObj(props.target.obj as BridgeItem),
    name: inputValue.value,
  })
}

const confirmAfterCreatedBridge = (id: string) => {
  if (id) {
    showDialog.value = false
    ElMessageBox.confirm(tl('useBridgeCreateRule'), t('Base.createSuccess'), {
      confirmButtonText: tl('createRule'),
      cancelButtonText: tl('backBridgeList'),
      type: 'success',
    })
      .then(() => {
        router.push({ name: 'iot-create', query: { bridgeId: id } })
      })
      .catch(() => {
        router.push({ name: 'data-bridge' })
      })
  } else {
    router.push({ name: 'data-bridge' })
  }
}

const submit = async () => {
  if (!checkName()) {
    return
  }

  try {
    isSubmitting.value = true
    const submitFunc = isRule.value ? submitRule : submitBridge
    const res = await submitFunc()
    ElMessage.success(t('Base.createSuccess'))
    if (isRule.value) {
      router.push({ name: 'iot' })
    } else {
      confirmAfterCreatedBridge(res.id)
    }
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>
