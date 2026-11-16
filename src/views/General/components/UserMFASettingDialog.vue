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
      <p v-if="!mfaStateUnknown">
        {{ t('General.currentMFA') }}: {{ getMFAMethodLabel(props.user?.mfa ?? '') }}
      </p>
    </el-card>
    <template v-if="mfaStateUnknown">
      <el-alert type="info" :closable="false">
        {{ tl('currentEnableUserMFATip') }}
      </el-alert>
      <div class="buttons">
        <el-button type="primary" plain :loading="submitLoading" @click="resetTOTPSecret">
          {{ tl('enableOrResetMFA') }}
        </el-button>
        <el-button type="danger" plain :loading="submitLoading" @click="deleteMFA">
          {{ tl('disableMFA') }}
        </el-button>
      </div>
    </template>
    <template v-else-if="withMFA">
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
        {{ selfService ? tl('currentEnableUserMFATip') : tl('enableMAFTip') }}
      </el-alert>
      <div class="buttons">
        <el-button type="primary" :loading="submitLoading" @click="enableMFA">
          {{ tl('enableMFA') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { deleteUserMfa, updateUserMfa } from '@/api/function'
import { toLogin } from '@/router'
import { getSSOBackend } from '@/api/sso'
import { UserRole } from '@/types/enum'
import { type User, UserMFA } from '@/types/typeAlias'

const props = defineProps<{
  modelValue: boolean
  user: User
  selfService?: boolean
}>()
const emit = defineEmits(['update:modelValue', 'submitted'])

const { t, tl } = useI18nTl('General')

const store = useStore()
const currentUser = computed(() => store.state.user)
const isCurrentAccount = computed(
  () =>
    props.user.username === currentUser.value.username &&
    (props.user.backend || 'local') === (store.state.loginBackend || 'local'),
)
const mfaStateUnknown = computed(() => props.selfService && props.user.mfa === undefined)
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
  () =>
    !props.selfService &&
    !isCurrentUserAdmin.value &&
    isSSOUser.value &&
    isSSOBackendMfaEnforced.value,
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
  if (props.selfService || !isSSOUser.value || !props.user?.backend) {
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
    await operationWarning(
      mfaStateUnknown.value ? tl('confirmEnableOrResetMFA') : tl('confirmResetTOTPSecret'),
    )
    const { username, backend } = props.user
    if (!username) {
      return
    }
    submitLoading.value = true
    await updateUserMfa(username, { mechanism: UserMFA.totp }, backend ? { backend } : undefined)
    ElMessage.success(t(props.selfService ? 'Base.updateSuccess' : 'Base.resetSuccess'))
    if (isCurrentAccount.value) {
      showDialog.value = false
      toLogin()
      return
    }
    emit('submitted')
    showDialog.value = false
  } catch (error) {
    //
  } finally {
    submitLoading.value = false
  }
}

const selectedMFA = ref(defaultMFA)
const enableMFA = async () => {
  try {
    submitLoading.value = true
    const { username, backend } = props.user
    if (!username) {
      return
    }
    await updateUserMfa(username, { mechanism: selectedMFA.value }, { backend })
    ElMessage.success(t('Base.enableSuccess'))
    if (isCurrentAccount.value) {
      showDialog.value = false
      toLogin()
      return
    }
    emit('submitted')
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
    if (isCurrentAccount.value) {
      store.commit('UPDATE_USER_INFO', { ...currentUser.value, mfaEnabled: false })
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
