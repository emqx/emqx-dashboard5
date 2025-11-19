<template>
  <el-dialog
    :title="isEdit ? tl('edit') : tl('add')"
    width="480px"
    v-model="dialogVisible"
    destroy-on-close
    @open="handleOpen"
    @close="handleClose"
  >
    <el-form
      ref="recordForm"
      :model="record"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item prop="user_id" :label="getFiledLabel(field)">
        <el-input v-model="record.user_id" :disabled="isEdit" />
      </el-form-item>
      <el-form-item prop="password" :label="t('General.password')">
        <el-input
          v-model="record.password"
          type="password"
          show-password
          autocomplete="one-time-code"
        />
      </el-form-item>
      <el-form-item>
        <div class="border-checkbox">
          <el-checkbox v-model="record.is_superuser" :label="t('Auth.isSuperuser')" />
          <p class="checkbox-note">
            {{ t('Auth.isSuperuserDesc') }}
          </p>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-align-footer">
        <CancelButton @click="dialogVisible = false" />
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          :loading="saveLoading"
          @click="save"
        >
          {{ isEdit ? tl('update') : tl('save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { createAuthnUsers, updateAuthnUser } from '@/api/auth'
import { addGatewayUserManagement, updateGatewayUser } from '@/api/gateway'
import useBuiltInDatabaseAuthn from '@/hooks/Auth/useBuiltInDatabaseAuthn'
import { AuthnUser, DataManagerItem } from '@/types/auth'
import type { FormInstance } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  authnId: string
  field: 'username' | 'clientid'
  user?: AuthnUser
  gateway?: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save'): void
}>()

const dialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const isEdit = computed(() => !!props.user)

const { t, tl } = useI18nTl('Base')

const record = ref<DataManagerItem>({} as DataManagerItem)
const handleOpen = () => {
  if (props.user) {
    record.value = { ...props.user, password: '' }
  }
}

const recordForm = useTemplateRef<FormInstance>('recordForm')
const rules = computed(() => {
  const message =
    props.field === 'clientid' ? t('Auth.pleaseEnterClientID') : t('Auth.pleaseEnterUsername')
  const ret = {
    user_id: [{ required: true, message, trigger: 'blur' }],
    password: [{ required: true, message: t('General.pleaseEnterPassword') }],
  }
  return ret
})

const createRawUserForm = () => ({
  user_id: '',
  password: '',
  is_superuser: false,
})
const handleClose = () => {
  record.value = createRawUserForm()
}

const { getFiledLabel } = useBuiltInDatabaseAuthn()

const saveLoading = ref(false)
const save = async () => {
  const validation = await recordForm.value?.validate()
  if (!validation) {
    return
  }
  saveLoading.value = true
  if (isEdit.value) {
    handleUpdate()
  } else {
    handleAdd()
  }
}

const handleAdd = async function () {
  let res
  try {
    if (props.gateway) {
      res = await addGatewayUserManagement(props.gateway, record.value)
    } else {
      res = await createAuthnUsers(props.authnId, record.value)
    }
    if (res) {
      dialogVisible.value = false
      ElMessage.success(t('Base.createSuccess'))
      record.value = {
        user_id: '',
        password: '',
        is_superuser: false,
      }
    }
    emit('save')
  } catch (error) {
    //
  } finally {
    saveLoading.value = false
  }
}

const handleUpdate = async function () {
  const { password, is_superuser, user_id } = record.value
  const data = {
    password: password,
    is_superuser: is_superuser,
  }
  let res
  if (props.gateway) {
    res = await updateGatewayUser(props.gateway, user_id, data)
  } else {
    res = await updateAuthnUser(props.authnId, user_id, data)
  }
  if (res) {
    dialogVisible.value = false
    saveLoading.value = false
    ElMessage.success(t('Base.updateSuccess'))
    emit('save')
  }
}
</script>

<style lang="scss" scoped>
.border-checkbox {
  margin-top: 16px;
}
</style>
