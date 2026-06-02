<template>
  <div class="cluster-linking app-wrapper">
    <detail-header
      :item="{ name: t('components.cluster-linking'), routeName: 'cluster-linking' }"
    />
    <el-card class="app-card">
      <ClusterLinkingForm ref="FormCom" v-model="formData" />
      <div>
        <CancelButton @click="cancel" />
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          :loading="isSubmitting"
          @click="submit"
        >
          {{ t('Base.create') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { postClusterLinking } from '@/api/cluster'
import type { ClusterLinkingForm as ClusterLinkingData } from '@/types/typeAlias'
import ClusterLinkingForm from './components/ClusterLinkingForm.vue'

const router = useRouter()
const { t } = useI18nTl('RuleEngine')

const { createSSLForm } = useSSL()
const generateRawRecord = (): ClusterLinkingData => ({
  enable: true,
  name: '',
  server: '',
  clientid: '',
  username: '',
  password: '',
  topics: [],
  ssl: createSSLForm() as any,
  pool_size: 8,
  retry_interval: '15s',
  max_inflight: 32,
  tcp_opts: {
    active_n: 10,
  },
  resource_opts: {
    start_timeout: '5s',
    worker_pool_size: 16,
    dispatch_strategy: 'per_clientid',
    request_ttl: '45s',
    health_check_interval: '15s',
    max_buffer_bytes: '256MB',
    inflight_window: 100,
  },
})

const FormCom = ref()
const formData: Ref<ClusterLinkingData> = ref(generateRawRecord())
const isSubmitting = ref(false)

const cancel = () => router.push({ name: 'cluster-linking' })
const { handleLinkingDataBeforeSubmit } = useClusterLinking()
const submit = async () => {
  try {
    isSubmitting.value = true
    await FormCom.value.validate()
    await postClusterLinking(handleLinkingDataBeforeSubmit(formData.value))
    ElMessage.success(t('Base.createSuccess'))
    router.push({ name: 'cluster-linking' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>
