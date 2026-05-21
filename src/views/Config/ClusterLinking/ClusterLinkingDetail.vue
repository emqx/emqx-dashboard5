<template>
  <div class="linking-detail" v-loading.lock="isLoading">
    <div class="detail-top">
      <detail-header :item="{ name: linkingName, routeName: 'cluster-linking' }">
        <template #content>
          <CommonItemStatus v-bind="{ metrics: clusterLinkingData as any, isTag: true }" />
        </template>

        <template #extra>
          <el-tooltip
            :content="clusterLinkingData.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch
              class="enable-btn"
              :model-value="clusterLinkingData.enable"
              :disabled="!$hasPermission('put')"
              @update:modelValue="toggleEnable"
            />
          </el-tooltip>
          <DeleteButton @click="handleDelete" />
        </template>
      </detail-header>
    </div>
    <el-tabs class="detail-tabs" v-model="activeTab">
      <div class="app-wrapper">
        <el-tab-pane :label="tl('overview')" :name="DetailTab.Overview" lazy>
          <ClusterLinkingOverview :linking-name="linkingName" />
        </el-tab-pane>
        <el-tab-pane :label="t('Base.setting')" :name="DetailTab.Setting">
          <el-card class="app-card">
            <ClusterLinkingForm
              v-if="!isLoading"
              ref="formCom"
              v-model="clusterLinkingData"
              :edit-data-topic-length="editDataTopicLength"
              is-edit
            />
            <el-button
              type="primary"
              :disabled="!$hasPermission('put')"
              :loading="isSubmitting"
              @click="updateLinking"
            >
              {{ $t('Base.update') }}
            </el-button>
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { deleteClusterLinking, getClusterLinkingDetail, putClusterLinking } from '@/api/cluster'
import CommonItemStatus from '@/components/CommonItemStatus.vue'
import { DetailTab } from '@/types/enum'
import type { ClusterLinkingForm as ClusterLinkingFormData } from '@/types/typeAlias'
import ClusterLinkingForm from './components/ClusterLinkingForm.vue'
import ClusterLinkingOverview from './components/ClusterLinkingOverview.vue'

const router = useRouter()
const route = useRoute()

const { t, tl } = useI18nTl('RuleEngine')

const activeTab = ref(DetailTab.Overview)

const linkingName = computed(() => route.params.linkingName.toString())

const formCom = ref()
const isLoading = ref(false)
const clusterLinkingData: Ref<ClusterLinkingFormData> = ref({} as ClusterLinkingFormData)
const editDataTopicLength = ref(0)
const isSubmitting = ref(false)

const queryTab = computed(() => {
  return route.query.tab && Number(route.query.tab)
})
if (queryTab.value !== undefined) {
  activeTab.value = queryTab.value as DetailTab
}

const getDetail = async () => {
  try {
    isLoading.value = true
    clusterLinkingData.value = await getClusterLinkingDetail(linkingName.value)
    if (!clusterLinkingData.value.tcp_opts) {
      clusterLinkingData.value.tcp_opts = {}
    }
    editDataTopicLength.value = clusterLinkingData.value.topics.length
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
const { handleLinkingDataBeforeSubmit, handleTogglerEnable } = useClusterLinking()

const updateLinking = async () => {
  try {
    isSubmitting.value = true
    await formCom.value.validate()
    await putClusterLinking(
      clusterLinkingData.value.name,
      handleLinkingDataBeforeSubmit(clusterLinkingData.value),
    )
    ElMessage.success(t('Base.updateSuccess'))
    router.push({ name: 'cluster-linking' })
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const toggleEnable = async () => {
  await handleTogglerEnable(clusterLinkingData.value)
  getDetail()
}

const { confirmDel } = useOperationConfirm()
const handleDelete = async () => {
  try {
    await confirmDel(() => deleteClusterLinking(linkingName.value))
    router.push({ name: 'cluster-linking' })
  } catch (error) {
    console.error(error)
  }
}

getDetail()
</script>
