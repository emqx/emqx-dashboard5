<template>
  <el-form class="ldap-form" ref="FormCom" :model="formData" :rules="rules" :label-width="150">
    <el-form-item prop="enable" :label="tl('SSOEnable', { backend: 'LDAP' })">
      <el-switch v-model="formData.enable" />
    </el-form-item>
    <el-form-item prop="server" :label="t('Auth.server')">
      <el-input v-model="formData.server" />
    </el-form-item>
    <el-form-item prop="username" :label="t('Base.username')">
      <el-input v-model="formData.username" />
    </el-form-item>
    <el-form-item prop="password" :label="t('Base.password')">
      <CustomInputPassword v-model="formData.password" />
    </el-form-item>
    <el-form-item prop="base_dn" :label="tl('baseDN')">
      <el-input v-model="formData.base_dn" />
    </el-form-item>
    <el-form-item prop="filter">
      <template #label>
        <FormItemLabel
          :label="tl('LDAPFilter')"
          :desc="tl('LDAPFilterDesc')"
          desc-marked
          popper-class="is-wider"
        />
      </template>
      <el-input v-model="formData.filter" />
    </el-form-item>
    <!-- TODO: fix type error -->
    <CommonTLSConfig
      v-if="formData.ssl"
      class="tls-config-form"
      v-model="formData.ssl"
      :is-edit="isEdit"
    />
  </el-form>
</template>

<script setup lang="ts">
import { EmqxDashboardSsoLdapLdap } from '@/types/schemas/dashboardSingleSignOn.schemas'

const props = defineProps({
  modelValue: {
    type: Object as PropType<EmqxDashboardSsoLdapLdap>,
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
  server: createRequiredRule(t('Auth.server')),
  username: createRequiredRule(t('Base.username')),
  base_dn: createRequiredRule(tl('baseDN')),
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
