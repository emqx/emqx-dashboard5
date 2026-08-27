<template>
  <el-dialog
    v-model="showDialog"
    :width="600"
    class="API-key-dialog"
    :title="t('Base.create')"
    :z-index="2000"
  >
    <el-form
      ref="formCom"
      label-position="top"
      require-asterisk-position="right"
      :model="formData"
      :rules="rules"
      :class="{ 'is-view': operationType === 'view' }"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="tl('keyName')" prop="name" required>
            <el-input v-model="formData.name" :disabled="operationType !== 'create'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('expireAt')" prop="expired_at">
            <el-date-picker
              v-model="formData.expired_at"
              :shortcuts="datePickerShortcuts"
              :disabled="operationType === 'view'"
              :disabledDate="isItEarlierThanToday"
              :placeholder="tl('neverExpire')"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('isEnable')" prop="enable">
            <el-select v-model="formData.enable" :disabled="operationType === 'view'">
              <el-option
                v-for="{ label, value } in isEnableOptions"
                :key="label"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('role', 'Dashboard')" prop="role">
            <el-select
              v-model="formData.role"
              :disabled="operationType === 'view'"
              @change="handleRoleChanged"
            >
              <el-option
                v-for="{ label, value } in apiKeyRoleOptions"
                :key="value"
                :value="value"
                :label="label"
              >
                {{ label }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="isMultiTenancyEnabled" :span="12">
          <el-form-item :label="t('BasicConfig.namespace')" prop="namespace">
            <div class="vertical-align-center">
              <el-switch
                v-model="isNamespaceEnabled"
                :disabled="operationType !== 'create'"
                @change="toggleNamespaceEnabled"
              />
              <el-select
                v-if="isNamespaceEnabled"
                v-model="formData.namespace"
                :disabled="operationType !== 'create'"
              >
                <el-option
                  v-for="item in namespaceOptions"
                  :key="item"
                  :value="item"
                  :label="item"
                />
              </el-select>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="operationType === 'view'">
          <el-form-item label="API Key">
            <el-row :gutter="12">
              <el-col :span="21">
                <el-input v-model="formData.api_key" disabled />
              </el-col>
              <el-col :span="3">
                <el-button ref="btnCopyAPIKey" @click="copyText(formData.api_key as string)">
                  {{ tl('copy', 'Base') }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="operationType === 'view'">
          <el-form-item label="Secret Key">
            <el-input :placeholder="`**** ${tl('secretKeyPlaceholder')} ****`" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isPublisherRole">
          <el-form-item prop="scopeMode">
            <template #label>
              <FormItemLabel
                :label="tl('scopeMode')"
                :desc="scopeModeDesc"
                desc-marked
                :max-height="400"
                popper-class="scope-mode-tooltip"
              />
            </template>
            <el-radio-group
              v-model="formData.scopeMode"
              :disabled="operationType === 'view'"
              @change="handleScopeModeChanged"
            >
              <el-radio :value="ScopeMode.RoleDefault">
                {{ tl('roleDefaultScopes') }}
              </el-radio>
              <el-radio :value="ScopeMode.System">
                {{ tl('scopeModeSystem') }}
              </el-radio>
              <el-radio :value="ScopeMode.Custom">
                {{ tl('scopeModeCustom') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="!isPublisherRole && formData.scopeMode === ScopeMode.Custom">
          <el-form-item class="scopes-form-item" :label="tl('scopes')" prop="scopes">
            <el-select
              v-model="formData.scopes"
              multiple
              clearable
              :placeholder="tl('scopesPlaceholder')"
              :disabled="operationType === 'view'"
              style="width: 100%"
            >
              <el-option
                v-for="scope in customScopeOptions"
                :key="scope.name"
                :value="scope.name"
                :label="getScopeLabel(scope.name)"
              >
                <span>{{ getScopeLabel(scope.name) }}</span>
                <span class="scope-desc">
                  {{ getScopeDesc(scope.name) }}
                </span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-alert
            v-if="hasLegacyMixedScopes"
            class="mixed-scopes-alert"
            type="warning"
            :title="tl('mixedScopesMigrationDesc')"
            :closable="false"
            show-icon
          />
          <el-alert
            v-if="hasLegacyNamespacedPublishScopes"
            class="mixed-scopes-alert"
            type="warning"
            :title="tl('namespacedPublishMigrationDesc')"
            :closable="false"
            show-icon
          />
        </el-col>
        <el-col :span="24">
          <el-form-item :label="t('Base.note')" prop="description">
            <el-input
              type="textarea"
              v-model="formData.desc"
              :disabled="operationType === 'view'"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" plain @click="showDialog = false">
          {{ operationType === 'view' ? tl('close') : $t('Base.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="submit"
          :disabled="!$hasPermission('post')"
          :loading="isSubmitting"
          v-if="operationType !== 'view'"
        >
          {{ $t('Base.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <APIKeyResultDialog v-model="showResultDialog" :data="createdResult" />
</template>

<script lang="ts" setup>
import { createAPIKey, updateAPIKey, getAPIKeyScopes } from '@/api/systemModule'
import { UserRole } from '@/types/enum'
import { APIKey, APIKeyFormWhenCreating, APIKeyScope } from '@/types/systemModule'
import { isUnsetScopes, normalizeScopes, UNSET_SCOPES } from '@/common/scopes'
import APIKeyResultDialog from './APIKeyResultDialog.vue'
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'

export type OperationType = 'create' | 'view' | 'edit'
enum ScopeMode {
  RoleDefault = 'role_default',
  System = 'system',
  Custom = 'custom',
}

const SYSTEM_SCOPE = 'system'
const PUBLISH_SCOPE = 'publish'
const isNamespacedNamespace = (namespace?: string) => !!namespace

type APIKeyFormData = Omit<APIKeyFormWhenCreating, 'scopes'> &
  Partial<Omit<APIKey, 'scopes'>> & {
    scopes: string[]
    scopeMode: ScopeMode
  }

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  operationType: {
    type: String as PropType<OperationType>,
    required: true,
  },
  APIKeyData: {
    type: Object as PropType<APIKey>,
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submitted'): void
}>()

const { t, te } = useI18n()
const isMultiTenancyEnabled = useMultiTenancyEnabled()
const tl = (key: string, collection = 'APIKey') => {
  return t(collection + '.' + key)
}
const scopeModeDesc = computed(() =>
  [tl('scopeModeDesc'), tl('roleDefaultScopesByRoleDesc')].join('\n\n'),
)

const createRawFormData = () => ({
  name: '',
  expired_at: undefined,
  desc: '',
  enable: true,
  role: 'administrator',
  scopes: [] as string[],
  scopeMode: ScopeMode.RoleDefault,
})

const formCom = ref()
const formData: Ref<APIKeyFormData> = ref(createRawFormData())
const originalAPIKeyScopeState = ref<{
  namespace?: string
  role: string
  scopes: string[]
}>()
const availableScopes: Ref<APIKeyScope[]> = ref([])
const lastRole = ref<UserRole>(UserRole.Admin)
const { createLetterStartRule } = useFormRules()
const validateCustomScopes = (
  _rule: unknown,
  value: string[],
  callback: (error?: Error) => void,
) => {
  if (formData.value.scopeMode === ScopeMode.Custom && value.includes(SYSTEM_SCOPE)) {
    callback(new Error(tl('customScopesSystemError')))
    return
  }
  if (
    formData.value.scopeMode === ScopeMode.Custom &&
    isNamespacedKey.value &&
    value.includes(PUBLISH_SCOPE) &&
    !isUnchangedLegacyNamespacedScopes.value
  ) {
    callback(new Error(tl('namespacedPublishError')))
    return
  }
  callback()
}
const rules = {
  name: [
    {
      required: true,
      message: tl('keyNameRequired'),
    },
    ...createLetterStartRule(),
  ],
  scopes: [{ validator: validateCustomScopes, trigger: 'change' }],
}
const isEnableOptions = [
  {
    label: tl('disable'),
    value: false,
  },
  {
    label: tl('enable'),
    value: true,
  },
]
const isSubmitting = ref(false)

const btnCopyAPIKey = ref()

const createdResult: Ref<APIKey | undefined> = ref(undefined)
const showResultDialog: Ref<boolean> = ref(false)

const { datePickerShortcuts } = useDatePickerShortcuts()

const isNamespaceEnabled = ref(false)
const isNamespacedKey = computed(
  () => isNamespaceEnabled.value || isNamespacedNamespace(formData.value.namespace),
)
const namespaceOptions = ref<Array<string>>([])
const isNamespaceOptionsLoaded = ref(false)
const { getNamespaceOptions } = useManagedNamespaceOptions()
const queryNamespaceList = async () => {
  if (!isMultiTenancyEnabled.value) {
    return
  }
  try {
    const res = await getNamespaceOptions()
    namespaceOptions.value = res
    isNamespaceOptionsLoaded.value = true
  } catch (error) {
    //
  }
}
const toggleNamespaceEnabled = () => {
  if (isNamespaceEnabled.value) {
    formData.value.scopes = formData.value.scopes.filter((scope) => scope !== PUBLISH_SCOPE)
    if (!isNamespaceOptionsLoaded.value) {
      queryNamespaceList()
    }
  } else if (!isNamespaceEnabled.value && formData.value.namespace) {
    formData.value.namespace = ''
  }
}

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const loadAvailableScopes = () =>
  getAPIKeyScopes().then((scopes) => {
    availableScopes.value = scopes
    return scopes
  })

const isSameScopeSet = (left: string[], right: string[]) => {
  const leftSet = new Set(left)
  const rightSet = new Set(right)
  return leftSet.size === rightSet.size && [...leftSet].every((scope) => rightSet.has(scope))
}

const isUnchangedLegacyNamespacedScopes = computed(() => {
  const original = originalAPIKeyScopeState.value
  if (
    props.operationType === 'create' ||
    !original ||
    !isNamespacedNamespace(original.namespace) ||
    !original.scopes.includes(PUBLISH_SCOPE) ||
    isSameScopeSet(original.scopes, [PUBLISH_SCOPE])
  ) {
    return false
  }
  return (
    formData.value.namespace === original.namespace &&
    formData.value.role === original.role &&
    isSameScopeSet(formData.value.scopes, original.scopes)
  )
})

const getRoleDefaultScopes = (role: string, scopes: APIKeyScope[]) =>
  role === UserRole.Publisher ? [PUBLISH_SCOPE] : scopes.map(({ name }) => name)

const resolveScopeMode = (
  scopes: APIKey['scopes'],
  role: string,
  availableScopeList: APIKeyScope[],
  namespace?: string,
) => {
  if (scopes == null || isUnsetScopes(scopes)) {
    return ScopeMode.RoleDefault
  }
  const normalizedScopes = normalizeScopes(scopes) ?? []
  if (
    role !== UserRole.Publisher &&
    isNamespacedNamespace(namespace) &&
    normalizedScopes.includes(PUBLISH_SCOPE)
  ) {
    return ScopeMode.Custom
  }
  if (isSameScopeSet(normalizedScopes, getRoleDefaultScopes(role, availableScopeList))) {
    return ScopeMode.RoleDefault
  }
  if (normalizedScopes.length === 1 && normalizedScopes[0] === SYSTEM_SCOPE) {
    return ScopeMode.System
  }
  return ScopeMode.Custom
}

watch(showDialog, async (val) => {
  if (val) {
    const availableScopesPromise = loadAvailableScopes().catch(() => [])
    if (props.operationType !== 'create') {
      const data = props.APIKeyData as APIKey
      const loadedScopes = await availableScopesPromise
      const normalizedScopes = normalizeScopes(data.scopes) ?? []
      originalAPIKeyScopeState.value = {
        namespace: data.namespace,
        role: data.role,
        scopes: [...normalizedScopes],
      }
      formData.value = {
        ...data,
        scopes: [...normalizedScopes],
        scopeMode: resolveScopeMode(data.scopes, data.role, loadedScopes, data.namespace),
      }
      lastRole.value = formData.value.role as UserRole
      if (props.operationType === 'view') {
        await nextTick()
      }
    } else {
      originalAPIKeyScopeState.value = undefined
      await nextTick()
      lastRole.value = formData.value.role as UserRole
      formCom.value.clearValidate()
    }
    isNamespaceEnabled.value = !!formData.value.namespace
  } else {
    formData.value = createRawFormData()
    originalAPIKeyScopeState.value = undefined
    lastRole.value = UserRole.Admin
  }
})

const { copyText } = useCopy()

const { apiKeyRoleOptions } = useRole()
const isPublisherRole = computed(() => formData.value.role === UserRole.Publisher)
const customScopeOptions = computed(() =>
  availableScopes.value.filter(
    ({ name }) => name !== SYSTEM_SCOPE && !(isNamespacedKey.value && name === PUBLISH_SCOPE),
  ),
)
const hasLegacyMixedScopes = computed(
  () =>
    formData.value.scopeMode === ScopeMode.Custom && formData.value.scopes.includes(SYSTEM_SCOPE),
)
const hasLegacyNamespacedPublishScopes = computed(
  () => isNamespacedKey.value && formData.value.scopes.includes(PUBLISH_SCOPE),
)

const handleScopeModeChanged = (mode: string | number | boolean | undefined) => {
  if (mode === ScopeMode.Custom) {
    formData.value.scopes = formData.value.scopes.filter((scope) => scope !== SYSTEM_SCOPE)
  }
  nextTick(() => formCom.value?.clearValidate('scopes'))
}

const handleRoleChanged = () => {
  if (formData.value.role === UserRole.Publisher || lastRole.value === UserRole.Publisher) {
    formData.value.scopeMode = ScopeMode.RoleDefault
    formData.value.scopes = []
  }
  lastRole.value = formData.value.role as UserRole
}

const getScopeLabel = (name: string): string => {
  const key = `APIKey.scopeLabel_${name}`
  return te(key) ? t(key) : titleCase(name)
}

const getScopeDesc = (name: string): string => {
  const key = `APIKey.scopeDesc_${name}`
  return te(key) ? t(key) : name
}

const todayStartTime = new Date().setHours(0, 0, 0, 0)
const isItEarlierThanToday = (date: Date) => date.getTime() < todayStartTime

type APIKeyFormDataWithoutName = Omit<APIKeyFormData, 'name'>

const handleDataForSubmitting = <T extends APIKeyFormData | APIKeyFormDataWithoutName>(
  formData: T,
) => {
  const { scopeMode, ...data } = formData
  const scopes =
    scopeMode === ScopeMode.RoleDefault
      ? UNSET_SCOPES
      : scopeMode === ScopeMode.System
        ? [SYSTEM_SCOPE]
        : data.scopes
  const ret = {
    ...data,
    scopes,
  }
  // The interface convention is that when the api key is never expired,
  // do not submit expired_at
  if (!ret.expired_at) {
    Reflect.deleteProperty(ret, 'expired_at')
  } else {
    // The time is set to 23:59:59 of the selected date
    ret.expired_at = new Date(new Date(ret.expired_at).setHours(23, 59, 59)).toISOString()
  }
  return ret
}

const { processUserRecordForSubmit, processAPIKeyRecordForUpdating } = useNamespaceUser()
const submitAddedData = () =>
  createAPIKey(processUserRecordForSubmit(handleDataForSubmitting(formData.value)))

const submitUpdatedData = () => {
  const { name, ...data } = formData.value
  return updateAPIKey(name, processAPIKeyRecordForUpdating(handleDataForSubmitting(data)))
}

const submit = async () => {
  try {
    await formCom.value.validate()
    isSubmitting.value = true
    if (props.operationType === 'create') {
      const data = await submitAddedData()
      createdResult.value = data
      showResultDialog.value = true
      ElMessage.success(t('Base.createSuccess'))
    } else if (props.operationType === 'edit') {
      await submitUpdatedData()
      ElMessage.success(t('Base.updateSuccess'))
    }
    emit('submitted')
    showDialog.value = false
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss">
.API-key-dialog {
  .el-col {
    .el-button {
      width: 100%;
    }
  }
  .is-view {
    .el-input.is-disabled,
    .el-textarea.is-disabled {
      background-color: var(--color-bg-content);
      .el-input__inner,
      .el-textarea__inner {
        color: var(--color-text-primary);
      }
      .el-textarea__inner {
        box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
      }
    }
  }

  .vertical-align-center {
    flex-grow: 1;
    .el-select {
      flex-grow: 1;
      margin-left: 8px;
    }
  }
  .mixed-scopes-alert {
    margin-top: -8px;
    margin-bottom: 18px;
  }
  .scopes-form-item {
    .el-form-item__error {
      position: static;
      width: 100%;
    }
  }
}
.scope-mode-tooltip {
  max-width: 720px;
}
.scope-desc {
  color: var(--el-text-color-secondary);
  margin-left: 8px;
  font-size: 12px;
  font-weight: normal;
}
</style>
