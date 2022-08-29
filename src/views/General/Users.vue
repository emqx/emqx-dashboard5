<template>
  <div class="users app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" :icon="Plus" @click="showDialog()">
        {{ $t('Base.create') }}
      </el-button>
    </div>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="username" :label="tl('userName')" />
      <el-table-column prop="description" :label="t('Base.note')" />
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="small" @click="showDialog('edit', row)">
            {{ $t('Base.edit') }}
          </el-button>
          <el-button size="small" @click="showDialog('chPass', row)">
            {{ tl('changePassword') }}
          </el-button>

          <el-button
            type="danger"
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
      :show-close="!isForChangeDefaultPwd"
      :close-on-click-modal="!isForChangeDefaultPwd"
    >
      <el-form
        ref="formCom"
        :model="record"
        :rules="rules"
        label-position="top"
        @keyup.enter="save()"
      >
        <el-form-item v-if="accessType !== 'chPass'" prop="username" :label="tl('userName')">
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
          <el-input v-model="record.password" type="password" autocomplete="new-password" />
        </el-form-item>
        <div v-if="accessType === 'chPass'">
          <el-form-item prop="newPassword" :label="tl('newPassword')">
            <el-input v-model="record.newPassword" type="password" autocomplete="new-password" />
          </el-form-item>
          <el-form-item prop="repeatPassword" :label="tl('confirmPassword')">
            <el-input v-model="record.repeatPassword" type="password" autocomplete="new-password" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button @click="closeDialog" v-if="!isForChangeDefaultPwd">
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
import { loadUser, createUser, updateUser, destroyUser, changePassword } from '@/api/function'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { computed, ref, onBeforeMount } from 'vue'
import useI18nTl from '@/hooks/useI18nTl.ts'
import { useHandlersInUsersPage } from '@/hooks/useChangePwdGuide.ts'

const store = useStore()
const { tl, t } = useI18nTl('General')

const dialogVisible = ref(false)
const tableData = ref([])
const lockTable = ref(false)
const accessType = ref('')
const record = ref({})
const submitLoading = ref(false)
const formCom = ref()

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
const rules = {
  username: [{ required: true, message: tl('enterOneUserName') }],
  password: [
    {
      required: true,
      message: tl('pleaseEnterPassword'),
      trigger: ['blur', 'change'],
    },
    {
      min: 3,
      max: 32,
      message: tl('passwordLength'),
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
      min: 3,
      max: 32,
      message: tl('passwordLength'),
      trigger: ['blur', 'change'],
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

const currentUser = computed(() => {
  return store.state.user
})

const loadData = async () => {
  lockTable.value = true
  let res = await loadUser().catch(() => {})
  if (res) {
    tableData.value = res
  }
  lockTable.value = false
}

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
    record.value = {
      username: '',
      description: '',
      password: '',
    }
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
      type: 'warning',
    })
    await destroyUser(item.username)
    ElMessage.success(t('Base.deleteSuccess'))
    loadData()
  } catch (error) {
    //
  }
}

const { isForChangeDefaultPwd, confirmForChangeDefaultPwdParam } = useHandlersInUsersPage({
  showDialog,
  tableData,
})

onBeforeMount(async () => {
  await loadData()
  confirmForChangeDefaultPwdParam()
})
</script>
