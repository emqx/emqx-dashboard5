<template>
  <el-dialog
    v-model="showDialog"
    :width="600"
    custom-class="API-key-dialog"
    :title="dialogTitle"
    :z-index="2000"
  >
    <el-form
      ref="formCom"
      label-position="top"
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
        <el-col :span="24" v-if="operationType === 'view'">
          <el-form-item label="API Key">
            <el-row :gutter="12">
              <el-col :span="21">
                <el-input v-model="formData.api_key" disabled />
              </el-col>
              <el-col :span="3">
                <el-button ref="btnCopyAPIKey" @click="copyText(formData.api_key)">
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
        <el-col :span="24">
          <el-form-item :label="tl('desc')" prop="description">
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
import { computed, defineProps, defineEmits, ref, PropType, Ref, watch, nextTick } from 'vue'
import { ElDialog } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { APIKeyFormWhenCreating, APIKey, APIKeyFormWhenEditing } from '@/types/systemModule'
import { createAPIKey, updateAPIKey } from '@/api/systemModule'
import { ElInput } from 'element-plus'
import APIKeyResultDialog from './APIKeyResultDialog.vue'
import useCopy from '@/hooks/useCopy'

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

const { t } = useI18n()
const tl = (key: string, collection = 'APIKey') => {
  return t(collection + '.' + key)
}

const createRawFormData = () => ({
  name: '',
  expired_at: undefined,
  desc: '',
  enable: true,
})

const formCom = ref()
const formData: Ref<APIKeyFormWhenCreating | APIKey> = ref(createRawFormData())
const rules = {
  name: [
    {
      required: true,
      message: tl('keyNameRequired'),
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

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const dialogTitle = computed(
  () =>
    ({
      create: `${tl('create', 'Base')}  ${tl('APIKey', 'components')}`,
      edit: `${tl('edit', 'Base')}  ${tl('APIKey', 'components')}`,
      view: tl('apiKeyDetail'),
    }[props.operationType]),
)

watch(showDialog, async (val) => {
  if (val) {
    if (props.operationType !== 'create') {
      formData.value = { ...(props.APIKeyData as APIKey) }
      if (props.operationType === 'view') {
        await nextTick()
      }
    } else {
      formData.value = createRawFormData()
      await nextTick()
      formCom.value.clearValidate()
    }
  }
})

const { copyText } = useCopy()

const todayStartTime = new Date().setHours(0, 0, 0, 0)
const isItEarlierThanToday = (date: Date) => date.getTime() < todayStartTime

const handleExpiredAt = (formData: APIKeyFormWhenCreating) => {
  const ret = { ...formData }
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

const submitAddedData = () => createAPIKey(handleExpiredAt(formData.value))

const submitUpdatedData = () => {
  const { name, ...data } = formData.value as APIKeyFormWhenEditing
  return updateAPIKey(name, handleExpiredAt(data as APIKeyFormWhenCreating))
}

const submit = async () => {
  try {
    await formCom.value.validate()
    isSubmitting.value = true
    if (props.operationType === 'create') {
      const data = await submitAddedData()
      createdResult.value = data
      showResultDialog.value = true
    } else if (props.operationType === 'edit') {
      await submitUpdatedData()
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
    .el-input.is-disabled .el-input__inner,
    .el-textarea.is-disabled .el-textarea__inner {
      background-color: var(--color-bg-primary);
      border-color: var(--color-border-primary);
      color: var(--color-text-primary);
    }
  }
}
</style>
