<template>
  <el-dialog
    v-model="dialogVisible"
    :title="tl('createMessageQueue')"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item :label="tl('topicFilter')" prop="topic_filter">
        <el-input v-model="form.topic_filter" clearable />
      </el-form-item>

      <el-form-item :label="tl('dispatchStrategy')" prop="dispatch_strategy">
        <el-select
          v-model="form.dispatch_strategy"
          :placeholder="tl('pleaseSelect')"
          style="width: 100%"
        >
          <el-option
            v-for="option in MessageQueueDispatchStrategyValue"
            :key="option.value"
            :label="getDispatchStrategyLabel(option.value)"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="tl('dataRetentionPeriod')" prop="data_retention_period">
        <el-input v-model="form.data_retention_period" clearable />
      </el-form-item>

      <el-form-item :label="tl('isLastvalue')" prop="is_lastvalue">
        <el-switch v-model="form.is_lastvalue" :active-text="tl('yes')" :inactive-text="tl('no')" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">
          {{ tl('cancel') }}
        </el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ tl('create') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { createMessageQueue } from '@/api/messageQueue'
import {
  MessageQueueDispatchStrategyValue,
  type MessageQueue,
  type MessageQueueDispatchStrategy as DispatchStrategy,
} from '@/types/typeAlias'

const { t, tl } = useI18nTl('MessageQueue')

interface Props {
  modelValue: boolean
  queue?: MessageQueue
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'created'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 对话框显示状态
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const form = reactive<MessageQueue>({
  topic_filter: '',
  dispatch_strategy: 'random',
  data_retention_period: '7d',
  is_lastvalue: true,
})

const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单验证规则
const { createRequiredRule } = useFormRules()
const rules: FormRules = {
  topic_filter: [
    ...createRequiredRule(tl('topicFilter')),
    {
      pattern: /^[^#+\s]*(\+|#)?[^#+\s]*$/,
      message: t('MessageQueue.invalidTopicFilter'),
      trigger: 'blur',
    },
  ],
}

const getDispatchStrategyLabel = (strategy: DispatchStrategy) => {
  const labels = {
    random: t('MessageQueue.dispatchStrategyRandom'),
    least_inflight: t('MessageQueue.dispatchStrategyLeastInflight'),
    round_robin: t('MessageQueue.dispatchStrategyRoundRobin'),
  }
  return labels[strategy] || strategy
}

const resetForm = () => {
  form.topic_filter = ''
  form.dispatch_strategy = 'random'
  form.data_retention_period = '7d'
  form.is_lastvalue = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    submitting.value = true

    await createMessageQueue(form)

    ElMessage.success(t('Base.createSuccess'))
    emit('created')
    dialogVisible.value = false
  } catch (error: any) {
    //
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
  formRef.value?.clearValidate()
}

watch(dialogVisible, (visible) => {
  if (visible) {
    resetForm()
  }
})
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
