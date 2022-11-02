<template>
  <el-dialog v-model="showDialog" width="400px" :title="tl('saveAsCopy')" :z-index="2000">
    <el-form label-position="top">
      <el-form-item label="ID" :error="ruleIdError">
        <el-input v-model="ruleId" />
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
import { computed, defineProps, defineEmits, ref, watch } from 'vue'
import { ElDialog, ElMessage } from 'element-plus'
import useI18nTl from '@/hooks/useI18nTl'
import { createRules } from '@/api/ruleengine'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  rule: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const { t, tl } = useI18nTl('RuleEngine')
const router = useRouter()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, (val) => {
  if (!val) {
    ruleIdError.value = ''
  } else {
    ruleId.value = `${props.rule.id}_copy`
  }
})

const ruleId = ref('')
const ruleIdError = ref('')

const isSubmitting = ref(false)

const checkName = () => {
  if (!ruleId.value) {
    ruleIdError.value = t('Rule.inputFieldRequiredError', { name: ' ID' })
    return false
  }
  ruleIdError.value = ''
  return true
}

const submit = async () => {
  if (!checkName()) {
    return
  }

  try {
    isSubmitting.value = true
    const { sql, enable, description, actions } = props.rule
    await createRules({ sql, enable, description, actions, id: ruleId.value })
    ElMessage.success(t('Base.createSuccess'))
    router.push({ name: 'iot' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>
