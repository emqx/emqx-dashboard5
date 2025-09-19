<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="640px"
    destroy-on-close
    @open="handleOpen"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item prop="topic_filter">
            <template #label>
              <FormItemLabel :label="tl('topicFilter')" :desc="tl('topicFilterDesc')" desc-marked />
            </template>
            <el-input v-model="form.topic_filter" clearable :disabled="isEdit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="dispatch_strategy">
            <template #label>
              <FormItemLabel :label="tl('dispatchStrategy')" :desc="tl('dispatchStrategyDesc')" />
            </template>
            <el-select v-model="form.dispatch_strategy">
              <el-option
                v-for="{ value, label } in dispatchStrategyOptions"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="data_retention_period">
            <template #label>
              <FormItemLabel
                :label="tl('dataRetentionPeriod')"
                :desc="tl('dataRetentionPeriodDesc')"
              />
            </template>
            <TimeInputWithUnitSelect
              v-model="form.data_retention_period"
              :enabled-units="['ms', 's', 'm', 'h', 'd']"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="is_lastvalue">
            <template #label>
              <FormItemLabel :label="tl('isLastvalue')" :desc="tl('isLastvalueDesc')" desc-marked />
            </template>
            <el-switch v-model="form.is_lastvalue" :disabled="isEdit" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.is_lastvalue">
          <el-form-item prop="key_expression">
            <template #label>
              <FormItemLabel
                :label="tl('keyExpression')"
                :desc="tl('keyExpressionDesc')"
                desc-marked
              />
            </template>
            <el-input v-model="form.key_expression" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">
          {{ t('Base.cancel') }}
        </el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ isEdit ? t('Base.save') : t('Base.create') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { createMessageQueue, updateMessageQueue } from '@/api/messageQueue'
import { transMsNumToDuration } from '@/common/tools'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import { MessageQueueDispatchStrategyValue, type MessageQueue } from '@/types/typeAlias'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const { t, tl } = useI18nTl('MessageQueue')

interface Props {
  modelValue: boolean
  queue?: MessageQueue
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submitted'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isEdit = computed(() => !!props.queue)
const title = computed(() => (isEdit.value ? tl('editMessageQueue') : tl('createMessageQueue')))

const createEmptyForm = () => ({
  topic_filter: '',
  dispatch_strategy: MessageQueueDispatchStrategyValue.random,
  data_retention_period: '7d',
  is_lastvalue: true,
  key_expression: 'message.from',
})

const form = ref<MessageQueue>(createEmptyForm())

const formRef = ref<FormInstance>()
const submitting = ref(false)

const { createRequiredRule, createMqttSubscribeTopicRule } = useFormRules()
const rules: FormRules = {
  topic_filter: [...createRequiredRule(tl('topicFilter')), ...createMqttSubscribeTopicRule()],
  key_expression: createRequiredRule(tl('keyExpression')),
}

const { dispatchStrategyOptions } = useMessageQueue()

const resetForm = () => {
  form.value = createEmptyForm()
}

const processForm = (data: MessageQueue): MessageQueue => {
  const ret = { ...data }
  if (!ret.is_lastvalue) {
    delete (ret as any).key_expression
  }
  return ret
}

const createQueue = () => createMessageQueue(processForm(form.value))
const updateQueue = () => {
  const { topic_filter, ...data } = processForm(form.value)
  return updateMessageQueue(topic_filter, data)
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    submitting.value = true

    await (isEdit.value ? updateQueue : createQueue)()

    ElMessage.success(t(`Base.${isEdit.value ? 'updateSuccess' : 'createSuccess'}`))
    emit('submitted')
    dialogVisible.value = false
  } catch (error: any) {
    //
  } finally {
    submitting.value = false
  }
}

const handleOpen = () => {
  if (isEdit.value && props.queue) {
    form.value = cloneDeep(props.queue)
    if (form.value.data_retention_period && typeof form.value.data_retention_period === 'number') {
      form.value.data_retention_period = transMsNumToDuration(form.value.data_retention_period)
    }
  }
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
  formRef.value?.clearValidate()
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
