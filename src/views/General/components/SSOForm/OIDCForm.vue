<template>
  <el-form
    class="ldap-form"
    ref="FormCom"
    require-asterisk-position="right"
    :model="formData"
    :rules="rules"
    :label-width="150"
  >
    <el-form-item prop="enable" :label="tl('SSOEnable', { backend: 'LDAP' })">
      <el-switch v-model="formData.enable" />
    </el-form-item>
    <el-form-item prop="issuer" :label="tl('issuer')">
      <el-input v-model="formData.issuer" />
    </el-form-item>
    <el-form-item prop="clientid" :label="t('Base.clientid')">
      <el-input v-model="formData.clientid" />
    </el-form-item>
    <el-form-item prop="secret" :label="tl('secret')">
      <el-input
        v-model="formData.secret"
        type="password"
        show-password
        autocomplete="one-time-code"
      />
    </el-form-item>
    <el-form-item prop="scopes" :label="tl('scopes')">
      <ArrayEditor v-model="formData.scopes" />
    </el-form-item>
    <el-form-item prop="name_var" :label="tl('nameVar')">
      <el-input v-model="formData.name_var" />
    </el-form-item>
    <el-form-item prop="dashboard_addr">
      <template #label>
        <FormItemLabel :label="tl('dashboardAddr')" :desc="tl('dashboardAddrDesc')" />
      </template>
      <el-input v-model="formData.dashboard_addr" />
    </el-form-item>
    <el-form-item prop="session_expiry" :label="tl('sessionExpiry')">
      <TimeInputWithUnitSelect v-model="formData.session_expiry" />
    </el-form-item>
    <el-form-item prop="require_pkce" :label="tl('requirePkce')">
      <el-switch v-model="formData.require_pkce" />
    </el-form-item>
    <el-form-item prop="preferred_auth_methods" :label="tl('preferredAuthMethods')">
      <el-select v-model="formData.preferred_auth_methods" multiple>
        <el-option
          v-for="item in preferredAuthMethodsOpts"
          :key="item"
          :value="item"
          :label="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item prop="provider" :label="tl('provider')">
      <el-select v-model="formData.provider">
        <el-option v-for="item in providerOpts" :key="item" :value="item" :label="item" />
      </el-select>
    </el-form-item>
    <el-form-item prop="fallback_methods" :label="tl('fallbackMethods')">
      <ArrayEditor v-model="formData.fallback_methods" />
    </el-form-item>
    <el-form-item :label="tl('JWK')">
      <el-select v-model="selectedJwkType">
        <el-option v-for="{ label, value } in jwkOpts" :key="value" :value="value" :label="label" />
      </el-select>
    </el-form-item>
    <el-form-item
      :label="t('Auth.file')"
      prop="client_jwks.file"
      v-if="formData.client_jwks && formData.client_jwks !== JWK_NONE"
    >
      <div class="monaco-container">
        <Monaco
          v-model="(formData.client_jwks as any).file"
          :id="createRandomString()"
          lang="json"
        />
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { createRandomString } from '@/common/tools'
import ArrayEditor from '@/components/ArrayEditor.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import Monaco from '@/components/Monaco.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import type { OIDBForm } from '@/types/typeAlias'
import { OIDCPreferredAuthMethods, OIDCProvider } from '@/types/typeAlias'
import { isObject } from 'lodash'
import type { PropType } from 'vue'
import { computed, defineEmits, defineExpose, defineProps, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<OIDBForm>,
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
  issuer: createRequiredRule(tl('issuer')),
  clientid: createRequiredRule(t('Base.clientid')),
  secret: createRequiredRule(tl('secret')),
  'client_jwks.file': createRequiredRule(t('Auth.file')),
}

const preferredAuthMethodsOpts = Object.values(OIDCPreferredAuthMethods)
const providerOpts = Object.values(OIDCProvider)

const JWK_NONE = 'none'
const selectedJwkType = computed<string>({
  get() {
    if (isObject(formData.value.client_jwks)) {
      return formData.value.client_jwks.type
    }
    return formData.value.client_jwks || JWK_NONE
  },
  set(val: any) {
    if (val === JWK_NONE) {
      formData.value.client_jwks = JWK_NONE
    } else {
      formData.value.client_jwks = { type: val, file: '' }
    }
  },
})

const jwkOpts = [
  { value: 'none', label: t('Base.none') },
  { value: 'file', label: t('Auth.file') },
]

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
