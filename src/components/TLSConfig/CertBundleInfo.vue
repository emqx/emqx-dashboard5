<template>
  <el-form label-position="top" v-loading.lock="isLoading">
    <template v-for="key in certBundleInfoKeyArr" :key="key">
      <el-form-item v-if="certBundleInfo[key]" :label="certBundleInfoKeyLabelMap.get(key)">
        <ConfigItemDataLook
          class="TLS-input"
          :value="certBundleInfo[key].path"
          :allow-reset="false"
        />
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup lang="ts">
import { CertBundleInfo } from '@/types/typeAlias'
import ConfigItemDataLook from './ConfigItemDataLook.vue'

const props = defineProps<{
  name?: string
  namespace?: string
}>()

const { getCertBundleInfo: requestCertBundleInfo } = useCertBundle()

const isLoading = ref(false)
const certBundleInfo = ref<CertBundleInfo>({})

const getCertBundleInfo = async () => {
  if (!props.name) {
    return
  }
  try {
    isLoading.value = true
    certBundleInfo.value = await requestCertBundleInfo(props.name, props.namespace)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
getCertBundleInfo()

const { t } = useI18n()
const certBundleInfoKeyLabelMap: Map<keyof CertBundleInfo, string> = new Map([
  ['acc_key', t('Base.acmeKey')],
  ['chain', 'TLS Cert'],
  ['key', 'TLS Key'],
  ['key_password', t('Base.keyPassword')],
  ['ca', 'CA Cert'],
])
const certBundleInfoKeyArr: Array<keyof CertBundleInfo> = [
  'acc_key',
  'chain',
  'key',
  'key_password',
  'ca',
]

watch(() => props.name, getCertBundleInfo)
</script>
