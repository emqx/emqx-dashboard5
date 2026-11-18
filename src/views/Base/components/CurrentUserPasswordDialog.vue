<template>
  <el-dialog
    v-model="showDialog"
    :title="tl('changePassword')"
    width="500px"
    destroy-on-close
    @closed="resetForm"
  >
    <el-form
      ref="formRef"
      :model="record"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
      @submit.prevent="save"
    >
      <el-form-item prop="oldPassword" :label="tl('password')">
        <el-input
          v-model="record.oldPassword"
          type="password"
          show-password
          autocomplete="current-password"
        />
      </el-form-item>
      <el-form-item prop="newPassword" :label="tl('newPassword')">
        <el-input
          v-model="record.newPassword"
          type="password"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>
      <el-form-item prop="repeatPassword" :label="tl('confirmPassword')">
        <el-input
          v-model="record.repeatPassword"
          type="password"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showDialog = false">{{ t('Base.cancel') }}</el-button>
      <el-button type="primary" :loading="submitting" @click="save">
        {{ t('Base.confirm') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { changePassword } from '@/api/function'
import { PASSWORD_REG } from '@/common/constants'
import { toLogin } from '@/router'

const props = defineProps<{ modelValue: boolean; username: string }>()
const emit = defineEmits<{ (event: 'update:modelValue', value: boolean): void }>()
const { t, tl } = useI18nTl('General')
const store = useStore()
const formRef = ref<FormInstance>()
const submitting = ref(false)
const record = reactive({ oldPassword: '', newPassword: '', repeatPassword: '' })
const showDialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})
const rules: FormRules = {
  oldPassword: [{ required: true, message: tl('pleaseEnterPassword') }],
  newPassword: [
    { required: true, message: tl('pleaseEnterNewPassword') },
    {
      pattern: PASSWORD_REG,
      message: `${tl('passwordRequirement1')}${tl('semicolon')}${tl('passwordRequirement2')}`,
      trigger: 'blur',
    },
    {
      validator: (_rule, value, callback) => {
        callback(value === record.oldPassword ? new Error(tl('noSameNewPwd')) : undefined)
      },
      trigger: 'blur',
    },
  ],
  repeatPassword: [
    { required: true, message: tl('pleaseEnterAConfirmationPassword') },
    {
      validator: (_rule, value, callback) => {
        callback(value !== record.newPassword ? new Error(tl('confirmNotMatch')) : undefined)
      },
      trigger: 'blur',
    },
  ],
}
const resetForm = () => {
  record.oldPassword = ''
  record.newPassword = ''
  record.repeatPassword = ''
}
const save = async () => {
  if (submitting.value || !(await formRef.value?.validate().catch(() => false))) {
    return
  }
  try {
    submitting.value = true
    await changePassword(props.username, {
      old_pwd: record.oldPassword,
      new_pwd: record.newPassword,
    })
    store.commit('SET_AFTER_CURRENT_USER_PWD_CHANGED', true)
    ElMessage.success(tl('changePassSuccess'))
    showDialog.value = false
    resetForm()
    toLogin()
  } catch (error) {
    // The HTTP interceptor displays request errors.
  } finally {
    submitting.value = false
  }
}
</script>
