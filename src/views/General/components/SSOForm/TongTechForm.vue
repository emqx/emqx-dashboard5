<template>
  <el-form
    class="ldap-form tong-form"
    ref="FormCom"
    :model="formData"
    :rules="rules"
    :label-width="150"
  >
    <el-form-item prop="enable" :label="tl('SSOEnable', { backend: tl('tongtech') })">
      <el-switch v-model="formData.enable" />
    </el-form-item>
    <el-form-item prop="dashboard_addr">
      <template #label>
        <FormItemLabel :label="tl('dashboardAddr')" :desc="tl('dashboardAddrDesc')" />
      </template>
      <el-input v-model="formData.dashboard_addr" />
    </el-form-item>
    <el-form-item prop="auth_server_addr">
      <template #label>
        <FormItemLabel :label="tl('authServerAddr')" :desc="tl('authServerAddrDesc')" />
      </template>
      <el-input v-model="formData.auth_server_addr" />
    </el-form-item>
    <el-form-item prop="client_id" label="Client ID">
      <el-input v-model="formData.client_id" />
    </el-form-item>
    <el-form-item prop="client_secret" label="Client Secret">
      <el-input
        type="password"
        v-model="formData.client_secret"
        show-password
        autocomplete="one-time-code"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import FormItemLabel from '@/components/FormItemLabel.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { DashboardTongauth } from '@/types/schemas/dashboardSingleSignOn.schemas'
import { PropType, computed, defineEmits, defineExpose, defineProps, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<DashboardTongauth>,
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
  dashboard_addr: createRequiredRule(tl('dashboardAddr')),
  auth_server_addr: createRequiredRule(tl('authServerAddr')),
  client_id: createRequiredRule('Client ID'),
  client_secret: createRequiredRule('Client Secret'),
}

const validate = () => FormCom.value.validate()
defineExpose({ validate })
</script>

<style lang="scss">
.ldap-form {
  .TLS-enable-config .TLS-input {
    width: 100%;
  }
}
</style>
