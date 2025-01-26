<template>
  <div class="users app-wrapper">
    <div class="section-header">
      <div></div>
      <CreateButton @click="showDialog()" />
    </div>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="username" :label="tl('username')" />
      <el-table-column prop="description" :label="t('Base.note')" />
      <el-table-column :label="t('Dashboard.role')">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.role, userRoleOptions) }}
        </template>
      </el-table-column>
      <el-table-column v-if="hasSSOEnabled" :label="tl('source')">
        <template #default="{ row }">
          {{ getSourceLabel(row.backend) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <TableButton :disabled="!$hasPermission('put')" @click="showDialog('edit', row)">
            {{ $t('Base.edit') }}
          </TableButton>
          <TableButton
            v-if="canChangePwd(row)"
            :disabled="!isCurrentUser(row.username) && !$hasPermission('put')"
            @click="showDialog('chPass', row)"
          >
            {{ tl('changePassword') }}
          </TableButton>
          <TableButton
            v-if="canChangePwd(row)"
            :disabled="!isCurrentUser(row.username) && !$hasPermission('post')"
            @click="openMfaSettingsDialog(row)"
          >
            {{ tl('mfaSettings') }}
          </TableButton>
          <TableButton
            :disabled="!$hasPermission('delete')"
            @click="deleteConfirm(row)"
            v-if="!isCurrentUser(row.username) && row.username !== 'admin'"
          >
            {{ $t('Base.delete') }}
          </TableButton>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="
        accessType === 'edit'
          ? tl('editorUser')
          : accessType === 'chPass'
            ? tl('changePassword')
            : tl('creatingUser')
      "
      v-model="dialogVisible"
      destroy-on-close
      width="650px"
    >
      <el-form
        ref="formCom"
        :model="record"
        :rules="rules"
        label-position="top"
        require-asterisk-position="right"
        @keyup.enter="save()"
      >
        <el-form-item v-if="accessType !== 'chPass'" prop="username" :label="tl('username')">
          <el-input
            v-model="record.username"
            :disabled="accessType === 'edit'"
            @change="trimUserName"
          />
        </el-form-item>
        <el-form-item v-if="accessType !== 'chPass'" :label="t('Base.note')">
          <el-input v-model="record.description" />
        </el-form-item>
        <el-form-item v-if="accessType !== 'edit'" prop="password" :label="tl('password')">
          <el-input
            v-model="record.password"
            type="password"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item v-if="accessType !== 'chPass'" :label="t('Dashboard.role')" prop="role">
          <el-select v-model="record.role">
            <el-option
              v-for="{ label, value, desc } in userRoleOptions"
              :key="value"
              :value="value"
              :label="label"
            >
              {{ label }}
              <InfoTooltip :content="desc" />
            </el-option>
          </el-select>
        </el-form-item>
        <div v-if="accessType === 'chPass'">
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
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button @click="closeDialog">
            {{ $t('Base.cancel') }}
          </el-button>

          <el-button
            type="primary"
            :disabled="!isCurrentUser(record.username) && !$hasPermission('post')"
            @click="save"
            :loading="submitLoading"
          >
            {{ accessType == 'create' ? $t('Base.create') : $t('Base.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
  <UserMFASettingDialog v-model="isMfaSettingsDialogVisible" :user="record" />
</template>

<script setup>
import { changePassword, createUser, destroyUser, loadUser, updateUser } from '@/api/function.ts'
import { PASSWORD_REG } from '@/common/constants'
import { getLabelFromValueInOptionList } from '@/common/tools.ts'
import InfoTooltip from '@/components/InfoTooltip.vue'
import useSSO, { useSSOBackendsLabel } from '@/hooks/SSO/useSSO'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl.ts'
import { UserRole } from '@/types/enum.ts'
import { ElMessage, ElMessageBox } from 'element-plus'
import { pick } from 'lodash'
import { computed, onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import useRole from '@/hooks/SSO/useRole'
import UserMFASettingDialog from './components/UserMFASettingDialog.vue'

const SOURCE_LOCAL = 'local'

const store = useStore()
const { tl, t } = useI18nTl('General')

const dialogVisible = ref(false)
const tableData = ref([])
const lockTable = ref(false)
const accessType = ref('')
const record = ref({})
const submitLoading = ref(false)
const formCom = ref()

const { userRoleOptions } = useRole()

const { getBackendLabel } = useSSOBackendsLabel()
const getSourceLabel = (source) => (source === SOURCE_LOCAL ? tl('local') : getBackendLabel(source))

const { loadConfigPromise, hasSSOEnabled, getEnabledSSO } = useSSO()

const canChangePwd = ({ backend }) => backend === SOURCE_LOCAL

const validatePass = (rule, value, callback) => {
  if (value !== record.value.newPassword) {
    callback(new Error(tl('confirmNotMatch')))
  } else {
    callback()
  }
}

/**
 * is the new password same as the old password?
 */
const newPwdSameConfirm = (rule, value, callback) => {
  if (value === record.value.password) {
    callback(new Error(tl('noSameNewPwd')))
  } else {
    callback()
  }
}

const { createNoChineseRule, createRequiredRule } = useFormRules()
const pwdMismatchMsg =
  tl('passwordRequirement1') + tl('semicolon') + tl('passwordRequirement2').toLowerCase()
const rules = computed(() => {
  const ret = {
    username: [{ required: true, message: tl('enterOneUserName') }, ...createNoChineseRule()],
    role: createRequiredRule(t('Dashboard.role'), 'select'),
    password: [
      {
        required: true,
        message: tl('pleaseEnterPassword'),
        trigger: ['blur', 'change'],
      },
    ],
    newPassword: [
      {
        required: true,
        message: tl('pleaseEnterNewPassword'),
        trigger: ['blur', 'change'],
      },
      {
        pattern: PASSWORD_REG,
        message: pwdMismatchMsg,
        trigger: ['blur'],
      },
      {
        validator: newPwdSameConfirm,
        trigger: ['blur'],
      },
    ],
    repeatPassword: [
      {
        required: true,
        message: tl('pleaseEnterAConfirmationPassword'),
      },
      { validator: validatePass, trigger: ['blur', 'change'] },
    ],
  }
  if (accessType.value !== 'chPass') {
    ret.password.push({
      pattern: PASSWORD_REG,
      message: pwdMismatchMsg,
      trigger: ['blur'],
    })
  }
  return ret
})
const currentUser = computed(() => {
  return store.state.user
})

const loadData = async () => {
  lockTable.value = true
  try {
    await getEnabledSSO()
    tableData.value = await loadUser()
    if (loadConfigPromise) {
      await loadConfigPromise
    }
  } catch (error) {
    //
  } finally {
    lockTable.value = false
  }
}

const generateRawForm = () => ({
  username: '',
  description: '',
  role: UserRole.Admin,
  password: '',
})

const isCurrentUser = (user) => user === currentUser.value.username

const showDialog = (type = 'create', item = {}) => {
  dialogVisible.value = true
  formCom.value?.resetFields()

  if (type === 'edit') {
    record.value = Object.assign({}, item)
  } else if (type === 'chPass') {
    record.value = {
      username: item.username,
      password: '',
      newPassword: '',
      repeatPassword: '',
    }
  } else {
    record.value = generateRawForm()
  }
  accessType.value = type
}

const isMfaSettingsDialogVisible = ref(false)
const openMfaSettingsDialog = (item) => {
  record.value = item
  isMfaSettingsDialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
}

const trimUserName = () => {
  record.value.username = record.value.username.trim()
}

const getBackend = (backend) => (backend === SOURCE_LOCAL ? undefined : backend)

const save = async () => {
  try {
    await formCom.value.validate()
    submitLoading.value = true
    const { username } = record.value
    if (accessType.value === 'edit') {
      const backend = getBackend(record.value.backend)
      await updateUser(username, pick(record.value, ['description', 'role']), backend)
      ElMessage.success(t('Base.updateSuccess'))
    } else if (accessType.value === 'chPass') {
      const pass = {
        new_pwd: record.value.newPassword,
        old_pwd: record.value.password,
      }
      await changePassword(username, pass)
      ElMessage.success(tl('changePassSuccess'))
      if (isCurrentUser(username)) {
        store.commit('SET_AFTER_CURRENT_USER_PWD_CHANGED', true)
      }
    } else {
      await createUser(record.value)
      ElMessage.success(tl('createUserSuccess'))
    }
    loadData()
    dialogVisible.value = false
  } catch (error) {
    //
  } finally {
    submitLoading.value = false
  }
}

const deleteConfirm = async (item) => {
  if (isCurrentUser(item.username)) {
    return
  }
  try {
    await ElMessageBox.confirm(tl('confirmDeleteUser'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    const backend = getBackend(item.backend)
    await destroyUser(item.username, backend)
    ElMessage.success(t('Base.deleteSuccess'))
    loadData()
  } catch (error) {
    //
  }
}

onBeforeMount(async () => {
  await loadData()
})
</script>
