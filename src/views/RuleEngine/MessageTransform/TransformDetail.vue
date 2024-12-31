<template>
  <div class="transform-detail" v-loading.lock="isLoading">
    <div class="detail-top">
      <detail-header :item="{ name: transformName, routeName: 'message-transform' }">
        <template #content>
          <StatusDetailsOfEachNode :status-data="statusData" is-tag />
        </template>
        <template #extra>
          <el-tooltip
            :content="transformData.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch
              class="enable-btn"
              v-model="transformData.enable"
              :disabled="!$hasPermission('put')"
              @change="(val: boolean) => toggleEnable(val)"
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
    <el-tabs class="detail-tabs" type="card" v-model="activeTab">
      <div>
        <el-tab-pane :label="tl('overview')" :name="DetailTab.Overview" lazy>
          <div class="app-wrapper">
            <TransformOverview :transform-name="transformName" />
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('Base.setting')" :name="DetailTab.Setting">
          <el-card class="app-card no-border">
            <TransformForm v-if="!isLoading" ref="formCom" v-model="transformData" is-edit />
          </el-card>
          <el-card class="ft-card fake-separation">
            <el-button type="primary" plain :disabled="!$hasPermission('post')" @click="openTest">
              {{ tl('preview') }}
            </el-button>
            <el-button
              type="primary"
              :disabled="!$hasPermission('put')"
              :loading="isSubmitting"
              @click="updateTransform"
            >
              {{ $t('Base.update') }}
            </el-button>
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
  <TestDrawer :message-transform="transformData" v-model="showTestDrawer" />
</template>

<script setup lang="ts">
import {
  deleteMessageTransform,
  enableDisableMessageTransform,
  getMessageTransformDetail,
  putMessageTransform,
} from '@/api/messageTransformation'
import DetailHeader from '@/components/DetailHeader.vue'
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'
import { handleTransformData } from '@/hooks/Rule/transform/useMessageTransform'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { DetailTab, NodeStatusClass } from '@/types/enum'
import type { MessageTransform } from '@/types/typeAlias'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TestDrawer from './components/TestDrawer.vue'
import TransformForm from './components/TransformForm.vue'
import TransformOverview from './components/TransformOverview.vue'

const router = useRouter()
const route = useRoute()

const { t, tl } = useI18nTl('RuleEngine')

const activeTab = ref(DetailTab.Overview)

const transformName = computed(() => route.params.transformName.toString())

const formCom = ref()
const isLoading = ref(false)
const transformData: Ref<MessageTransform> = ref({} as MessageTransform)
const isSubmitting = ref(false)

const queryTab = computed(() => {
  return route.query.tab && Number(route.query.tab)
})
if (queryTab.value !== undefined) {
  activeTab.value = queryTab.value as DetailTab
}

const statusData = computed(() => {
  const { enable } = transformData.value
  return {
    statusLabel: enable ? t('Base.enable') : t('Base.disabled'),
    statusClass: enable ? NodeStatusClass.Success : NodeStatusClass.Danger,
  }
})

const { handleDataBeforeSubmit, handleFetchedData } = handleTransformData()
const getDetail = async () => {
  try {
    isLoading.value = true
    const data = await getMessageTransformDetail(transformName.value)
    transformData.value = handleFetchedData(data)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const showTestDrawer = ref(false)
const openTest = async () => {
  await formCom.value.validate()
  showTestDrawer.value = true
}

const updateTransform = async () => {
  try {
    isSubmitting.value = true
    await formCom.value.validate()
    await putMessageTransform(handleDataBeforeSubmit(transformData.value))
    ElMessage.success(t('Base.updateSuccess'))
    router.push({ name: 'message-transform' })
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const toggleEnable = async (enable: boolean) => {
  try {
    await enableDisableMessageTransform(transformName.value, enable)
    ElMessage.success(t(enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'))
  } catch (error) {
    transformData.value.enable = !enable
  }
}

const { confirmDel } = useOperationConfirm()
const handleDelete = async () => {
  try {
    await confirmDel(() => deleteMessageTransform(transformName.value))
    router.push({ name: 'message-transform' })
  } catch (error) {
    console.error(error)
  }
}

getDetail()
</script>

<style lang="scss" scoped>
.message-transform-form {
  width: 70%;
  margin-bottom: 36px;
}
</style>
