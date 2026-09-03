<template>
  <div class="authn-manager">
    <div class="section-header">
      <div class="searchbar">
        <el-space wrap :size="20">
          <NamespaceSelect
            v-if="isMultiTenancyEnabled && !gateway && !isNamespaceUser"
            v-model="namespace"
            class="flex-0"
            @change="resetPageAndLoadData"
          />
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
          <SearchButton @click="resetPageAndLoadData" />
          <RefreshButton @click="loadData" />
        </el-space>
      </div>
      <div class="add-funcs-container">
        <template v-if="mechanism === 'password_based'">
          <authn-users-import @uploadedData="loadData" />
        </template>
        <CreateButton @click="addCommand">{{ t('Base.add') }}</CreateButton>
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
        label-position="top"
        require-asterisk-position="right"
      >
        <el-form-item
          v-if="isMultiTenancyEnabled && !gateway && !isNamespaceUser"
          prop="namespace"
          :label="t('BasicConfig.namespace')"
          label-position="top"
        >
          <NamespaceSelectSwitch
            :model-value="record.namespace"
            :disabled="isEdit"
            @update:model-value="handleNamespaceChange"
          />
        </el-form-item>
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
        <el-form-item v-if="showIsSuperuserField">
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
          <CancelButton @click="dialogVisible = false" />
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
  </div>
</template>

<script lang="ts" setup>
import { createAuthnUsers, deleteAuthnUser, loadAuthnUsers, updateAuthnUser } from '@/api/auth'
import {
  addGatewayUserManagement,
  deleteGatewayUser,
  getGatewayUserManagement,
  updateGatewayUser,
} from '@/api/gateway'
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import { DataManagerItem } from '@/types/auth'
import { ElMessage as M, ElMessageBox as MB } from 'element-plus'
import AuthnUsersImport from './AuthnUsersImport.vue'

const createRawUserForm = () => ({
  user_id: '',
  password: '',
  is_superuser: false,
  namespace: undefined,
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

const store = useStore()
const isMultiTenancyEnabled = useMultiTenancyEnabled()
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
const currentUserNamespace = computed(() => store.getters.userNamespace)

const record = ref<DataManagerItem>(createRawUserForm())
const namespace = ref<string | undefined>(
  isNamespaceUser.value ? currentUserNamespace.value : undefined,
)
const isNamespaceScopedUser = computed(() => !prop.gateway && !isUndefined(record.value.namespace))
const showIsSuperuserField = computed(() => !isNamespaceScopedUser.value)
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
    ns: namespace.value,
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
    namespace: [
      {
        validator(_rules: any, value: string | undefined, callback: (error?: Error) => void) {
          let error = undefined
          if (!isUndefined(value) && !value) {
            error = new Error(
              t('Rule.selectFieldRequiredError', { name: lowerCase(t('BasicConfig.namespace')) }),
            )
          }
          callback(error)
        },
        trigger: 'blur',
      },
    ],
  }
  if (isEdit.value) {
    Reflect.deleteProperty(rules, 'user_id')
  }
  return rules
}

const handleNamespaceChange = (value: string | undefined) => {
  record.value.namespace = value
  if (isUndefined(value) || value) {
    nextTick(() => recordForm.value?.clearValidate('namespace'))
  }
}

const addCommand = () => {
  isEdit.value = false
  record.value = createRawUserForm()
  record.value.namespace = namespace.value
  dialogVisible.value = true
}

const handleEdit = (row: DataManagerItem) => {
  isEdit.value = true
  record.value = {
    user_id: row.user_id,
    is_superuser: row.is_superuser,
    password: '',
    namespace: namespace.value,
  }
  dialogVisible.value = true
}

const getTableNsParams = () => ({ ns: namespace.value })
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
        await deleteAuthnUser(id.value, row.user_id, getTableNsParams())
      }
      resetPageAndLoadData()
    })
    .catch(() => {
      // cancel
    })
}

const save = async () => {
  const validation = await recordForm.value.validate()
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
    const dataToSubmit = { ...record.value }
    if (isNamespaceScopedUser.value) {
      Reflect.deleteProperty(dataToSubmit, 'is_superuser')
    }
    if (prop.gateway) {
      res = await addGatewayUserManagement(prop.gateway, dataToSubmit)
    } else {
      res = await createAuthnUsers(id.value, dataToSubmit)
    }
    namespace.value = record.value.namespace
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
  const { password, is_superuser, user_id, namespace } = record.value

  const data: { password: string; is_superuser?: boolean } = {
    password,
  }
  if (!isNamespaceScopedUser.value) {
    data.is_superuser = is_superuser
  }
  let res
  if (prop.gateway) {
    res = await updateGatewayUser(prop.gateway, user_id, data)
  } else {
    res = await updateAuthnUser(id.value, user_id, data, { ns: namespace })
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
    .el-input {
      width: 260px;
    }
    .el-select {
      width: 200px;
      font-weight: normal;
    }
  }
  .border-checkbox {
    margin-top: 16px;
  }

  .add-funcs-container {
    display: flex;
    > .el-button,
    > .file-upload {
      margin-left: 16px;
    }
  }

  .file-upload {
    display: inline-block;
    vertical-align: top;
  }
}
</style>
