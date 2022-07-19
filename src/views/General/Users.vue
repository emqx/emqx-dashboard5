<template>
  <div class="users app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" :icon="Plus" @click="showDialog()">
        {{ $t('Base.create') }}
      </el-button>
    </div>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="username" :label="$t('General.userName')" />
      <el-table-column prop="description" :label="$t('General.remark')" />
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="small" @click="showDialog('edit', row)">
            {{ $t('Base.edit') }}
          </el-button>
          <el-button size="small" @click="showDialog('chPass', row)">
            {{ $t('General.changePassword') }}
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
          ? $t('General.editorUser')
          : accessType === 'chPass'
          ? $t('General.changePassword')
          : $t('General.creatingUser')
      "
      v-model="dialogVisible"
      destroy-on-close
    >
      <el-form
        ref="recordForm"
        :model="record"
        :rules="rules"
        label-position="top"
        @keyup.enter="save()"
      >
        <el-form-item
          v-if="accessType !== 'chPass'"
          prop="username"
          :label="$t('General.userName')"
        >
          <el-input
            v-model="record.username"
            :disabled="accessType === 'edit'"
            @change="trimUserName"
          />
        </el-form-item>
        <el-form-item v-if="accessType !== 'chPass'" :label="$t('General.remark')">
          <el-input v-model="record.description" />
        </el-form-item>
        <el-form-item v-if="accessType !== 'edit'" prop="password" :label="$t('General.password')">
          <el-input v-model="record.password" type="password" autocomplete="new-password" />
        </el-form-item>
        <div v-if="accessType === 'chPass'">
          <el-form-item prop="newPassword" :label="$t('General.newPassword')">
            <el-input v-model="record.newPassword" type="password" autocomplete="new-password" />
          </el-form-item>
          <el-form-item prop="repeatPassword" :label="$t('General.confirmPassword')">
            <el-input v-model="record.repeatPassword" type="password" autocomplete="new-password" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button @click="closeDialog">{{ $t('Base.cancel') }}</el-button>

          <el-button type="primary" @click="save" :loading="submitLoading">
            {{ accessType == 'create' ? $t('Base.create') : $t('Base.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { loadUser, createUser, updateUser, destroyUser, changePassword } from '@/api/function'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'Users',

  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.record.newPassword) {
        callback(new Error(this.$t('General.confirmNotMatch')))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      tableData: [],
      lockTable: false,
      accessType: '',
      record: {},
      submitLoading: false,
      rules: {
        username: [{ required: true, message: this.$t('General.enterOneUserName') }],
        password: [
          {
            required: true,
            message: this.$t('General.pleaseEnterPassword'),
            trigger: ['blur', 'change'],
          },
          {
            min: 3,
            max: 32,
            message: this.$t('General.passwordLength'),
            trigger: ['blur', 'change'],
          },
        ],
        newPassword: [
          {
            required: true,
            message: this.$t('General.pleaseEnterNewPassword'),
            trigger: ['blur', 'change'],
          },
          {
            min: 3,
            max: 32,
            message: this.$t('General.passwordLength'),
            trigger: ['blur', 'change'],
          },
        ],
        repeatPassword: [
          {
            required: true,
            message: this.$t('General.pleaseEnterAConfirmationPassword'),
          },
          { validator: validatePass, trigger: ['blur', 'change'] },
        ],
      },
    }
  },

  setup() {
    const store = useStore()

    const currentUser = computed(() => {
      return store.state.user
    })
    return {
      Plus,
      currentUser,
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.lockTable = true
      let res = await loadUser().catch(() => {})
      if (res) {
        this.tableData = res
      }
      this.lockTable = false
    },
    showDialog(type = 'create', item = {}) {
      this.dialogVisible = true
      this.$refs?.recordForm?.resetFields()

      if (type === 'edit') {
        this.record = Object.assign({}, item)
        this.accessType = 'edit'
      } else if (type === 'chPass') {
        this.accessType = 'chPass'
        this.record = {
          username: item.username,
          password: '',
          newPassword: '',
          repeatPassword: '',
        }
      } else {
        this.record = {
          username: '',
          description: '',
          password: '',
        }
        this.accessType = 'create'
      }
    },
    closeDialog() {
      this.dialogVisible = false
    },

    trimUserName() {
      this.record.username = this.record.username.trim()
    },

    async save() {
      // const this = this;
      let validation = await this.$refs.recordForm.validate().catch(() => {})

      if (!validation) {
        return
      }
      this.submitLoading = true
      const { username } = this.record
      try {
        if (this.accessType === 'edit') {
          await updateUser(username, this.record)
          ElMessage.success(this.$t('Base.editSuccess'))
        } else if (this.accessType === 'chPass') {
          let pass = {
            new_pwd: this.record.newPassword,
            old_pwd: this.record.password,
          }
          await changePassword(username, pass)
          ElMessage.success(this.$t('General.changePassSuccess'))
        } else {
          await createUser(this.record)
          ElMessage.success(this.$t('General.createUserSuccess'))
        }
        this.loadData()
        this.dialogVisible = false
      } catch (error) {
        //
      } finally {
        this.submitLoading = false
      }
    },
    async deleteConfirm(item) {
      if (item.username === this.currentUser.username) {
        return
      }
      try {
        await this.$msgbox.confirm(this.$t('General.confirmDeleteUser'), {
          confirmButtonText: this.$t('Base.confirm'),
          cancelButtonText: this.$t('Base.cancel'),
          type: 'warning',
        })
        await destroyUser(item.username)
        ElMessage.success(this.$t('Base.deleteSuccess'))
        this.loadData()
      } catch (error) {
        //
      }
    },
  },
}
</script>
