<template>
  <div class="users app-wrapper">
    <div class="section-header">
      <div></div>
      <CreateButton @click="showDialog()" />
    </div>

    <el-table :data="tableData" v-loading.lock="lockTable">
      <el-table-column prop="username" :label="tl('username')" :min-width="160" />
      <el-table-column prop="description" :label="t('Base.note')" :min-width="150" />
      <el-table-column :label="t('Dashboard.role')" :min-width="128" sortable>
        <template #default="{ row }">
          {{ getLabelFromValueInOptionList(row.role, userRoleOptions) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="hasSSOEnabled"
        prop="backend"
        :label="tl('source')"
        :min-width="120"
        sortable
      >
        <template #default="{ row }">
          {{ getSourceLabel(row.backend) }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('userScopes')" :min-width="200">
        <template #header>
          <FormItemLabel
            :label="tl('userScopes')"
            :desc="userScopesColumnDesc"
            desc-marked
            :max-height="400"
            popper-class="role-default-scopes-tooltip"
          />
        </template>
        <template #default="{ row }">
          <span v-if="usesRoleDefaultScopes(row.scopes)">{{ tl('roleDefaultScopes') }}</span>
          <template v-else-if="hasSelectedScopes(row.scopes)">
            <el-tag
              v-for="scope in row.scopes"
              :key="scope"
              type="info"
              effect="plain"
              size="small"
            >
              {{ getScopeLabel(scope) }}
            </el-tag>
          </template>
          <span v-else>{{ tl('noUserScopes') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mfa" :label="tl('mfa')" :min-width="230" sortable>
        <template #default="{ row }">
          <div class="mfa-cell">
            <el-tag
              v-if="row.mfa"
              :type="isMFAEnabled(row.mfa) ? 'success' : 'info'"
              effect="light"
            >
              {{ isMFAEnabled(row.mfa) ? t('Base.enabled') : getMFAMethodLabel(row.mfa) }}
            </el-tag>
            <span v-if="isMFAEnabled(row.mfa)"> ( {{ getMFAMethodLabel(row.mfa) }} ) </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isMultiTenancyEnabled && !isNamespaceUser"
        prop="namespace"
        sortable
        :min-width="132"
        :label="t('BasicConfig.namespace')"
        :sort-by="({ namespace }) => namespace || ''"
      >
        <template #default="{ row }">
          {{ row.namespace || '' }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" :min-width="isZh ? 308 : 386">
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
            v-if="canManageMfa(row)"
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
        :validate-on-rule-change="false"
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
          <el-select v-model="record.role" @change="handleRoleChanged">
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
        <el-form-item
          v-if="isMultiTenancyEnabled && accessType !== 'chPass'"
          :label="t('BasicConfig.namespace')"
          prop="namespace"
        >
          <div class="vertical-align-center">
            <el-switch
              v-model="isNamespaceEnabled"
              :disabled="accessType === 'edit'"
              @change="toggleNamespaceEnabled"
            />
            <NamespaceSelect
              v-if="isNamespaceEnabled"
              v-model="record.namespace"
              :disabled="accessType === 'edit'"
              :global="{ enable: false }"
              @change="handleNamespaceChanged"
            />
          </div>
        </el-form-item>
        <el-form-item v-if="accessType !== 'chPass' && !isNamespaceEnabled" prop="scopeMode">
          <template #label>
            <FormItemLabel
              :label="tl('scopeMode')"
              :desc="scopeModeDesc"
              desc-marked
              :max-height="400"
              popper-class="scope-mode-tooltip"
            />
          </template>
          <el-radio-group v-model="record.scopeMode" @change="handleScopeModeChanged">
            <el-radio :value="ScopeMode.RoleDefault">
              {{ tl('roleDefaultScopes') }}
            </el-radio>
            <el-radio :value="ScopeMode.Privilege">
              {{ tl('scopeModePrivilege') }}
            </el-radio>
            <el-radio :value="ScopeMode.Custom">
              {{ tl('scopeModeCustom') }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="accessType !== 'chPass' && isNamespaceEnabled">
          <template #label>
            <FormItemLabel
              :label="tl('useRoleDefaultScopes')"
              :desc="roleDefaultScopesFormDesc"
              desc-marked
              :max-height="400"
              popper-class="role-default-scopes-tooltip"
            />
          </template>
          <el-switch
            v-model="record.useRoleDefaultScopes"
            @change="handleRoleDefaultScopesChanged"
          />
        </el-form-item>
        <el-form-item
          v-if="accessType !== 'chPass' && shouldShowScopesSelect"
          :label="scopeSelectLabel"
          prop="scopes"
        >
          <el-select
            v-model="record.scopes"
            multiple
            clearable
            :placeholder="tl('userScopesPlaceholder')"
            style="width: 100%"
          >
            <el-option
              v-for="scope in currentScopeOptions"
              :key="scope.name"
              :value="scope.name"
              :label="getScopeLabel(scope.name)"
            >
              <span>{{ getScopeLabel(scope.name) }}</span>
              <span class="scope-desc">
                {{ getScopeDesc(scope.name) }}
                <template v-if="scope.admin_only"> ({{ tl('userScopesAdminOnlyTip') }}) </template>
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-alert
          v-if="accessType !== 'chPass' && hasMixedGlobalScopes"
          class="mixed-scopes-alert"
          type="warning"
          :title="tl('mixedGlobalScopesDesc')"
          :closable="false"
          show-icon
        />
        <div v-if="accessType === 'chPass'">
          <el-input class="username-placeholder" v-model="record.username" disabled />
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
          <CancelButton @click="closeDialog" />

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
  <UserMFASettingDialog
    v-model="isMfaSettingsDialogVisible"
    :user="record"
    :is-current-user="isCurrentUser(record?.username)"
    @submitted="loadData"
  />
</template>

<script setup>
import { changePassword, createUser, destroyUser, loadUser, updateUser } from '@/api/function.ts'
import { getLoginUserScopes } from '@/api/systemModule.ts'
import { DASHBOARD_USERNAME_REG } from '@/common/constants'
import { hasSelectedScopes, isUnsetScopes, normalizeScopes, UNSET_SCOPES } from '@/common/scopes'
import { UserRole } from '@/types/enum.ts'
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import UserMFASettingDialog from './components/UserMFASettingDialog.vue'

const SOURCE_LOCAL = 'local'
const ScopeMode = {
  RoleDefault: 'role_default',
  Privilege: 'privilege',
  Custom: 'custom',
  Mixed: 'mixed',
}
const PRIVILEGE_SCOPES = new Set([
  'system',
  'user_management',
  'api_key_management',
  'sso_management',
])
const LOGIN_ONLY_SCOPES = new Set([
  'user_management',
  'mfa_management',
  'sso_management',
  'api_key_management',
])
const NS_ADMIN_ALLOWED_SCOPES = new Set([
  'connections',
  'monitoring',
  'data_integration',
  'access_control',
  'system',
  'cluster_operations',
  'license',
  'user_management',
  'api_key_management',
])

const store = useStore()
const isMultiTenancyEnabled = useMultiTenancyEnabled()
const { tl, t, te } = useI18nTl('General')
const isZh = computed(() => /zh/.test(store.state.lang))

const buildRoleDefaultScopesDesc = (intro) =>
  [intro, tl('roleDefaultScopesByRoleDesc'), tl('roleDefaultScopesRestrictionDesc')].join('\n\n')
const roleDefaultScopesFormDesc = computed(() =>
  buildRoleDefaultScopesDesc(tl('roleDefaultScopesFormDesc')),
)
const scopeModeDesc = computed(() => buildRoleDefaultScopesDesc(tl('scopeModeDesc')))
const userScopesColumnDesc = computed(() => buildRoleDefaultScopesDesc(tl('userScopesColumnDesc')))

const dialogVisible = ref(false)
const tableData = ref([])
const lockTable = ref(false)
const accessType = ref('')
const record = ref({})
const submitLoading = ref(false)
const formCom = ref()
const availableUserScopes = ref([])
const shouldResolveRoleDefaultScopes = ref(false)

const { processUserRecordForSubmit } = useNamespaceUser()

const isNamespaceEnabled = ref(false)
const toggleNamespaceEnabled = (enabled) => {
  isNamespaceEnabled.value = enabled
  if (enabled) {
    record.value.useRoleDefaultScopes = record.value.scopeMode === ScopeMode.RoleDefault
  } else {
    record.value.namespace = ''
    record.value.scopeMode = record.value.useRoleDefaultScopes
      ? ScopeMode.RoleDefault
      : resolveExplicitGlobalScopeMode(record.value.scopes)
  }
  nextTick(() => {
    if (enabled && !record.value.useRoleDefaultScopes) {
      filterSelectedScopes()
    }
    formCom.value?.clearValidate(['namespace', 'scopeMode', 'scopes'])
  })
}

const { userRoleOptions } = useRole()

const isAdminRole = computed(() => record.value.role === UserRole.Admin)

const usesRoleDefaultScopes = (scopes) => scopes == null || isUnsetScopes(scopes)

const getScopeLabel = (name) => {
  const key = `APIKey.scopeLabel_${name}`
  return te(key) ? t(key) : name
}
const getScopeDesc = (name) => {
  const key = `APIKey.scopeDesc_${name}`
  return te(key) ? t(key) : ''
}

const roleCompatibleScopeOptions = computed(() =>
  availableUserScopes.value.filter((scope) => {
    if (!isAdminRole.value && scope.admin_only) {
      return false
    }
    return !(
      isNamespaceEnabled.value &&
      isAdminRole.value &&
      !NS_ADMIN_ALLOWED_SCOPES.has(scope.name)
    )
  }),
)

const currentScopeOptions = computed(() => {
  if (isNamespaceEnabled.value || record.value.scopeMode === ScopeMode.Mixed) {
    return roleCompatibleScopeOptions.value
  }
  if (record.value.scopeMode === ScopeMode.Privilege) {
    return roleCompatibleScopeOptions.value.filter(({ name }) => PRIVILEGE_SCOPES.has(name))
  }
  return roleCompatibleScopeOptions.value.filter(({ name }) => !PRIVILEGE_SCOPES.has(name))
})

const shouldShowScopesSelect = computed(
  () =>
    (isNamespaceEnabled.value && !record.value.useRoleDefaultScopes) ||
    (!isNamespaceEnabled.value && record.value.scopeMode !== ScopeMode.RoleDefault),
)

const scopeSelectLabel = computed(() => {
  if (isNamespaceEnabled.value || record.value.scopeMode === ScopeMode.Mixed) {
    return tl('userScopes')
  }
  return record.value.scopeMode === ScopeMode.Privilege
    ? tl('scopeModePrivilege')
    : tl('scopeModeCustom')
})

const partitionScopes = (scopes) =>
  (normalizeScopes(scopes) ?? []).reduce(
    (result, scope) => {
      result[PRIVILEGE_SCOPES.has(scope) ? 'privilege' : 'restricted'].push(scope)
      return result
    },
    { privilege: [], restricted: [] },
  )

const resolveExplicitGlobalScopeMode = (scopes) => {
  const { privilege, restricted } = partitionScopes(scopes)
  if (privilege.length && restricted.length) {
    return ScopeMode.Mixed
  }
  return privilege.length ? ScopeMode.Privilege : ScopeMode.Custom
}

const isSameScopeSet = (left, right) => {
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  return leftSet.size === rightSet.size && [...leftSet].every((scope) => rightSet.has(scope))
}

const getRoleDefaultScopes = () => {
  if (isNamespaceEnabled.value && isAdminRole.value) {
    return availableUserScopes.value
      .filter(({ name }) => NS_ADMIN_ALLOWED_SCOPES.has(name))
      .map(({ name }) => name)
  }
  if (isAdminRole.value) {
    return availableUserScopes.value.map(({ name }) => name)
  }
  return availableUserScopes.value
    .filter(({ name }) => !LOGIN_ONLY_SCOPES.has(name))
    .map(({ name }) => name)
}

const resolveRoleDefaultScopeState = () => {
  const isRoleDefault =
    record.value.useRoleDefaultScopes ||
    isSameScopeSet(normalizeScopes(record.value.scopes) ?? [], getRoleDefaultScopes())
  record.value.useRoleDefaultScopes = isRoleDefault
  if (!isNamespaceEnabled.value) {
    record.value.scopeMode = isRoleDefault
      ? ScopeMode.RoleDefault
      : resolveExplicitGlobalScopeMode(record.value.scopes)
  }
}

const hasMixedGlobalScopes = computed(
  () => !isNamespaceEnabled.value && record.value.scopeMode === ScopeMode.Mixed,
)

const filterSelectedScopes = (showMessage = true) => {
  if (
    !shouldShowScopesSelect.value ||
    !Array.isArray(record.value.scopes) ||
    availableUserScopes.value.length === 0
  ) {
    return
  }
  const allowedScopes = new Set(currentScopeOptions.value.map(({ name }) => name))
  const removedScopes = record.value.scopes.filter((scope) => !allowedScopes.has(scope))
  if (removedScopes.length === 0) {
    return
  }
  record.value.scopes = record.value.scopes.filter((scope) => allowedScopes.has(scope))
  if (showMessage) {
    ElMessage.warning(
      tl('incompatibleScopesRemoved', {
        scopes: removedScopes.map(getScopeLabel).join(', '),
      }),
    )
  }
}

const handleScopeModeChanged = () => {
  shouldResolveRoleDefaultScopes.value = false
  filterSelectedScopes()
  nextTick(() => formCom.value?.clearValidate(['scopeMode', 'scopes']))
}

const handleRoleDefaultScopesChanged = () => {
  shouldResolveRoleDefaultScopes.value = false
}

const handleRoleChanged = () => {
  filterSelectedScopes()
}

const handleNamespaceChanged = () => {
  filterSelectedScopes()
}

const loadUserScopes = async () => {
  try {
    availableUserScopes.value = await getLoginUserScopes()
    if (shouldResolveRoleDefaultScopes.value) {
      resolveRoleDefaultScopeState()
      shouldResolveRoleDefaultScopes.value = false
    }
    filterSelectedScopes(false)
  } catch (e) {
    availableUserScopes.value = []
  }
}

const { getBackendLabel } = useSSOBackendsLabel()
const getSourceLabel = (source) => (source === SOURCE_LOCAL ? tl('local') : getBackendLabel(source))

const { loadConfigPromise, hasSSOEnabled, getEnabledSSO } = useSSO()

const canChangePwd = ({ backend }) => backend === SOURCE_LOCAL
const canManageMfa = () => true

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

const { createRequiredRule } = useFormRules()
const pwdMismatchMsg =
  tl('passwordRequirement1') + tl('semicolon') + tl('passwordRequirement2').toLowerCase()
const rules = computed(() => {
  const validateScopeMode = (_rule, value, callback) => {
    if (!isNamespaceEnabled.value && value === ScopeMode.Mixed) {
      callback(new Error(tl('mixedGlobalScopesError')))
      return
    }
    callback()
  }
  const ret = {
    username: [
      { required: true, message: tl('enterOneUserName') },
      ...(accessType.value === 'create'
        ? [
            {
              pattern: DASHBOARD_USERNAME_REG,
              message: tl('usernameFormatError'),
              trigger: ['blur', 'change'],
            },
          ]
        : []),
    ],
    role: createRequiredRule(t('Dashboard.role'), 'select'),
    scopeMode: [{ validator: validateScopeMode, trigger: 'change' }],
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
    if (isNamespaceEnabled.value) {
      ret.namespace = createRequiredRule(t('BasicConfig.namespace'), 'select')
    }
  }
  return ret
})
const currentUser = computed(() => {
  return store.state.user
})

const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
const currentUserNamespace = computed(() => store.getters.userNamespace)
const loadData = async () => {
  lockTable.value = true
  try {
    await getEnabledSSO()
    const users = await loadUser()
    if (isNamespaceUser.value) {
      tableData.value = users.filter(({ namespace }) => namespace === currentUserNamespace.value)
    } else {
      tableData.value = users
    }
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
  namespace: '',
  scopes: [],
  useRoleDefaultScopes: true,
  scopeMode: ScopeMode.RoleDefault,
})

const isCurrentUser = (user) => user === currentUser.value.username

const showDialog = (type = 'create', item = {}) => {
  dialogVisible.value = true
  formCom.value?.resetFields()

  if (type === 'edit') {
    record.value = Object.assign({}, item, {
      scopes: normalizeScopes(item.scopes) ?? [],
      useRoleDefaultScopes: usesRoleDefaultScopes(item.scopes),
      scopeMode: usesRoleDefaultScopes(item.scopes)
        ? ScopeMode.RoleDefault
        : resolveExplicitGlobalScopeMode(item.scopes),
    })
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
  isNamespaceEnabled.value = !!record.value.namespace
  if (type === 'edit') {
    if (availableUserScopes.value.length > 0) {
      resolveRoleDefaultScopeState()
    } else {
      shouldResolveRoleDefaultScopes.value = true
    }
  } else {
    shouldResolveRoleDefaultScopes.value = false
  }
  if (type !== 'chPass' && availableUserScopes.value.length === 0) {
    loadUserScopes()
  }
  accessType.value = type
}

const isMfaSettingsDialogVisible = ref(false)
const openMfaSettingsDialog = (item) => {
  record.value = item
  isMfaSettingsDialogVisible.value = true
}
const { isMFAEnabled, getMFAMethodLabel } = useMFAMethods()

const closeDialog = () => {
  dialogVisible.value = false
}

const trimUserName = () => {
  record.value.username = record.value.username.trim()
}

const getBackend = (backend) => (backend === SOURCE_LOCAL ? undefined : backend)

const getRecordForUpdating = () => {
  const ret = processUserRecordForSubmit(record.value)
  return buildUserPayload(ret, ['description', 'role', 'scopes'])
}
// Both the global role-default radio and the namespace role-default switch
// map to the backend's `unset` sentinel. Explicit mode preserves the array,
// including [] (deny all mapped paths), so the states are never conflated.
const buildUserPayload = (rec, fields) => {
  const payload = pick(rec, fields)
  const useRoleDefaultScopes = isNamespaceEnabled.value
    ? rec.useRoleDefaultScopes
    : rec.scopeMode === ScopeMode.RoleDefault
  payload.scopes = useRoleDefaultScopes ? UNSET_SCOPES : (normalizeScopes(rec.scopes) ?? [])
  return payload
}

const save = async () => {
  try {
    await formCom.value.validate()
    submitLoading.value = true
    const { username } = record.value
    if (accessType.value === 'edit') {
      const backend = getBackend(record.value.backend)
      await updateUser(username, getRecordForUpdating(), backend)
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
      await createUser(
        buildUserPayload(processUserRecordForSubmit(record.value), [
          'username',
          'password',
          'description',
          'role',
          'scopes',
        ]),
      )
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

<style lang="scss">
.users {
  .el-tag {
    margin-right: 4px;
  }
  .mfa-cell {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
}

.role-default-scopes-tooltip {
  max-width: 720px;
}

.scope-mode-tooltip {
  max-width: 720px;
}
</style>

<style lang="scss" scoped>
.username-placeholder {
  display: none;
}
.vertical-align-center {
  flex-grow: 1;
  .el-select {
    flex-grow: 1;
    margin-left: 8px;
  }
}
.mixed-scopes-alert {
  margin-bottom: 18px;
}
.scope-desc {
  color: var(--el-text-color-secondary);
  float: right;
  font-size: 12px;
  margin-left: 20px;
}
</style>
