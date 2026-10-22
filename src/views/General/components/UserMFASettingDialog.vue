<template>
  <el-dialog
    :title="tl('mfaSettings')"
    v-model="showDialog"
    width="400px"
    class="mfa-setting-dialog"
    destroy-on-close
  >
    <el-card class="info-card" shadow="never">
      <p>{{ tl('username') }}: {{ props.user?.username ?? '' }}</p>
      <p>{{ t('General.currentMFA') }}: {{ getMFAMethodLabel(props.user?.mfa ?? '') }}</p>
    </el-card>
    <template v-if="withMFA">
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
        <el-option
          v-for="{ value, label } in mfaOptions"
          :key="value"
          :value="value"
          :label="label"
        />
      </el-select>
      <el-alert type="info" :closable="false">
        {{ isCurrentUser ? t('General.currentEnableUserMFATip') : t('General.enableMAFTip') }}
      </el-alert>
      <div class="buttons">
        <el-button type="primary" @click="enableMFA">{{ tl('enableMFA') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  deleteCurrentUserMfa,
  deleteUserMfa,
  updateCurrentUserMfa,
  updateUserMfa,
} from '@/api/function'
import { toLogin } from '@/router'
import { type CurrentUserMFAUpdate, type User, UserMFA } from '@/types/typeAlias'

const props = defineProps<{
  modelValue: boolean
  user: User
  isCurrentUser: boolean
}>()
const emit = defineEmits(['update:modelValue', 'submitted'])

const { t, tl } = useI18nTl('General')

const { mfaOptions, isMFAEnabled, getMFAMethodLabel } = useMFAMethods()
const withMFA = computed(() => isMFAEnabled(props.user.mfa ?? ''))
const isSSOUser = computed(() => !!props.user?.backend && props.user.backend !== 'local')

const defaultMFA = UserMFA.totp

const submitLoading = ref(false)

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, (value: boolean) => {
  if (!value) {
    submitLoading.value = false
    selectedMFA.value = defaultMFA
  }
})

const resetTOTPSecret = async () => {
  try {
    await operationWarning(tl('confirmResetTOTPSecret'))
    const { username, backend } = props.user
    if (!username) {
      return
    }
    submitLoading.value = true
    if (props.isCurrentUser) {
      await updateCurrentUserMfa({ mechanism: UserMFA.totp })
    } else {
      await updateUserMfa(username, { mechanism: UserMFA.totp }, backend ? { backend } : undefined)
    }
    ElMessage.success(t('Base.resetSuccess'))
    showDialog.value = false
    if (props.isCurrentUser) {
      toLogin()
      return
    }
    emit('submitted')
  } catch (error) {
    //
  } finally {
    submitLoading.value = false
  }
}

const selectedMFA = ref<CurrentUserMFAUpdate['mechanism']>(defaultMFA)
const enableMFA = async () => {
  try {
    submitLoading.value = true
    const { username, backend } = props.user
    if (!username) {
      return
    }
    if (props.isCurrentUser) {
      await updateCurrentUserMfa({ mechanism: selectedMFA.value })
    } else {
      await updateUserMfa(username, { mechanism: selectedMFA.value }, { backend })
    }
    ElMessage.success(t('Base.enableSuccess'))
    showDialog.value = false
    if (props.isCurrentUser) {
      toLogin()
      return
    }
    emit('submitted')
  } catch (error) {
    //
  } finally {
    submitLoading.value = false
  }
}

const { operationWarning } = useOperationConfirm()
const deleteMFA = async () => {
  try {
    const { username, backend } = props.user
    if (!username) {
      return
    }
    await operationWarning(t('General.confirmDisableMFA'))
    submitLoading.value = true
    if (props.isCurrentUser) {
      await deleteCurrentUserMfa()
    } else if (isSSOUser.value) {
      await deleteUserMfa(username, { reset: false, backend })
    } else {
      await deleteUserMfa(username)
    }
    ElMessage.success(t('Base.disabledSuccess'))
    showDialog.value = false
    if (props.isCurrentUser) {
      toLogin()
      return
    }
    emit('submitted')
  } catch (error) {
    //
  } finally {
    submitLoading.value = false
  }
}
</script>

<style lang="scss">
.mfa-setting-dialog {
  .mfa-alert {
    margin-bottom: 12px;
  }
  .buttons {
    margin-top: 12px;
  }
  .info-card {
    margin-bottom: 12px;
    .el-card__body {
      padding: 0 12px;
    }
  }
  .el-select {
    margin-bottom: 12px;
  }
}
</style>
