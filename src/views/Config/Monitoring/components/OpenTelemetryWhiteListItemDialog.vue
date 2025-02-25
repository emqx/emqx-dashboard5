<template>
  <el-dialog
    v-model="showDialog"
    width="400px"
    destroy-on-close
    :title="isEdit ? t('Base.edit') : t('Base.add')"
  >
    <el-form ref="FormCom" :model="record" :rules="rules">
      <el-form-item prop="value" :label="target">
        <el-input v-model="record.value" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="close">{{ t('Base.cancel') }}</el-button>
        <el-button type="primary" :disabled="!$hasPermission('post')" @click="confirm">
          {{ isEdit ? t('Base.confirm') : t('Base.add') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { OpenTelemetryWhiteListType } from '@/types/enum'

const props = defineProps<{
  modelValue: boolean
  value?: string
  type?: OpenTelemetryWhiteListType
  existingList: Array<string>
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'confirm', val: string): void
}>()

const showDialog = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
watch(showDialog, (val) => {
  if (val) {
    record.value.value = props.value || ''
  }
})

const { t, tl } = useI18nTl('MonitoringIntegration')

const isEdit = computed(() => !!props.value)
const target = computed(() =>
  props.type === OpenTelemetryWhiteListType.ClientID ? t('Base.clientid') : t('Base.topic'),
)

const record = ref({ value: '' })
const { createRequiredRule } = useFormRules()
const rules = computed(() => ({
  value: [
    ...createRequiredRule(target.value),
    {
      validator(rules, value, callback) {
        if (value !== props.value && props.existingList.includes(value)) {
          callback(new Error(tl('alreadyExists')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}))

const close = () => (showDialog.value = false)

const FormCom = ref()
const confirm = async () => {
  try {
    await FormCom.value.validate()
    emit('confirm', record.value.value)
    showDialog.value = false
  } catch (error) {
    //
  }
}
</script>

<style lang="scss"></style>
