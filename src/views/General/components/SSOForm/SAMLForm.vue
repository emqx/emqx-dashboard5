<template>
  <el-form
    class="saml-form"
    ref="FormCom"
    require-asterisk-position="right"
    :model="formData"
    :rules="rules"
    :label-width="150"
    :validate-on-rule-change="false"
  >
    <el-form-item prop="enable" :label="tl('SSOEnable', { backend: 'SAML' })">
      <el-switch v-model="formData.enable" />
    </el-form-item>
    <el-form-item prop="dashboard_addr" :label="tl('dashboardAddr')">
      <el-input v-model="formData.dashboard_addr" />
    </el-form-item>
    <el-form-item prop="idp_metadata_url" :label="tl('idpMetadataUrl')">
      <el-input v-model="formData.idp_metadata_url" placeholder="https://idp.example.com" />
    </el-form-item>
    <el-form-item prop="sp_sign_request" :label="tl('spSignRequest')">
      <el-switch v-model="formData.sp_sign_request" />
    </el-form-item>
    <el-form-item prop="sp_public_key" :label="tl('spPublicKey')">
      <CertFileInput v-model="formData.sp_public_key" placeholder="" />
    </el-form-item>
    <el-form-item prop="sp_private_key" :label="tl('spPrivateKey')">
      <CertFileInput v-model="formData.sp_private_key" placeholder="" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import CertFileInput from '@/components/TLSConfig/CertFileInput.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { FormRules } from '@/types/common'
import { EmqxDashboardSsoSamlSaml } from '@/types/schemas/dashboardSingleSignOn.schemas'
import { PropType, computed, defineEmits, defineExpose, defineProps, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<EmqxDashboardSsoSamlSaml>,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue', 'save'])

const { tl } = useI18nTl('General')

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

const validate = () => FormCom.value.validate()
defineExpose({ validate })
</script>
