<template>
  <el-form
    class="saml-form"
    ref="FormCom"
    :model="formData"
    :rules="rules"
    :label-width="180"
    :validate-on-rule-change="false"
  >
    <el-form-item prop="enable" :label="tl('SSOEnable', { backend: 'SAML' })">
      <el-switch v-model="formData.enable" />
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
        <label class="info-label">{{ tl('ssoUrl') }}</label>
        <p class="info-value">{{ ssoAddress }}</p>
        <el-tooltip :content="t('Base.copy')" placement="top">
          <el-button class="btn-copy" link type="info">
            <el-icon @click="copyText(ssoAddress)" class="icon-copy"><CopyDocument /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <div class="info-item">
        <label class="info-label">{{ tl('metaDataUrl') }}</label>
        <p class="info-value">{{ metadataAddress }}</p>
        <el-tooltip :content="t('Base.copy')" placement="top">
          <el-button class="btn-copy" link type="info">
            <el-icon @click="copyText(metadataAddress)" class="icon-copy"><CopyDocument /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <el-form-item prop="idp_metadata_url" :label="tl('idpMetadataUrl')">
      <el-input v-model="formData.idp_metadata_url" placeholder="https://idp.example.com" />
    </el-form-item>
    <el-form-item prop="sp_sign_request">
      <template #label>
        <FormItemLabel :label="tl('spSignRequest')" :desc="tl('spSignRequestDesc')" />
      </template>
      <el-switch v-model="formData.sp_sign_request" />
    </el-form-item>
    <el-collapse-transition>
      <div class="keys-container" v-if="formData.sp_sign_request">
        <el-form-item prop="sp_public_key" :label="tl('spPublicKey')">
          <CertFileInput v-model="formData.sp_public_key" placeholder="" :is-edit="isEdit" />
        </el-form-item>
        <el-form-item prop="sp_private_key" :label="tl('spPrivateKey')">
          <CertFileInput v-model="formData.sp_private_key" placeholder="" :is-edit="isEdit" />
        </el-form-item>
      </div>
    </el-collapse-transition>
  </el-form>
</template>

<script setup lang="ts">
import { FormRules } from '@/types/common'
import { EmqxDashboardSsoSamlSaml } from '@/types/schemas/dashboardSingleSignOn.schemas'
import { CopyDocument } from '@element-plus/icons-vue'

const SAML_SSO_PATH = '/api/v5/sso/saml/acs'
const SAML_SSO_METADATA_PATH = '/api/v5/sso/saml/metadata'

const props = defineProps({
  modelValue: {
    type: Object as PropType<EmqxDashboardSsoSamlSaml>,
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
const fixedRules: FormRules = {
  dashboard_addr: createRequiredRule(tl('dashboardAddr')),
  idp_metadata_url: createRequiredRule(tl('idpMetadataUrl')),
}
const rules = computed(() => ({
  ...fixedRules,
  ...(formData.value.sp_sign_request
    ? {
        sp_public_key: createRequiredRule(tl('spPublicKey')),
        sp_private_key: createRequiredRule(tl('spPrivateKey')),
      }
    : {}),
}))

const ssoAddress = computed(() => formData.value.dashboard_addr + SAML_SSO_PATH)
const metadataAddress = computed(() => formData.value.dashboard_addr + SAML_SSO_METADATA_PATH)

const { copyText } = useCopy()

const validate = () => FormCom.value.validate()
defineExpose({ validate })
</script>

<style lang="scss">
.saml-form {
  .keys-container {
    padding: 2px 0 0;
  }
}
</style>
