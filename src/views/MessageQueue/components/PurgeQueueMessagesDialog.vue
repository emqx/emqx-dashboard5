<template>
  <el-dialog
    v-model="visible"
    :title="tl('purgeMessages')"
    width="480px"
    :show-close="!submitting"
    :close-on-click-modal="!submitting"
    :close-on-press-escape="!submitting"
    @open="resetForm"
  >
    <el-card class="purge-target" shadow="never" :body-style="{ padding: '0 12px' }">
      <p>{{ tl('purgeTarget', { name: queueName }) }}</p>
    </el-card>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      :disabled="submitting"
      @submit.prevent
    >
      <el-form-item prop="scope" :label="tl('purgeScope')">
        <el-radio-group v-model="form.scope" class="purge-scope">
          <el-radio value="all">{{ tl('purgeAllMessages') }}</el-radio>
          <el-radio value="before">{{ tl('purgeMessagesBefore') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.scope === 'before'" prop="before" :label="tl('purgeCutoffTime')">
        <el-date-picker
          v-model="form.before"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          :disabled-date="isFutureDate"
          :shortcuts="cutoffShortcuts"
          :value-on-clear="() => undefined"
          :placeholder="tl('purgeCutoffTime')"
        />
      </el-form-item>
    </el-form>
    <TipContainer :content="tl('purgeWarning')" />

    <template #footer>
      <div class="dialog-align-footer">
        <CancelButton :disabled="submitting" @click="visible = false" />
        <el-button
          type="danger"
          :disabled="!$hasPermission('delete')"
          :loading="submitting"
          @click="handleSubmit"
        >
          {{ tl('confirmPurge') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { purgeMessageQueue } from '@/api/messageQueue'
import { ONE_DAY, ONE_HOUR } from '@/common/tools'
import type { FormInstance, FormRules } from 'element-plus'

const visible = defineModel<boolean>({ required: true })
const props = defineProps<{ queueName: string }>()
const { tl } = useI18nTl('MessageQueue')

const form = reactive<{ scope?: 'all' | 'before'; before?: Date }>({})
const formRef = ref<FormInstance>()
const submitting = ref(false)

const isFutureDate = (date: Date) => date.getTime() > new Date().setHours(23, 59, 59, 999)
const cutoffShortcuts = computed(() => [
  { text: tl('oneHourAgo'), value: () => new Date(Date.now() - ONE_HOUR) },
  { text: tl('twentyFourHoursAgo'), value: () => new Date(Date.now() - ONE_DAY) },
  { text: tl('threeDaysAgo'), value: () => new Date(Date.now() - 3 * ONE_DAY) },
])

const { createRequiredRule } = useFormRules()
const rules = computed<FormRules>(() => ({
  scope: createRequiredRule(tl('purgeScope'), 'select'),
  before: createRequiredRule(tl('purgeCutoffTime'), 'select'),
}))

const resetForm = () => {
  formRef.value?.resetFields('scope')
  form.before = undefined
}

const handleSubmit = async () => {
  if (!formRef.value || submitting.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    const { scope, before } = form
    const params = scope === 'all' ? {} : before && { before: before.getTime() }
    if (!params) return

    submitting.value = true
    await purgeMessageQueue(props.queueName, params)
    ElMessage.success(tl('purgeRequested'))
    visible.value = false
  } catch {
    // Form validation and the HTTP interceptor display errors.
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.purge-target {
  margin-bottom: 12px;
  overflow-wrap: anywhere;
}

.purge-scope {
  flex-direction: column;
  align-items: flex-start;
}
</style>
