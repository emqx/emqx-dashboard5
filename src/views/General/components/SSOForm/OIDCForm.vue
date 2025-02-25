<template>
  <el-form
    class="ldap-form"
    ref="FormCom"
    :model="formData"
    :rules="rules"
    :label-width="state.lang === 'zh' ? 140 : 224"
  >
    <el-form-item prop="enable" :label="tl('SSOEnable', { backend: 'OIDC' })">
      <el-switch v-model="formData.enable" />
    </el-form-item>
    <el-form-item prop="provider" :label="tl('provider')">
      <el-select v-model="formData.provider">
        <el-option
          v-for="{ label, value } in providerOpts"
          :key="value"
          :value="value"
          :label="label"
        />
      </el-select>
    </el-form-item>
    <el-form-item prop="issuer" :label="tl('issuer')">
      <el-input v-model="formData.issuer" />
    </el-form-item>
    <el-form-item prop="clientid" label="Client ID">
      <el-input v-model="formData.clientid" />
    </el-form-item>
    <el-form-item prop="secret" label="Client Secret">
      <CustomInputPassword v-model="formData.secret" />
    </el-form-item>
    <el-form-item prop="dashboard_addr">
      <template #label>
        <FormItemLabel :label="tl('dashboardAddr')" :desc="tl('dashboardAddrDesc')" />
      </template>
      <el-input v-model="formData.dashboard_addr" />
    </el-form-item>
    <div class="info-idp-block">
      <p class="info-desc">{{ tl('infoIdPDesc') }}</p>
      <div class="info-item is-first">
        <label class="info-label">{{ tl('signInRedirectUri') }}</label>
        <p class="info-value">{{ redirectUri }}</p>
        <el-tooltip :content="t('Base.copy')" placement="top">
          <el-button class="btn-copy" link type="info">
            <el-icon @click="copyText(redirectUri)" class="icon-copy"><CopyDocument /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <AdvancedSettingContainer>
      <el-form-item prop="scopes" :label="tl('scopes')">
        <ArrayEditor v-model="formData.scopes" />
      </el-form-item>
      <el-form-item prop="name_var" :label="tl('nameVar')">
        <el-input v-model="formData.name_var" />
      </el-form-item>
      <el-form-item
        prop="session_expiry"
        :label="`${tl('sessionExpiry')}${
          !formData.session_expiry || typeof formData.session_expiry === 'number'
            ? `(${t('Exhook.second')})`
            : ''
        }`"
      >
        <TimeInputWithUnitSelect
          v-if="typeof formData.session_expiry === 'string'"
          v-model="formData.session_expiry"
        />
        <CustomInputNumber v-else v-model="formData.session_expiry" />
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
      <el-form-item prop="fallback_methods" :label="tl('fallbackMethods')">
        <ArrayEditor v-model="formData.fallback_methods" />
      </el-form-item>
      <el-form-item :label="tl('JWK')">
        <el-select v-model="selectedJwkType">
          <el-option
            v-for="{ label, value } in jwkOpts"
            :key="value"
            :value="value"
            :label="label"
          />
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
    </AdvancedSettingContainer>
  </el-form>
</template>

<script setup lang="ts">
import AdvancedSettingContainer from '@/components/AdvancedSettingContainer.vue'
import ArrayEditor from '@/components/ArrayEditor.vue'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import Monaco from '@/components/Monaco.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'

import type { OIDBForm } from '@/types/typeAlias'
import { OIDCPreferredAuthMethods, OIDCProvider } from '@/types/typeAlias'
import { CopyDocument } from '@element-plus/icons-vue'

const OIDC_REDIRECT = '/api/v5/sso/oidc/callback'

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
const { state } = useStore()

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

const { copyText } = useCopy()
const redirectUri = computed(() => formData.value.dashboard_addr + OIDC_REDIRECT)

const preferredAuthMethodsOpts = Object.values(OIDCPreferredAuthMethods)
const providerOpts = [
  { value: OIDCProvider.generic, label: tl('generic') },
  { value: OIDCProvider.okta, label: 'Okta' },
]

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
