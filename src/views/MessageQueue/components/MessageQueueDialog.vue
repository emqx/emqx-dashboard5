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
          <el-form-item :label="tl('topicFilter')" prop="topic_filter">
            <el-input v-model="form.topic_filter" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('dispatchStrategy')" prop="dispatch_strategy">
            <el-select
              v-model="form.dispatch_strategy"
              :placeholder="tl('pleaseSelect')"
              style="width: 100%"
            >
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
          <el-form-item :label="tl('dataRetentionPeriod')" prop="data_retention_period">
            <TimeInputWithUnitSelect
              v-model="form.data_retention_period"
              :enabled-units="['ms', 's', 'm', 'h', 'd']"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('isLastvalue')" prop="is_lastvalue">
            <el-switch v-model="form.is_lastvalue" />
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
import { createMessageQueue } from '@/api/messageQueue'
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
  (e: 'created'): void
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
})

const form = ref<MessageQueue>(createEmptyForm())

const formRef = ref<FormInstance>()
const submitting = ref(false)

const { createRequiredRule, createMqttSubscribeTopicRule } = useFormRules()
const rules: FormRules = {
  topic_filter: [...createRequiredRule(tl('topicFilter')), ...createMqttSubscribeTopicRule()],
}

const { dispatchStrategyOptions } = useMessageQueue()

const resetForm = () => {
  form.value = createEmptyForm()
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    submitting.value = true

    await createMessageQueue(form.value)

    ElMessage.success(t('Base.createSuccess'))
    emit('created')
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
