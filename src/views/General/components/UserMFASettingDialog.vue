<template>
  <el-dialog
    :title="tl('mfaSettings')"
    v-model="showDialog"
    width="400px"
    class="mfa-setting-dialog"
    destroy-on-close
  >
    <template v-if="withMFA">
      <p>{{ t('General.currentMFA') }}: {{ props.user.mfa }}</p>
      <div class="buttons">
        <el-button type="primary" plain :loading="submitLoading" @click="resetTOTPSecret">
          {{ tl('resetTOTPSecret') }}
        </el-button>
        <el-button type="danger" plain :loading="submitLoading" @click="deleteMFA">
          {{ tl('disableMFA') }}
        </el-button>
      </div>
    </template>
    <template v-else>
      <el-select v-model="selectedMFA">
        <el-option v-for="item in mfaOptions" :key="item" :value="item" :label="item" />
      </el-select>
      <div class="buttons">
        <el-button type="primary" @click="enableMFA">{{ tl('enableMFA') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { deleteUserMfa, updateUserMfa } from '@/api/function'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { type User, UserMFA } from '@/types/typeAlias'
import { ElMessage } from 'element-plus'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  user: User
}>()
const emit = defineEmits(['update:modelValue', 'submitted'])

const { t, tl } = useI18nTl('General')

const noMFAValues = [UserMFA.disabled, UserMFA.none]
const withMFA = computed(() => props.user.mfa && !noMFAValues.includes(props.user.mfa as any))

const mfaOptions = Object.values(UserMFA).reduce((acc: Array<string>, value: any) => {
  if (noMFAValues.includes(value)) {
    return acc
  }
  acc.push(value)
  return acc
}, [])

const submitLoading = ref(false)

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, async (value: boolean) => {
  if (!value) {
    initData()
  }
})

const initData = () => {
  submitLoading.value = false
  selectedMFA.value = mfaOptions[0]
}

const resetTOTPSecret = async () => {
  try {
    await operationWarning(tl('confirmResetTOTPSecret'))
    const { username } = props.user
    if (!username) {
      return
    }
    submitLoading.value = true
    await updateUserMfa(username, { mechanism: UserMFA.totp })
    ElMessage.success(t('Base.resetSuccess'))
    showDialog.value = false
  } catch (error) {
    //
  } finally {
    submitLoading.value = false
  }
}

const selectedMFA = ref(mfaOptions[0])
const enableMFA = async () => {
  try {
    submitLoading.value = true
    const { username } = props.user
    if (!username) {
      return
    }
    await updateUserMfa(username, { mechanism: selectedMFA.value })
    ElMessage.success(t('Base.enableSuccess'))
    showDialog.value = false
  } catch (error) {
    //
  } finally {
    submitLoading.value = false
  }
}

const { operationWarning } = useOperationConfirm()
const deleteMFA = async () => {
  try {
    const { username } = props.user
    if (!username) {
      return
    }
    await operationWarning(t('General.confirmDisableMFA'))
    submitLoading.value = true
    await deleteUserMfa(username)
    ElMessage.success(tl('deleteMFA'))
    showDialog.value = false
  } catch (error) {
    //
  } finally {
    submitLoading.value = false
  }
}
</script>

<style lang="scss">
.mfa-setting-dialog {
  .buttons {
    margin-top: 12px;
  }
}
</style>
