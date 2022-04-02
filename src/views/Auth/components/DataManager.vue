<template>
  <div class="data-manager">
    <div class="section-header">
      <div class="searchbar">
        <el-space wrap :size="20">
          <el-input
            v-model="searchVal.user_id"
            clearable
            :placeholder="getFiledLabel(field)"
          ></el-input>
          <el-select
            v-model="searchVal.is_superuser"
            clearable
            :placeholder="$t('Auth.isSuperuser')"
            @clear="searchVal.is_superuser = null"
          >
            <el-option :value="true" :label="$t('Base.yes')"></el-option>
            <el-option :value="false" :label="$t('Base.no')"></el-option>
          </el-select>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            {{ $t('Base.search') }}
          </el-button>
          <el-button @click="handleResetSearch">
            {{ $t('Base.reset') }}
          </el-button>
        </el-space>
      </div>
      <div>
        <el-button type="primary" :icon="Plus" @click="addCommand">
          {{ $t('Base.add') }}
        </el-button>
      </div>
    </div>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="user_id" :label="getFiledLabel(field)"></el-table-column>
      <el-table-column prop="is_superuser" :label="$t('Auth.isSuperuser')">
        <template #default="{ row }">
          {{ row.is_superuser ? $t('Base.yes') : $t('Base.no') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button @click="handleEdit(row)">
            {{ $t('Base.edit') }}
          </el-button>
          <el-button plain type="danger" @click="handleDelete(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination v-model:metaData="pageMeta" @loadPage="loadData"></common-pagination>
    </div>

    <el-dialog
      :title="isEdit ? $t('Base.edit') : $t('Base.add')"
      width="480px"
      v-model="dialogVisible"
      @open="handleDialogOpen"
    >
      <el-form ref="recordForm" :model="record" :rules="getRules()" label-position="top">
        <el-form-item prop="user_id" :label="getFiledLabel(field)">
          <el-input v-model="record.user_id" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item prop="password" :label="$t('General.password')">
          <el-input
            v-model="record.password"
            type="password"
            autocomplete="new-password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div>
            <el-checkbox
              v-model="record.is_superuser"
              :label="$t('Auth.isSuperuser')"
              border
            ></el-checkbox>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button @click="dialogVisible = false">
            {{ $t('Base.cancel') }}
          </el-button>

          <el-button type="primary" :loading="saveLoading" @click="save">
            {{ isEdit ? $t('Base.update') : $t('Base.save') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, PropType, reactive } from 'vue'
import { loadAuthnUsers, createAuthnUsers, deleteAuthnUser, updateAuthnUser } from '@/api/auth'
import {
  getGatewayUserManagement,
  addGatewayUserManagement,
  updateGatewayUser,
  deleteGatewayUser,
} from '@/api/gateway'
import { useRoute } from 'vue-router'
import commonPagination from '@/components/commonPagination.vue'
import { ElMessageBox as MB, ElMessage as M } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Plus, Search } from '@element-plus/icons-vue'
import { DataManagerItem } from '@/types/auth'

export default defineComponent({
  components: { commonPagination },

  name: 'DataManager',
  props: {
    field: {
      type: String as PropType<'username' | 'clientid'>,
      required: true,
      default: 'username',
    },
    gateway: {
      type: String,
      required: false,
      default: '',
    },
  },
  setup(prop) {
    const { t } = useI18n()
    const pageMeta = ref({})
    let record = ref<DataManagerItem>({
      user_id: '',
      password: '',
      is_superuser: false,
    })
    const tableData = ref([])
    const lockTable = ref(false)
    const dialogVisible = ref(false)
    const route = useRoute()
    const recordForm = ref()
    const isEdit = ref(false)
    const saveLoading = ref(false)
    const searchVal = reactive({
      user_id: '',
      is_superuser: null,
    })
    const id = computed(function (): string {
      return route.params.id as string
    })

    const loadData = async (params = {}) => {
      const sendParams = {
        ...pageMeta.value,
        ...params,
      }
      Reflect.deleteProperty(sendParams, 'count')

      lockTable.value = true
      let res
      if (prop.gateway) {
        res = await getGatewayUserManagement(prop.gateway, sendParams)
      } else {
        res = await loadAuthnUsers(id.value, sendParams)
      }
      if (res) {
        tableData.value = res.data
        pageMeta.value = res?.meta
      } else {
        tableData.value = []
        pageMeta.value = {}
      }
      lockTable.value = false
    }
    onMounted(loadData)
    const getRules = function () {
      let message = t('Auth.pleaseEnterUsername')
      if (prop.field === 'clientid') {
        message = t('Auth.pleaseEnterClientID')
      }
      const rules = {
        user_id: [{ required: true, message, trigger: 'blur' }],
        password: [{ required: true, message: t('General.pleaseEnterPassword') }],
      }
      if (isEdit.value) {
        Reflect.deleteProperty(rules, 'user_id')
      }
      return rules
    }
    const addCommand = () => {
      isEdit.value = false
      dialogVisible.value = true
    }
    const handleEdit = (row: DataManagerItem) => {
      dialogVisible.value = true
      isEdit.value = true
      record.value = {
        user_id: row.user_id,
        is_superuser: row.is_superuser,
        password: '',
      }
    }
    const handleDelete = (row: DataManagerItem) => {
      MB.confirm(t('Base.confirmDelete'), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
        .then(async () => {
          if (prop.gateway) {
            await deleteGatewayUser(prop.gateway, row.user_id)
          } else {
            await deleteAuthnUser(id.value, row.user_id)
          }
          loadData({ page: 1 })
        })
        .catch(() => {
          // cancel
        })
    }
    const save = async () => {
      let validation = await recordForm.value.validate()
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
        if (prop.gateway) {
          res = await addGatewayUserManagement(prop.gateway, record.value)
        } else {
          res = await createAuthnUsers(id.value, record.value)
        }
        if (res) {
          dialogVisible.value = false
          saveLoading.value = false
          M.success(t('Base.createSuccess'))
          record.value = {
            user_id: '',
            password: '',
            is_superuser: false,
          }
        }
        loadData()
      } catch (error) {
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
      if (prop.gateway) {
        res = await updateGatewayUser(prop.gateway, user_id, data)
      } else {
        res = await updateAuthnUser(id.value, user_id, data)
      }
      if (res) {
        dialogVisible.value = false
        saveLoading.value = false
        M.success(t('Base.updateSuccess'))
        loadData()
      }
    }
    const getFiledLabel = (field: 'clientid' | 'username') => {
      const fieldMap = {
        clientid: 'Client ID',
        username: 'Username',
      }
      return fieldMap[field]
    }
    const handleDialogOpen = () => {
      recordForm.value?.clearValidate()
      recordForm.value?.resetFields()
    }
    const handleSearch = () => {
      const page = 1
      const { user_id, is_superuser } = searchVal
      if (user_id !== '' || is_superuser !== null) {
        const searchKey = `like_${prop.field}`
        loadData({
          [searchKey]: searchVal.user_id === '' ? null : user_id,
          is_superuser: is_superuser,
          page,
        })
      } else {
        loadData({ page })
      }
    }
    const handleResetSearch = () => {
      searchVal.user_id = ''
      searchVal.is_superuser = null
      loadData({ page: 1 })
    }
    return {
      Plus,
      Search,
      id,
      dialogVisible,
      tableData,
      lockTable,
      record,
      recordForm,
      pageMeta,
      isEdit,
      saveLoading,
      searchVal,
      handleSearch,
      handleResetSearch,
      handleDialogOpen,
      loadData,
      save,
      addCommand,
      handleEdit,
      handleDelete,
      getRules,
      getFiledLabel,
    }
  },
})
</script>

<style lang="scss" scoped>
.data-manager {
  .searchbar {
    .el-input {
      width: 260px;
    }
  }
  .el-checkbox.is-bordered {
    margin: 0;
    padding: 0 30px;
  }
}
</style>
