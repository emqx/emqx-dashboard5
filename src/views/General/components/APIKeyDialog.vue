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
        <el-col :span="12">
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
        <el-col :span="24" v-if="!isPublisherRole || isNamespacedKey">
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
        <el-col
          :span="24"
          v-if="(!isPublisherRole || isNamespacedKey) && formData.scopeMode === ScopeMode.Custom"
        >
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
            v-if="hasLegacyMixedScopes && !isNamespacedKey"
            class="mixed-scopes-alert"
            type="warning"
            :title="tl('mixedScopesMigrationDesc')"
            :closable="false"
            show-icon
          />
          <el-alert
            v-if="hasLegacyNamespacedScopes"
            class="mixed-scopes-alert"
            type="warning"
            :title="tl('namespacedScopesMigrationDesc')"
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
import { normalizeScopes } from '@/common/scopes'
import {
  APIKeyScopeMode as ScopeMode,
  type APIKeyScopeState,
  getAPIKeyCustomScopeError,
  getAPIKeyScopesForSubmit,
  isAllowedNamespacedAPIKeyScope,
  isNamespacedAPIKey,
  resolveAPIKeyScopeMode,
} from '@/common/apiKeyScopes'
import APIKeyResultDialog from './APIKeyResultDialog.vue'

export type OperationType = 'create' | 'view' | 'edit'
const SYSTEM_SCOPE = 'system'

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
const originalAPIKeyScopeState = ref<APIKeyScopeState>()
const availableScopes: Ref<APIKeyScope[]> = ref([])
const lastRole = ref<UserRole>(UserRole.Admin)
const { createLetterStartRule } = useFormRules()
const validateCustomScopes = (
  _rule: unknown,
  value: string[],
  callback: (error?: Error) => void,
) => {
  const error =
    formData.value.scopeMode === ScopeMode.Custom
      ? getAPIKeyCustomScopeError(
          { ...formData.value, scopes: value },
          props.operationType === 'edit' ? originalAPIKeyScopeState.value : undefined,
        )
      : undefined
  callback(error ? new Error(tl(error)) : undefined)
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
  namespace: [
    {
      validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
        callback(
          isNamespaceEnabled.value && !value
            ? new Error(t('Rule.selectFieldRequiredError', { name: t('BasicConfig.namespace') }))
            : undefined,
        )
      },
      trigger: 'change',
    },
  ],
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
  () => isNamespaceEnabled.value || isNamespacedAPIKey(formData.value.namespace),
)
const namespaceOptions = ref<Array<string>>([])
const isNamespaceOptionsLoaded = ref(false)
const { getNamespaceOptions } = useManagedNamespaceOptions()
const queryNamespaceList = async () => {
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
    formData.value.scopes = formData.value.scopes.filter(isAllowedNamespacedAPIKeyScope)
    if (!isNamespaceOptionsLoaded.value) {
      queryNamespaceList()
    }
  } else if (!isNamespaceEnabled.value && formData.value.namespace) {
    formData.value.namespace = ''
  }
  nextTick(() => formCom.value?.clearValidate(['scopes', 'namespace']))
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
        scopes: Array.isArray(data.scopes) ? [...data.scopes] : data.scopes,
      }
      formData.value = {
        ...data,
        scopes: [...normalizedScopes],
        scopeMode: resolveAPIKeyScopeMode(
          data,
          loadedScopes.map(({ name }) => name),
        ),
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
    isNamespaceEnabled.value = isNamespacedAPIKey(formData.value.namespace)
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
    ({ name }) =>
      name !== SYSTEM_SCOPE && (!isNamespacedKey.value || isAllowedNamespacedAPIKeyScope(name)),
  ),
)
const hasLegacyMixedScopes = computed(
  () =>
    formData.value.scopeMode === ScopeMode.Custom && formData.value.scopes.includes(SYSTEM_SCOPE),
)
const hasLegacyNamespacedScopes = computed(
  () =>
    isNamespacedKey.value &&
    (hasLegacyMixedScopes.value ||
      formData.value.scopes.some((scope) => !isAllowedNamespacedAPIKeyScope(scope))),
)

const handleScopeModeChanged = (mode: string | number | boolean | undefined) => {
  if (mode === ScopeMode.Custom) {
    formData.value.scopes = formData.value.scopes.filter(
      (scope) =>
        scope !== SYSTEM_SCOPE && (!isNamespacedKey.value || isAllowedNamespacedAPIKeyScope(scope)),
    )
  }
  nextTick(() => formCom.value?.clearValidate('scopes'))
}

const handleRoleChanged = () => {
  if (formData.value.role === UserRole.Publisher || lastRole.value === UserRole.Publisher) {
    formData.value.scopeMode = ScopeMode.RoleDefault
    formData.value.scopes = []
  }
  lastRole.value = formData.value.role as UserRole
  nextTick(() => formCom.value?.clearValidate('scopes'))
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
  const scopes = getAPIKeyScopesForSubmit(scopeMode, data.scopes)
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
