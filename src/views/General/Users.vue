<template>
  <div class="users app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" :icon="Plus" @click="showDialog()">
        {{ $t('Base.create') }}
      </el-button>
    </div>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="username" :label="tl('username')" />
      <el-table-column prop="description" :label="t('Base.note')" />
      <el-table-column :label="t('Dashboard.role')">
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.role, roleOptions) }}
        </template>
      </el-table-column>
      <!-- TODO:SSO -->
      <el-table-column :label="tl('source')">
        <template #default="{ row }">
          {{ row.XXXXXXX }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="small" @click="showDialog('edit', row)">
            {{ $t('Base.edit') }}
          </el-button>
          <el-button v-if="canChangePwd(row)" size="small" @click="showDialog('chPass', row)">
            {{ tl('changePassword') }}
          </el-button>

          <el-button
            plain
            size="small"
            @click="deleteConfirm(row)"
            v-if="currentUser.username !== row.username"
          >
            {{ $t('Base.delete') }}
          </el-button>
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
      width="512px"
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
              v-for="{ label, value } in roleOptions"
              :key="value"
              :label="label"
              :value="value"
            />
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

          <el-button type="primary" @click="save" :loading="submitLoading">
            {{ accessType == 'create' ? $t('Base.create') : $t('Base.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { changePassword, createUser, destroyUser, loadUser, updateUser } from '@/api/function.ts'
import { PASSWORD_REG } from '@/common/constants'
import { getLabelFromValueInOptionList } from '@/common/tools.ts'
import useFormRules from '@/hooks/useFormRules'
import { querySSOConfig } from '@/api/sso.ts'
import useI18nTl from '@/hooks/useI18nTl.ts'
import { UserRole } from '@/types/enum.ts'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const { tl, t } = useI18nTl('General')

const dialogVisible = ref(false)
const tableData = ref([])
const lockTable = ref(false)
const accessType = ref('')
const record = ref({})
const submitLoading = ref(false)
const formCom = ref()

const roleOptions = [
  { label: tl('admin'), value: UserRole.Admin },
  { label: tl('readonly'), value: UserRole.Readonly },
]

const SSOConfig = ref({})
const getSSOConfig = async () => {
  try {
    SSOConfig.value = await querySSOConfig()
  } catch (error) {
    //
  }
}
getSSOConfig()

const canChangePwd = (user) => {
  // TODO:SSO
  return user.XXXXX
}

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
    tableData.value = await loadUser()
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

const closeDialog = () => {
  dialogVisible.value = false
}

const trimUserName = () => {
  record.value.username = record.value.username.trim()
}

const save = async () => {
  try {
    await formCom.value.validate()
    submitLoading.value = true
    const { username } = record.value
    if (accessType.value === 'edit') {
      await updateUser(username, record.value)
      ElMessage.success(t('Base.updateSuccess'))
    } else if (accessType.value === 'chPass') {
      let pass = {
        new_pwd: record.value.newPassword,
        old_pwd: record.value.password,
      }
      await changePassword(username, pass)
      ElMessage.success(tl('changePassSuccess'))
      if (username === currentUser.value.username) {
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
  if (item.username === currentUser.value.username) {
    return
  }
  try {
    await ElMessageBox.confirm(tl('confirmDeleteUser'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    await destroyUser(item.username)
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
