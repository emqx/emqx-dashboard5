<template>
  <div class="linking-detail" v-loading.lock="isLoading">
    <div class="detail-top">
      <detail-header :item="{ name: linkingName, routeName: 'cluster-linking' }">
        <template #content>
          <StatusDetailsOfEachNode :status-data="statusData" is-tag />
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
          <el-tooltip :content="$t('Base.delete')" placement="top">
            <el-button
              class="icon-button"
              type="danger"
              :disabled="!$hasPermission('delete')"
              :icon="Delete"
              @click="handleDelete"
              plain
            >
            </el-button>
          </el-tooltip>
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
import DetailHeader from '@/components/DetailHeader.vue'
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'
import useClusterLinking from '@/hooks/Config/useClusterLinking'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { DetailTab, NodeStatusClass } from '@/types/enum'
import type { ClusterLinkingForm as ClusterLinkingFormData } from '@/types/typeAlias'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import { useRoute, useRouter } from 'vue-router'
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

const statusData = computed(() => {
  const { enable } = clusterLinkingData.value
  return {
    statusLabel: enable ? t('Base.enable') : t('Base.disabled'),
    statusClass: enable ? NodeStatusClass.Success : NodeStatusClass.Danger,
  }
})

const getDetail = async () => {
  try {
    isLoading.value = true
    clusterLinkingData.value = await getClusterLinkingDetail(linkingName.value)
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
  handleTogglerEnable(clusterLinkingData.value)
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
