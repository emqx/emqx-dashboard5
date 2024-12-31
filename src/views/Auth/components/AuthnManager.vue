<template>
  <el-card class="authn-manager no-border">
    <div class="section-header space-between">
      <div class="add-funcs-container">
        <template v-if="mechanism === 'password_based'">
          <authn-users-import @uploadedData="loadData" />
        </template>
        <el-tooltip :content="$t('Base.add')" placement="top">
          <CreateButton class="icon-button" @click="addCommand"><span /></CreateButton>
        </el-tooltip>
      </div>

      <div class="searchbar">
        <el-space wrap :size="16">
          <el-input
            v-model="searchVal.user_id"
            clearable
            :placeholder="getFiledLabel(field)"
            @keyup.enter="resetPageAndLoadData"
            @clear="resetPageAndLoadData"
          />
          <el-select
            v-model="searchVal.is_superuser"
            clearable
            :placeholder="$t('Auth.isSuperuser')"
            @clear="resetIsSuperuser(), resetPageAndLoadData()"
          >
            <el-option :value="true" :label="$t('Base.yes')" />
            <el-option :value="false" :label="$t('Base.no')" />
          </el-select>
          <el-tooltip :content="$t('Base.search')" placement="top">
            <SearchButton no-text @click="resetPageAndLoadData" />
          </el-tooltip>
          <el-tooltip :content="$t('Base.refresh')" placement="top">
            <RefreshButton class="icon-button" no-text @click="loadData" />
          </el-tooltip>
        </el-space>
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
          <TableButton :disabled="!$hasPermission('put')" @click="handleEdit(row)">
            {{ $t('Base.edit') }}
          </TableButton>
          <TableButton :disabled="!$hasPermission('delete')" @click="handleDelete(row)">
            {{ $t('Base.delete') }}
          </TableButton>
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
      <el-form
        ref="recordForm"
        :model="record"
        :rules="getRules()"
        class="tong-form"
        label-width="120px"
      >
        <el-form-item prop="user_id" :label="getFiledLabel(field)">
          <el-input v-model="record.user_id" :disabled="isEdit" />
        </el-form-item>
        <el-form-item prop="password" :label="$t('General.password')">
          <el-input
            v-model="record.password"
            type="password"
            show-password
            autocomplete="one-time-code"
          />
        </el-form-item>
        <el-form-item>
          <div class="border-checkbox">
            <el-checkbox v-model="record.is_superuser" :label="$t('Auth.isSuperuser')" />
            <p class="checkbox-note">
              {{ $t('Auth.isSuperuserDesc') }}
            </p>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button @click="dialogVisible = false">
            {{ $t('Base.cancel') }}
          </el-button>

          <el-button
            type="primary"
            :disabled="!$hasPermission('post')"
            :loading="saveLoading"
            @click="save"
          >
            {{ isEdit ? $t('Base.update') : $t('Base.save') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts" setup>
import { createAuthnUsers, deleteAuthnUser, loadAuthnUsers, updateAuthnUser } from '@/api/auth'
import {
  addGatewayUserManagement,
  deleteGatewayUser,
  getGatewayUserManagement,
  updateGatewayUser,
} from '@/api/gateway'
import { replaceSpaceForHTML } from '@/common/tools'
import commonPagination from '@/components/commonPagination.vue'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import { DataManagerItem } from '@/types/auth'
import { ElMessage as M, ElMessageBox as MB } from 'element-plus'
import { computed, defineProps, onMounted, PropType, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AuthnUsersImport from './AuthnUsersImport.vue'

const createRawUserForm = () => ({
  user_id: '',
  password: '',
  is_superuser: false,
})

const prop = defineProps({
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
})

const { t } = useI18n()
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
  is_superuser: undefined,
})
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()

const id = computed(function (): string {
  return route.params.id as string
})

const reg = /^(?<mechanism>.+):.+$/
const mechanism = computed(() => {
  const matchRes = id.value?.match(reg)
  return matchRes ? matchRes.groups?.mechanism : ''
})

const loadData = async () => {
  const { user_id, is_superuser } = searchVal
  const sendParams = {
    ...pageParams.value,
    like_user_id: searchVal.user_id === '' ? null : user_id,
    is_superuser,
  }

  lockTable.value = true
  let res
  try {
    if (prop.gateway) {
      res = await getGatewayUserManagement(prop.gateway, sendParams)
    } else {
      res = await loadAuthnUsers(id.value, sendParams)
    }
    if (res) {
      tableData.value = res.data
      setPageMeta(res?.meta)
    }
  } catch (error) {
    tableData.value = []
    initPageMeta()
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
    confirmButtonClass: 'confirm-danger',
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
      M.success(t('Base.createSuccess'))
      record.value = {
        user_id: '',
        password: '',
        is_superuser: false,
      }
    }
    loadData()
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
    clientid: t('Base.clientid'),
    username: t('Base.username'),
  }
  return fieldMap[field]
}

const resetPageAndLoadData = () => {
  pageMeta.value.page = 1
  loadData()
}

const resetIsSuperuser = () => {
  searchVal.is_superuser = undefined
}
</script>

<style lang="scss" scoped>
.authn-manager {
  .searchbar {
    height: 36px;
    margin-right: -16px;
    .el-input {
      width: 260px;
    }
  }

  .add-funcs-container {
    display: flex;
    > .el-button,
    > .file-upload {
      margin-right: 8px;
    }
  }

  .file-upload {
    display: inline-block;
    vertical-align: top;
  }
}
</style>
