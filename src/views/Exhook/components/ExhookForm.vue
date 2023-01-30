<template>
  <el-form
    class="exhook-create-form"
    ref="formCom"
    label-position="top"
    :model="formData"
    :rules="rules"
  >
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item required prop="name" :label="tl('name')">
          <el-input v-model="formData.name" :disabled="isEdit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item required prop="url">
          <template #label>
            <label>URL</label>
            <InfoTooltip :content="tl('urlDesc')" />
          </template>
          <el-input v-model="formData.url" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item required prop="pool_size">
          <template #label>
            <label>Pool Size</label>
            <InfoTooltip :content="tl('poolSizeDesc')" />
          </template>
          <el-input v-model.number="formData.pool_size" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item required prop="request_timeout">
          <template #label>
            <label>{{ t('Auth.requestTimeout') }}</label>
            <InfoTooltip :content="tl('requestTimeOutDesc')" />
          </template>
          <TimeInputWithUnitSelect
            v-model="formData.request_timeout"
            :enabled-units="['ms', 's', 'm', 'h', 'd']"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item required prop="failed_action">
          <template #label>
            <label>{{ tl('failedAction') }}</label>
            <InfoTooltip :content="tl('failedActionDesc')" />
          </template>
          <el-select v-model="formData.failed_action">
            <el-option :label="ExhookFailedAction.Deny" :value="ExhookFailedAction.Deny" />
            <el-option :label="ExhookFailedAction.Ignore" :value="ExhookFailedAction.Ignore" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <template #label>
            <label>{{ tl('autoReconnect') }}</label>
            <InfoTooltip :content="tl('autoReconnectDesc')" />
          </template>
          <el-select v-model="autoReconnect">
            <el-option label="true" :value="true" />
            <el-option label="false" :value="false" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12" v-if="autoReconnect">
        <el-form-item required prop="auto_reconnect">
          <template #label>
            <label>{{ tl('autoReconnectInterval') }}</label>
          </template>
          <TimeInputWithUnitSelect
            v-model="formData.auto_reconnect"
            :enabled-units="['ms', 's', 'm', 'h', 'd']"
            default-unit="s"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <CommonTLSConfig v-model="formData.ssl" :is-edit="isEdit" />
  </el-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ExhookFailedAction } from '@/types/enum'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'

export default defineComponent({
  name: 'ExhookForm',
})
</script>

<script setup lang="ts">
import {
  ref,
  defineProps,
  defineEmits,
  defineExpose,
  computed,
  PropType,
  WritableComputedRef,
} from 'vue'
import { Exhook, ExhookFormForCreate } from '@/types/systemModule'
import { useI18n } from 'vue-i18n'
import useFormRules from '@/hooks/useFormRules'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<Exhook | ExhookFormForCreate>,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const formData: WritableComputedRef<Exhook | ExhookFormForCreate> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const autoReconnect = computed({
  get() {
    return !(formData.value.auto_reconnect === false)
  },
  set(val: boolean) {
    if (!val) {
      formData.value.auto_reconnect = val
    } else {
      formData.value.auto_reconnect = ''
    }
  },
})

const { t } = useI18n()
const tl = (key: string, moduleName = 'Exhook') => t(`${moduleName}.${key}`)
const { createRequiredRule, createIntFieldRule, createStringWithUnitFieldRule } = useFormRules()

const formCom = ref()

const timeoutUnits = [
  { label: 'ms', value: 'ms' },
  { label: 's', value: 's' },
  { label: 'm', value: 'm' },
  { label: 'h', value: 'h' },
  { label: 'd', value: 'd' },
]

const rules = {
  name: createRequiredRule(tl('name')),
  url: createRequiredRule('URL'),
  pool_size: [...createRequiredRule('Pool Size'), ...createIntFieldRule()],
  request_timeout: createStringWithUnitFieldRule(timeoutUnits.map(({ value }) => value)),
  failed_action: createRequiredRule(tl('failedAction'), 'select'),
  auto_reconnect: createRequiredRule(tl('autoReconnectInterval'), 'input'),
}

const validate = async () => formCom.value.validate()

defineExpose({
  validate,
})
</script>

<style lang="scss">
.exhook-create-form {
  .TLS-base-config-title {
    font-size: 14 px;
    font-weight: normal;
  }
}
</style>
