<template>
  <el-form
    class="exhook-create-form"
    ref="formCom"
    label-position="top"
    require-asterisk-position="right"
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
        <el-form-item prop="pool_size">
          <template #label>
            <label>Pool Size</label>
            <InfoTooltip :content="tl('poolSizeDesc')" />
          </template>
          <el-input v-model.number="formData.pool_size" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="request_timeout">
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
        <el-form-item prop="failed_action">
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
        <el-form-item prop="auto_reconnect">
          <template #label>
            <label>{{ tl('autoReconnectInterval') }}</label>
          </template>
          <Oneof
            v-model="formData.auto_reconnect"
            in-row
            disabled-label=" "
            :items="[{ type: 'duration' }, { symbols: [false], type: 'enum' }]"
            :input-props="{ enabledUnits: ['ms', 's', 'm', 'h', 'd'] }"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <CommonTLSConfig v-model="formData.ssl" :is-edit="isEdit" />
  </el-form>
</template>

<script lang="ts">
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import { ExhookFailedAction } from '@/types/enum'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExhookForm',
})
</script>

<script setup lang="ts">
import InfoTooltip from '@/components/InfoTooltip.vue'
import Oneof from '@/components/Oneof.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useFormRules from '@/hooks/useFormRules'
import { Exhook, ExhookFormForCreate } from '@/types/systemModule'
import {
  PropType,
  WritableComputedRef,
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  ref,
} from 'vue'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()
const tl = (key: string, moduleName = 'Exhook') => t(`${moduleName}.${key}`)
const { createRequiredRule, createIntFieldRule, createCommonIdRule } = useFormRules()

const formCom = ref()

const rules = {
  name: [...createRequiredRule(tl('name')), ...createCommonIdRule()],
  url: createRequiredRule('URL'),
  pool_size: createIntFieldRule(),
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
