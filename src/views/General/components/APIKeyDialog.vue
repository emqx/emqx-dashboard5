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
        <el-col :span="24" v-if="!isPublisherRole">
          <el-form-item prop="scopes">
            <template #label>
              <span>{{ tl('scopes') }}</span>
              <el-tooltip
                v-if="formData.scopesNeedUpdate"
                :content="tl('legacyScopesTip')"
                placement="top"
              >
                <el-icon class="legacy-scopes-icon"><Warning /></el-icon>
              </el-tooltip>
            </template>
            <el-select
              v-model="formData.scopes"
              multiple
              clearable
              :placeholder="tl('scopesPlaceholder')"
              :disabled="operationType === 'view'"
              style="width: 100%"
            >
              <el-option
                v-for="scope in availableScopes"
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
        <el-button @click="showDialog = false">{{
          operationType === 'view' ? tl('close') : $t('Base.cancel')
        }}</el-button>
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
import { UserRole } from '@/types/enum'
import { getManagedNamespaceList } from '@/api/config'
import { createAPIKey, updateAPIKey, getAPIKeyScopes } from '@/api/systemModule'
import { GLOBAL_NAMESPACE } from '@/common/constants'
import {
  APIKey,
  APIKeyFormWhenCreating,
  APIKeyFormWhenEditing,
  APIKeyScope,
} from '@/types/systemModule'
import { isLegacyUnsetScopes, normalizeScopes, sanitizeScopesForSubmit } from '@/common/scopes'
import APIKeyResultDialog from './APIKeyResultDialog.vue'
import { Warning } from '@element-plus/icons-vue'

export type OperationType = 'create' | 'view' | 'edit'
type APIKeyFormData = Omit<APIKeyFormWhenCreating, 'scopes'> &
  Partial<Omit<APIKey, 'scopes'>> & {
    scopes?: string[]
    scopesNeedUpdate?: boolean
  }
const PUBLISHER_SCOPES = ['publish']

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

const createRawFormData = () => ({
  name: '',
  expired_at: undefined,
  desc: '',
  enable: true,
  role: 'administrator',
  scopes: undefined as string[] | undefined,
})

const formCom = ref()
const formData: Ref<APIKeyFormData> = ref(createRawFormData())
const availableScopes: Ref<APIKeyScope[]> = ref([])
const availableScopesPromise: Ref<Promise<APIKeyScope[]> | undefined> = ref(undefined)
const initialRole = ref<UserRole>(UserRole.Admin)
const lastRole = ref<UserRole>(UserRole.Admin)
const { createLetterStartRule } = useFormRules()
const rules = {
  name: [
    {
      required: true,
      message: tl('keyNameRequired'),
    },
    ...createLetterStartRule(),
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
const namespaceOptions = ref<Array<string>>([])
const isNamespaceOptionsLoaded = ref(false)
const queryNamespaceList = async () => {
  try {
    const res = await getManagedNamespaceList({ limit: 10000 })
    namespaceOptions.value = res.data
    isNamespaceOptionsLoaded.value = true
  } catch (error) {
    //
  }
}
const toggleNamespaceEnabled = () => {
  if (isNamespaceEnabled.value && !isNamespaceOptionsLoaded.value) {
    queryNamespaceList()
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

const loadAvailableScopes = () => {
  availableScopesPromise.value = getAPIKeyScopes().then((scopes) => {
    availableScopes.value = scopes
    return scopes
  })
  return availableScopesPromise.value
}

watch(showDialog, async (val) => {
  if (val) {
    loadAvailableScopes()
    if (props.operationType !== 'create') {
      const data = props.APIKeyData as APIKey
      formData.value = {
        ...data,
        scopes: normalizeScopes(data.scopes),
        scopesNeedUpdate: isLegacyUnsetScopes(data.scopes),
      }
      initialRole.value = formData.value.role as UserRole
      lastRole.value = formData.value.role as UserRole
      if (props.operationType === 'view') {
        await nextTick()
      }
    } else {
      await nextTick()
      initialRole.value = formData.value.role as UserRole
      lastRole.value = formData.value.role as UserRole
      formCom.value.clearValidate()
    }
    isNamespaceEnabled.value =
      !!formData.value.namespace && formData.value.namespace !== GLOBAL_NAMESPACE
  } else {
    formData.value = createRawFormData()
    initialRole.value = UserRole.Admin
    lastRole.value = UserRole.Admin
  }
})

const { copyText } = useCopy()

const { apiKeyRoleOptions } = useRole()
const isPublisherRole = computed(() => formData.value.role === UserRole.Publisher)

const isOnlyPublisherScope = (scopes: APIKeyFormData['scopes']) =>
  Array.isArray(scopes) && scopes.length === 1 && scopes[0] === PUBLISHER_SCOPES[0]

const getAllScopeNames = () => availableScopes.value.map(({ name }) => name)

const isChangingFromPublisher = (role?: string) =>
  initialRole.value === UserRole.Publisher && role !== UserRole.Publisher

const handleRoleChanged = () => {
  if (formData.value.role === UserRole.Publisher) {
    formData.value.scopes = [...PUBLISHER_SCOPES]
  } else if (lastRole.value === UserRole.Publisher && formData.value.role === UserRole.Admin) {
    formData.value.scopes = getAllScopeNames()
  } else if (lastRole.value === UserRole.Publisher && isOnlyPublisherScope(formData.value.scopes)) {
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

const handleDataForSubmitting = <T extends APIKeyFormData | Omit<APIKeyFormData, 'name'>>(
  formData: T,
) => {
  const ret = { ...formData }
  delete ret.scopesNeedUpdate
  if (ret.role === UserRole.Publisher) {
    ret.scopes = [...PUBLISHER_SCOPES]
  }
  if (
    isChangingFromPublisher(ret.role) &&
    (!Array.isArray(ret.scopes) || ret.scopes.length === 0)
  ) {
    ret.scopes = getAllScopeNames()
  }
  sanitizeScopesForSubmit(ret)
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

const submitUpdatedData = async () => {
  const { name, ...data } = formData.value as APIKeyFormWhenEditing
  if (isChangingFromPublisher(data.role) && availableScopes.value.length === 0) {
    await (availableScopesPromise.value ?? loadAvailableScopes())
  }
  return updateAPIKey(
    name,
    processAPIKeyRecordForUpdating(handleDataForSubmitting(data as APIKeyFormData)),
  )
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
}
.scope-desc {
  color: var(--el-text-color-secondary);
  margin-left: 8px;
  font-size: 12px;
  font-weight: normal;
}
.legacy-scopes-icon {
  margin-left: 4px;
  color: var(--el-color-warning);
  cursor: help;
  vertical-align: -2px;
}
</style>
