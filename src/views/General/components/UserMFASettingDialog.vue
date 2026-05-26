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
      <el-alert v-if="disableMfaBlocked" type="warning" :closable="false" class="mfa-alert">
        {{ t('General.disableMFAForbiddenBySSO') }}
      </el-alert>
      <div class="buttons">
        <el-button type="primary" plain :loading="submitLoading" @click="resetTOTPSecret">
          {{ tl('resetTOTPSecret') }}
        </el-button>
        <el-button
          type="danger"
          plain
          :loading="submitLoading"
          :disabled="disableMfaBlocked || ssoConfigLoading"
          @click="deleteMFA"
        >
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
import { deleteUserMfa, updateUserMfa } from '@/api/function'
import { getSSOBackend } from '@/api/sso'
import { UserRole } from '@/types/enum'
import { type User, UserMFA } from '@/types/typeAlias'

const props = defineProps<{
  modelValue: boolean
  user: User
  isCurrentUser: boolean
}>()
const emit = defineEmits(['update:modelValue', 'submitted'])

const { t, tl } = useI18nTl('General')

const store = useStore()
const currentUser = computed(() => store.state.user)
const isCurrentUserAdmin = computed(() => currentUser.value.role === UserRole.Admin)

const { mfaOptions, isMFAEnabled, getMFAMethodLabel } = useMFAMethods()
const withMFA = computed(() => isMFAEnabled(props.user.mfa ?? ''))
const isSSOUser = computed(() => !!props.user?.backend && props.user.backend !== 'local')
const ssoConfigLoading = ref(false)
const ssoBackendConfig = ref<Record<string, any> | null>(null)
const isSSOBackendMfaEnforced = computed(
  () => !!(ssoBackendConfig.value?.force_mfa || ssoBackendConfig.value?.enforce_mfa),
)
const disableMfaBlocked = computed(
  () => !isCurrentUserAdmin.value && isSSOUser.value && isSSOBackendMfaEnforced.value,
)

const defaultMFA = mfaOptions[0].value

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
    return
  }
  await loadSSOBackendConfig()
})

const initData = () => {
  submitLoading.value = false
  selectedMFA.value = defaultMFA
  ssoConfigLoading.value = false
  ssoBackendConfig.value = null
}

const loadSSOBackendConfig = async () => {
  if (!isSSOUser.value || !props.user?.backend) {
    ssoBackendConfig.value = null
    return
  }
  try {
    ssoConfigLoading.value = true
    ssoBackendConfig.value = (await getSSOBackend(props.user.backend as any)) as Record<string, any>
  } catch (error) {
    ssoBackendConfig.value = null
  } finally {
    ssoConfigLoading.value = false
  }
}

const resetTOTPSecret = async () => {
  try {
    await operationWarning(tl('confirmResetTOTPSecret'))
    const { username, backend } = props.user
    if (!username) {
      return
    }
    submitLoading.value = true
    await updateUserMfa(username, { mechanism: UserMFA.totp }, backend ? { backend } : undefined)
    ElMessage.success(t('Base.resetSuccess'))
    emit('submitted')
    showDialog.value = false
  } catch (error) {
    //
  } finally {
    submitLoading.value = false
  }
}

const selectedMFA = ref(defaultMFA)
const { handleLogOut } = useLogOut()
const enableMFA = async () => {
  try {
    submitLoading.value = true
    const { username, backend } = props.user
    if (!username) {
      return
    }
    await updateUserMfa(username, { mechanism: selectedMFA.value }, { backend })
    ElMessage.success(t('Base.enableSuccess'))
    emit('submitted')
    showDialog.value = false
    submitLoading.value = false
    if (props.isCurrentUser) {
      await handleLogOut()
    }
  } catch (error) {
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
    if (disableMfaBlocked.value) {
      ElMessage.warning(t('General.disableMFAForbiddenBySSO'))
      return
    }
    await operationWarning(t('General.confirmDisableMFA'))
    submitLoading.value = true
    if (isSSOUser.value) {
      await deleteUserMfa(username, { reset: false, backend })
    } else {
      await deleteUserMfa(username)
    }
    ElMessage.success(t('Base.disabledSuccess'))
    emit('submitted')
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
