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
          <el-form-item :label="tl('scopes')" prop="scopes">
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
import {
  APIKeyFormWhenCreating,
  APIKey,
  APIKeyFormWhenEditing,
  APIKeyScope,
} from '@/types/systemModule'
import { createAPIKey, updateAPIKey, getAPIKeyScopes } from '@/api/systemModule'
import APIKeyResultDialog from './APIKeyResultDialog.vue'

export type OperationType = 'create' | 'view' | 'edit'

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
const formData: Ref<APIKeyFormWhenCreating | APIKey> = ref(createRawFormData())
const availableScopes: Ref<APIKeyScope[]> = ref([])
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

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, async (val) => {
  if (val) {
    getAPIKeyScopes().then((scopes) => {
      availableScopes.value = scopes
    })
    if (props.operationType !== 'create') {
      formData.value = { ...(props.APIKeyData as APIKey) }
      if (props.operationType === 'view') {
        await nextTick()
      }
    } else {
      await nextTick()
      formCom.value.clearValidate()
    }
  } else {
    formData.value = createRawFormData()
  }
})

const { copyText } = useCopy()

const { apiKeyRoleOptions } = useRole()
const isPublisherRole = computed(() => formData.value.role === UserRole.Publisher)

const handleRoleChanged = () => {
  if (formData.value.role === UserRole.Publisher) {
    formData.value.scopes = undefined
  }
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

const handleDataForSubmitting = (formData: APIKeyFormWhenCreating) => {
  const ret = { ...formData }
  if (ret.role === UserRole.Publisher) {
    ret.scopes = undefined
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

const submitAddedData = () => createAPIKey(handleDataForSubmitting(formData.value))

const submitUpdatedData = () => {
  const { name, ...data } = formData.value as APIKeyFormWhenEditing
  return updateAPIKey(name, handleDataForSubmitting(data as APIKeyFormWhenCreating))
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
}
.scope-desc {
  color: var(--el-text-color-secondary);
  margin-left: 8px;
  font-size: 12px;
  font-weight: normal;
}
</style>
