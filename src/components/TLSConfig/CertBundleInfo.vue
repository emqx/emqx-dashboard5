<template>
  <ul v-loading.lock="isLoading">
    <li v-for="(value, key) in certBundleInfo" :key="key">{{ key }}: {{ value }}</li>
  </ul>
</template>

<script setup lang="ts">
import { CertBundleInfo } from '@/types/typeAlias'

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

watch(() => props.name, getCertBundleInfo)
</script>
