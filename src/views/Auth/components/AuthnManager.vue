<template>
  <div class="authn-manager">
    <div class="section-header">
      <div class="searchbar">
        <el-space wrap :size="20">
          <el-input
            v-model="searchVal.user_id"
            clearable
            :placeholder="getFiledLabel(field)"
            @keyup.enter="resetPageAndLoadData"
          />
          <el-select
            v-model="searchVal.is_superuser"
            clearable
            :placeholder="$t('Auth.isSuperuser')"
            @clear="searchVal.is_superuser = null"
          >
            <el-option :value="true" :label="$t('Base.yes')" />
            <el-option :value="false" :label="$t('Base.no')" />
          </el-select>
          <el-button type="primary" plain :icon="Search" @click="resetPageAndLoadData">
            {{ $t('Base.search') }}
          </el-button>
          <el-button type="primary" :icon="RefreshRight" @click="handleResetSearch">
            {{ $t('Base.refresh') }}
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
      <el-table-column prop="user_id" :label="getFiledLabel(field)">
        <template #default="{ row }">
          {{ replaceSpaceForHTML(row.user_id) }}
        </template>
      </el-table-column>
      <el-table-column prop="is_superuser" :label="$t('Auth.isSuperuser')">
        <template #default="{ row }">
          {{ row.is_superuser ? $t('Base.yes') : $t('Base.no') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button @click="handleEdit(row)" size="small">
            {{ $t('Base.edit') }}
          </el-button>
          <el-button plain type="danger" @click="handleDelete(row)" size="small">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination v-model:metaData="pageMeta" @loadPage="loadData" />
    </div>

    <el-dialog
      :title="isEdit ? $t('Base.edit') : $t('Base.add')"
      width="480px"
      v-model="dialogVisible"
      destroy-on-close
    >
      <el-form ref="recordForm" :model="record" :rules="getRules()" label-position="top">
        <el-form-item prop="user_id" :label="getFiledLabel(field)">
          <el-input v-model="record.user_id" :disabled="isEdit" />
        </el-form-item>
        <el-form-item prop="password" :label="$t('General.password')">
          <el-input v-model="record.password" type="password" autocomplete="new-password" />
        </el-form-item>
        <el-form-item>
          <div>
            <el-checkbox v-model="record.is_superuser" :label="$t('Auth.isSuperuser')" border />
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
import { Plus, Search, RefreshRight } from '@element-plus/icons-vue'
import { DataManagerItem } from '@/types/auth'
import { replaceSpaceForHTML } from '@/common/tools'

const createRawUserForm = () => ({
  user_id: '',
  password: '',
  is_superuser: false,
})

export default defineComponent({
  components: { commonPagination },

  name: 'AuthnManager',
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
    const pageMeta = ref({
      count: 0,
      limit: 20,
      page: 1,
    })
    let record = ref<DataManagerItem>(createRawUserForm())
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

    const loadData = async () => {
      const { user_id, is_superuser } = searchVal
      const sendParams = {
        ...pageMeta.value,
        like_user_id: searchVal.user_id === '' ? null : user_id,
        is_superuser: is_superuser,
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
        pageMeta.value = {
          count: 0,
          limit: 20,
          page: 1,
        }
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
      record.value = createRawUserForm()
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
          resetPageAndLoadData()
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

    const resetPageAndLoadData = () => {
      pageMeta.value.page = 1
      loadData()
    }

    const handleResetSearch = () => {
      searchVal.user_id = ''
      searchVal.is_superuser = null
      resetPageAndLoadData()
    }

    return {
      Plus,
      Search,
      RefreshRight,
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
      resetPageAndLoadData,
      handleResetSearch,
      loadData,
      save,
      addCommand,
      handleEdit,
      handleDelete,
      getRules,
      getFiledLabel,
      replaceSpaceForHTML,
    }
  },
})
</script>

<style lang="scss" scoped>
.authn-manager {
  .searchbar {
    height: 36px;
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
