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
        <template v-if="mechanism === 'password_based' && !gateway">
          <authn-users-import :autogenerate-password="isGenerated" @uploadedData="loadData" />
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
          <TableButton v-if="canEdit" :disabled="!$hasPermission('put')" @click="handleEdit(row)">
            {{ $t('Base.edit') }}
          </TableButton>
          <TableButton
            v-if="isGenerated"
            :disabled="!$hasPermission('post') || rotatingUserId !== null"
            @click="handleRotate(row)"
          >
            {{ $t('Auth.rotatePassword') }}
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
      :close-on-click-modal="!saveLoading"
      :close-on-press-escape="!saveLoading"
      :show-close="!saveLoading"
      @closed="record.password = ''"
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
        <el-form-item v-if="!isGenerated" prop="password" :label="$t('General.password')">
          <el-input
            v-model="record.password"
            type="password"
            show-password
            autocomplete="one-time-code"
            :placeholder="
              isEdit && mechanism === 'password_based' ? t('Auth.keepPasswordPlaceholder') : ''
            "
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
            :disabled="!$hasPermission(isEdit ? 'put' : 'post')"
            :loading="saveLoading"
            @click="save"
          >
            {{ isEdit ? $t('Base.update') : $t('Base.save') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <GeneratedPasswordDialog
      v-if="generatedCredential"
      :user-id="generatedCredential.user_id"
      :password="generatedCredential.password"
      @close="generatedCredential = null"
    />
  </div>
</template>

<script lang="ts" setup>
import useAuthenticationUsers from '@/hooks/Auth/useAuthenticationUsers'
import { createAuthenticationUserBody } from '@/common/authnBuiltinPassword'
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import type { AuthenticationUserForm, DataManagerItem } from '@/types/auth'
import type {
  AuthenticationUserCreateRequest,
  AuthenticationUserWithPassword,
} from '@/types/typeAlias'
import { ElMessage as M, ElMessageBox as MB } from 'element-plus'
import AuthnUsersImport from './AuthnUsersImport.vue'
import GeneratedPasswordDialog from './GeneratedPasswordDialog.vue'

const createRawUserForm = (): AuthenticationUserForm => ({
  user_id: '',
  password: '',
  is_superuser: false,
  namespace: undefined,
})

const prop = withDefaults(
  defineProps<{
    field?: 'username' | 'clientid'
    gateway?: string
    listenerId?: string
    authenticatorId: string
    mechanism: string
    autogeneratePassword?: boolean
  }>(),
  { field: 'username', gateway: '', autogeneratePassword: false },
)

const { t } = useI18n()
const store = useStore()
const isMultiTenancyEnabled = useMultiTenancyEnabled()
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
const currentUserNamespace = computed(() => store.getters.userNamespace)
const record = ref<AuthenticationUserForm>(createRawUserForm())
const namespace = ref<string | undefined>(
  !prop.gateway && isNamespaceUser.value ? currentUserNamespace.value : undefined,
)
const context = computed(() => ({
  authenticatorId: prop.authenticatorId,
  gateway: prop.gateway,
  listenerId: prop.listenerId,
}))
const {
  addAuthenticationUser,
  editAuthenticationUser,
  listAuthenticationUsers,
  removeAuthenticationUser,
  rotateAuthenticationUserPassword,
} = useAuthenticationUsers(context)
const isGenerated = computed(() => prop.mechanism === 'password_based' && prop.autogeneratePassword)
const isNamespaceScopedUser = computed(() => !prop.gateway && record.value.namespace !== undefined)
const showIsSuperuserField = computed(() => !isNamespaceScopedUser.value)
const canEdit = computed(
  () => !isGenerated.value || !!prop.gateway || namespace.value === undefined,
)
const tableData = ref<DataManagerItem[]>([])
const lockTable = ref(false)
const dialogVisible = ref(false)
const recordForm = ref()
const isEdit = ref(false)
const saveLoading = ref(false)
const rotatingUserId = ref<string | null>(null)
const generatedCredential = ref<{ user_id: string; password: string } | null>(null)
const searchVal = reactive({ user_id: '', is_superuser: undefined as boolean | undefined })
const { pageMeta, pageParams, initPageMeta, setPageMeta } = usePaginationWithHasNext()
let requestId = 0
let disposed = false

const loadData = async () => {
  const currentRequest = ++requestId
  const sendParams = {
    ...pageParams.value,
    ...(!prop.gateway ? { ns: namespace.value } : {}),
    like_user_id: searchVal.user_id || undefined,
    is_superuser: searchVal.is_superuser,
  }
  lockTable.value = true
  try {
    const res = await listAuthenticationUsers(sendParams)
    if (currentRequest !== requestId || disposed) return
    tableData.value = (res?.data ?? []).map((user: DataManagerItem) => ({
      user_id: user.user_id,
      is_superuser: !!user.is_superuser,
    }))
    setPageMeta(res?.meta)
  } catch {
    if (currentRequest !== requestId || disposed) return
    tableData.value = []
    initPageMeta()
  } finally {
    if (currentRequest === requestId) lockTable.value = false
  }
}

onMounted(loadData)
onBeforeUnmount(() => {
  disposed = true
  generatedCredential.value = null
})

const getRules = () => ({
  user_id: [{ required: !isEdit.value, message: getFiledLabel(prop.field), trigger: 'blur' }],
  password: [
    {
      required: !isGenerated.value && (!isEdit.value || prop.mechanism !== 'password_based'),
      message: t('General.pleaseEnterPassword'),
    },
  ],
  namespace: [
    {
      validator(_rules: any, value: string | undefined, callback: (error?: Error) => void) {
        callback(
          value !== undefined && !value
            ? new Error(
                t('Rule.selectFieldRequiredError', { name: lowerCase(t('BasicConfig.namespace')) }),
              )
            : undefined,
        )
      },
      trigger: 'blur',
    },
  ],
})

const handleNamespaceChange = (value: string | undefined) => {
  record.value.namespace = value
  nextTick(() => recordForm.value?.clearValidate('namespace'))
}
const addCommand = () => {
  isEdit.value = false
  record.value = { ...createRawUserForm(), namespace: namespace.value }
  dialogVisible.value = true
}
const handleEdit = (row: DataManagerItem) => {
  isEdit.value = true
  record.value = { ...row, password: '', namespace: namespace.value }
  dialogVisible.value = true
}
const showGeneratedPassword = (res: AuthenticationUserWithPassword) => {
  if (!disposed && res.password) {
    generatedCredential.value = { user_id: res.user_id, password: res.password }
  }
}
const handleDelete = async (row: DataManagerItem) => {
  const selectedContext = { ...context.value }
  const params = { ns: namespace.value }
  try {
    await MB.confirm(t('Base.confirmDelete'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      confirmButtonClass: 'confirm-danger',
      type: 'warning',
    })
    await removeAuthenticationUser(row.user_id, params, selectedContext)
    resetPageAndLoadData()
  } catch {
    /* Cancellation and request errors are handled by the dialog / HTTP client. */
  }
}

const save = async () => {
  if (saveLoading.value) return
  try {
    await recordForm.value.validate()
    const editing = isEdit.value
    const form = { ...record.value }
    const body = createAuthenticationUserBody(
      form,
      isGenerated.value,
      isNamespaceScopedUser.value,
      editing,
    )
    if (editing && Object.keys(body).length === 0) {
      dialogVisible.value = false
      return
    }
    saveLoading.value = true
    const res = editing
      ? await editAuthenticationUser(form.user_id, body, { ns: form.namespace })
      : await addAuthenticationUser(body as AuthenticationUserCreateRequest)
    if (disposed) return
    namespace.value = form.namespace
    dialogVisible.value = false
    record.value = createRawUserForm()
    M.success(t(editing ? 'Base.updateSuccess' : 'Base.createSuccess'))
    showGeneratedPassword(res)
    resetPageAndLoadData()
  } catch {
    /* Validation / HTTP errors are displayed by their respective handlers. */
  } finally {
    saveLoading.value = false
  }
}

const handleRotate = async (row: DataManagerItem) => {
  if (rotatingUserId.value !== null) return
  const selectedContext = { ...context.value }
  const params = { ns: namespace.value }
  rotatingUserId.value = row.user_id
  try {
    await MB.confirm(t('Auth.rotatePasswordConfirm', { user: row.user_id }), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      type: 'warning',
    })
    const res = await rotateAuthenticationUserPassword(row.user_id, params, selectedContext)
    showGeneratedPassword(res)
    if (!disposed) M.success(t('Auth.rotatePasswordSuccess'))
  } catch {
    /* Cancellation and request errors are handled by the dialog / HTTP client. */
  } finally {
    rotatingUserId.value = null
  }
}

const getFiledLabel = (field: 'clientid' | 'username') =>
  t(field === 'clientid' ? 'Base.clientid' : 'Base.username')
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
