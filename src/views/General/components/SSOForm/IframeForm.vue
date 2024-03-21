<template>
  <el-form
    class="iframe-form"
    ref="FormCom"
    require-asterisk-position="right"
    :model="formData"
    :rules="rules"
    :label-width="200"
  >
    <el-form-item prop="enable" :label="tl('SSOEnable', { backend: tl('customToken') })">
      <el-switch v-model="formData.enable" />
    </el-form-item>
    <el-form-item prop="method" :label="t('Auth.method')">
      <el-select v-model="formData.method">
        <el-option label="GET" value="get" />
      </el-select>
    </el-form-item>
    <el-form-item prop="url" label="URL">
      <el-input v-model="formData.url" />
    </el-form-item>
    <el-form-item prop="pool_size" :label="t('RuleEngine.connectionPoolSize')">
      <TimeInputWithUnitSelect v-model="formData.pool_size" />
    </el-form-item>
    <el-form-item prop="request_timeout" :label="t('Auth.requestTimeout')">
      <TimeInputWithUnitSelect v-model="formData.request_timeout" />
    </el-form-item>
    <el-form-item prop="connect_timeout" :label="t('Auth.connectTimeout')">
      <TimeInputWithUnitSelect v-model="formData.connect_timeout" />
    </el-form-item>
    <el-form-item prop="enable_pipelining" :label="t('Auth.httpPipelining')">
      <CustomInputNumber v-model="formData.enable_pipelining" />
    </el-form-item>
    <CommonTLSConfig
      v-if="formData.ssl"
      class="tls-config-form"
      v-model="(formData as any).ssl"
      :is-edit="isEdit"
    />
  </el-form>
</template>

<script setup lang="ts">
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { IframeForm } from '@/types/typeAlias'
import { PropType, computed, defineEmits, defineExpose, defineProps, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<IframeForm>,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const { t, tl } = useI18nTl('General')

const FormCom = ref()

const formData = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { createRequiredRule } = useFormRules()
const rules = {
  url: createRequiredRule('URL'),
  method: createRequiredRule(t('Auth.method'), 'select'),
}

const validate = () => FormCom.value.validate()
defineExpose({ validate })
</script>

<style lang="scss">
.iframe-form {
  .TLS-enable-config .TLS-input {
    width: 100%;
  }
}
</style>
