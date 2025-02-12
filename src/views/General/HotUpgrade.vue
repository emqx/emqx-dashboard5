<template>
  <div class="hot-upgrade app-wrapper">
    <div class="section-header">
      <div></div>
      <div>
        <RefreshButton @click="getTableData" />
      </div>
    </div>
    <el-table :data="nodeList" v-loading.lock="isTableLoading">
      <el-table-column prop="node" :label="t('Base.node')" :min-width="200" />
      <el-table-column :label="t('Base.status')" :min-width="160">
        <template #default="{ row }">
          <div class="vertical-align-center">
            <i class="node-status-dot" :class="getNodeStatusDotClass(row.status)"></i>
            <span>{{ getNodeStatusLabel(row.status) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="role" :label="t('Dashboard.role')" :min-width="140" />
      <el-table-column
        prop="live_connections"
        :label="t('Dashboard.currentConnection')"
        :min-width="160"
      />
      <el-table-column prop="current_vsn" :label="tl('currentVersion')" :min-width="160" />
      <el-table-column :label="t('Base.operation')" :min-width="240">
        <template #default="{ row }">
          <TableButton
            :disabled="!$hasPermission('post') || isUpgrading(row.status)"
            @click="openUpgradeDialog(row)"
          >
            {{ t('Base.upgrade') }}
          </TableButton>
          <TableButton @click="openRecordsDialog(row)">
            {{ tl('upgradeRecords') }}
          </TableButton>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <UpgradeNodeDialog v-model="showUpgradeDialog" :node="currentNode" @submitted="getTableData" />
  <UpgradeRecordsDialog v-model="showRecordsDialog" :node="currentNode" />
</template>

<script setup lang="ts">
import { getAllNodeStatus } from '@/api/hotUpgrade'
import useI18nTl from '@/hooks/useI18nTl'
import { NodeUpgradeData, NodeUpgradeStatus, TypeNodeUpgradeStatus } from '@/types/typeAlias'
import { ref } from 'vue'
import UpgradeNodeDialog from './components/UpgradeNodeDialog.vue'
import UpgradeRecordsDialog from './components/UpgradeRecordsDialog.vue'

const isTableLoading = ref(false)
const nodeList = ref<NodeUpgradeData[]>([])

const { t, tl } = useI18nTl('General')

const getTableData = async () => {
  isTableLoading.value = true
  try {
    nodeList.value = await getAllNodeStatus()
  } catch (error) {
    // ignore error
  } finally {
    isTableLoading.value = false
  }
}
getTableData()

const isUpgrading = (status: TypeNodeUpgradeStatus) => status === NodeUpgradeStatus['in-progress']

const getNodeStatusDotClass = (status: TypeNodeUpgradeStatus) =>
  isUpgrading(status) ? 'is-warning' : 'is-running'

const getNodeStatusLabel = (status: TypeNodeUpgradeStatus) =>
  isUpgrading(status) ? tl('upgrading') : tl('idle')

const showUpgradeDialog = ref(false)
const currentNode = ref<undefined | NodeUpgradeData>(undefined)
const openUpgradeDialog = (node: NodeUpgradeData) => {
  currentNode.value = node
  showUpgradeDialog.value = true
}

const showRecordsDialog = ref(false)
const openRecordsDialog = (node: NodeUpgradeData) => {
  currentNode.value = node
  showRecordsDialog.value = true
}
</script>

<style lang="scss" scoped>
.node-status-dot {
  margin-right: 8px;
}
</style>
