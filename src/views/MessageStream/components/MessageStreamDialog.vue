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
              <FormItemLabel
                :label="t('MessageQueue.topicFilter')"
                :desc="tl('topicFilterDesc')"
                desc-marked
              />
            </template>
            <el-input v-model="form.topic_filter" clearable :disabled="isEdit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="data_retention_period">
            <template #label>
              <FormItemLabel
                :label="t('MessageQueue.dataRetentionPeriod')"
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
              <FormItemLabel
                :label="t('MessageQueue.isLastvalue')"
                :desc="tl('isLastvalueDesc')"
                desc-marked
              />
            </template>
            <el-switch v-model="form.is_lastvalue" :disabled="isEdit" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="key_expression">
            <template #label>
              <FormItemLabel
                :label="tl('keyExpression')"
                :desc="descForKeyExpression"
                desc-marked
                :max-height="200"
              />
            </template>
            <el-input v-model="form.key_expression" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-divider> {{ t('MessageQueue.limiter') }} </el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="limits.max_shard_message_count">
            <template #label>
              <FormItemLabel
                :label="t('MessageQueue.maxShardMessageCount')"
                :desc="tl('maxShardMessageCountDesc')"
                desc-marked
              />
            </template>
            <el-tooltip
              placement="top"
              :disabled="!isEditingRegular"
              :content="tl('limitsDisabledTip')"
            >
              <Oneof
                class="in-one-row"
                v-model="form.limits.max_shard_message_count"
                :switch-disabled="isEditingRegular"
                :items="[{ type: 'number' }, { symbols: [INFINITY_VALUE], type: 'enum' }]"
              />
            </el-tooltip>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="limits.max_shard_message_bytes">
            <template #label>
              <FormItemLabel
                :label="t('MessageQueue.maxShardMessageBytes')"
                :desc="tl('maxShardMessageBytesDesc')"
                desc-marked
              />
            </template>
            <el-tooltip
              placement="top"
              :disabled="!isEditingRegular"
              :content="tl('limitsDisabledTip')"
            >
              <Oneof
                class="in-one-row"
                v-model="form.limits.max_shard_message_bytes"
                :switch-disabled="isEditingRegular"
                :items="[{ type: 'byteSize' }, { symbols: [INFINITY_VALUE], type: 'enum' }]"
              />
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <CancelButton @click="handleClose" />
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          {{ isEdit ? t('Base.save') : t('Base.create') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { postMessageStream, putMessageStream } from '@/api/messageStream'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useMessageStream from '@/hooks/MessageStream/useMessageStream'
import { type MessageStreamItem } from '@/types/typeAlias'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

interface Props {
  modelValue: boolean
  stream?: MessageStreamItem
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submitted'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t, tl } = useI18nTl('MessageStream')

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isEdit = computed(() => !!props.stream)
const title = computed(() => (isEdit.value ? tl('editMessageStream') : tl('createMessageStream')))

const createEmptyForm = (): MessageStreamItem =>
  ({
    topic_filter: '',
    data_retention_period: '7d',
    is_lastvalue: true,
    key_expression: 'message.from',
    limits: {
      max_shard_message_count: 'infinity',
      max_shard_message_bytes: 'infinity',
    },
  }) as MessageStreamItem

const form = ref<MessageStreamItem>(createEmptyForm())

const formRef = ref<FormInstance>()
const submitting = ref(false)

const isEditingRegular = computed(() => isEdit.value && !form.value.is_lastvalue)

const { createRequiredRule, createMqttSubscribeTopicRule } = useFormRules()
const rules: FormRules = {
  topic_filter: [
    ...createRequiredRule(t('MessageQueue.topicFilter')),
    ...createMqttSubscribeTopicRule(),
  ],
  key_expression: createRequiredRule(t('MessageQueue.keyExpression')),
  'limits.max_shard_message_count': createRequiredRule(t('MessageQueue.maxShardMessageCount')),
  'limits.max_shard_message_bytes': createRequiredRule(t('MessageQueue.maxShardMessageBytes')),
}

const { descForKeyExpression } = useMessageStream()

const resetForm = () => {
  form.value = createEmptyForm()
}

const createStream = () => postMessageStream(form.value)
const updateStream = () => {
  const { topic_filter, ...data } = form.value
  return putMessageStream(topic_filter, data)
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true
    await (isEdit.value ? updateStream : createStream)()
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
  if (isEdit.value && props.stream) {
    form.value = cloneDeep(props.stream)
    if (form.value.data_retention_period && typeof form.value.data_retention_period === 'number') {
      form.value.data_retention_period = transMsNumToDuration(form.value.data_retention_period)
    }
    if (
      form.value.limits.max_shard_message_bytes &&
      typeof form.value.limits.max_shard_message_bytes === 'number'
    ) {
      form.value.limits.max_shard_message_bytes = transMemorySizeNumToStr(
        form.value.limits.max_shard_message_bytes,
        undefined,
        false,
      )
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
