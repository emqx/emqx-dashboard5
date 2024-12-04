<template>
  <el-dialog v-model="showDialog" :title="title" destroy-on-close width="700px">
    <StreamingAuthForm
      ref="FormCom"
      v-model="record"
      :lang="locale"
      :rules="rules"
      :is-edit="isEdit"
    />
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="showDialog = false">{{ t('Base.cancel') }}</el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          @click="submit"
          :loading="isSubmitting"
        >
          {{ isEdit ? t('Base.update') : t('Base.add') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { createStreamingAuthn, updateStreamingAuthn } from '@/api/streaming'
import useFormRules from '@/hooks/useFormRules'
import { StreamingAuthn } from '@/types/typeAlias'
import { StreamingAuthForm } from '@emqx/shared-ui-components'
import { StreamAuthType } from '@emqx/shared-ui-constants'
import { useLocale } from '@emqx/shared-ui-utils'
import { ElMessage } from 'element-plus'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  modelValue: boolean
  data?: StreamingAuthn
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'submitted'): void
}>()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})
watch(showDialog, (val) => {
  if (!val) {
    record.value = createRawAuthn()
  } else if (val && props.data) {
    record.value = props.data
  }
})

const isEdit = computed(() => !!props.data)

const { t, locale } = useI18n()
const { t: sharedT } = useLocale(locale.value)
const tl = (key: string) => sharedT(`streaming.${key}`)

const title = computed(() => {
  const params = { target: t('Base.authn') }
  return isEdit.value ? t('Base.updateTarget', params) : t('Base.createTarget', params)
})

const createRawAuthn = (): StreamingAuthn => ({
  user_name: '',
  mechanism: StreamAuthType.SHA256,
  password: '',
})

const record = ref<StreamingAuthn>(createRawAuthn())

const FormCom = ref()
const { createRequiredRule } = useFormRules()
const rules = computed(() => ({
  user_name: [
    ...createRequiredRule(t('Base.username')),
    { pattern: /^[\w./+%$#@&-]{1,128}$/, message: tl('usernameRule') },
  ],
  mechanism: createRequiredRule(tl('authType'), 'select'),
  password: createRequiredRule(t('Base.password')),
}))

const isSubmitting = ref(false)
const submit = async () => {
  try {
    await FormCom.value.validate()
    isSubmitting.value = true
    isEdit.value
      ? await updateStreamingAuthn(record.value)
      : await createStreamingAuthn(record.value)
    emit('submitted')
    showDialog.value = false
    ElMessage.success(isEdit.value ? t('Base.updateSuccess') : t('Base.createSuccess'))
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss"></style>
