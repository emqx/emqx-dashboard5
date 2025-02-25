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
        {{ t('General.enableMAFTip') }}
      </el-alert>
      <div class="buttons">
        <el-button type="primary" @click="enableMFA">{{ tl('enableMFA') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { deleteUserMfa, updateUserMfa } from '@/api/function'
import useI18nTl from '@/hooks/useI18nTl'
import { useMFAMethods } from '@/hooks/useMFA'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { type User, UserMFA } from '@/types/typeAlias'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  user: User
}>()
const emit = defineEmits(['update:modelValue', 'submitted'])

const { t, tl } = useI18nTl('General')

const { mfaOptions, isMFAEnabled, getMFAMethodLabel } = useMFAMethods()
const withMFA = computed(() => isMFAEnabled(props.user.mfa ?? ''))

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
  }
})

const initData = () => {
  submitLoading.value = false
  selectedMFA.value = defaultMFA
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

const selectedMFA = ref(defaultMFA)
const enableMFA = async () => {
  try {
    submitLoading.value = true
    const { username } = props.user
    if (!username) {
      return
    }
    await updateUserMfa(username, { mechanism: selectedMFA.value })
    ElMessage.success(t('Base.enableSuccess'))
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
    const { username } = props.user
    if (!username) {
      return
    }
    await operationWarning(t('General.confirmDisableMFA'))
    submitLoading.value = true
    await deleteUserMfa(username)
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
