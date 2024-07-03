<template>
  <div class="hot-upgrade app-wrapper">
    <div class="section-header">
      <div></div>
      <div>
        <el-button type="primary" @click="getTableData">
          {{ $t('Base.refresh') }}
        </el-button>
      </div>
    </div>
    <el-table :data="nodeList" v-loading.lock="isTableLoading">
      <el-table-column prop="TODO:" :label="t('Base.node')" />
      <el-table-column prop="TODO:" :label="t('Base.status')">
        <template #default="{ row }">
          {{ row.XXXX }}
        </template>
      </el-table-column>
      <el-table-column prop="TODO:" :label="t('Dashboard.role')" />
      <el-table-column prop="TODO:" :label="t('Dashboard.currentConnection')" />
      <el-table-column prop="TODO:" :label="tl('currentVersion')" />
      <el-table-column prop="TODO:" :label="tl('upgradeableVersion')" />
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button @click="openUpgradeDialog(row)">
            {{ t('Base.upgrade') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <UpgradeNodeDialog v-model="showUpgradeDialog" :node="currentNode" />
</template>

<script setup lang="ts">
import { getBackups as getNodes } from '@/api/systemModule'
import useI18nTl from '@/hooks/useI18nTl'
import { Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import UpgradeNodeDialog from './components/UpgradeNodeDialog.vue'

type Node = any

const isTableLoading = ref(false)
const nodeList = ref<Node[]>([{}])

const { t, tl } = useI18nTl('General')

const getTableData = async () => {
  isTableLoading.value = true
  try {
    const { data } = await getNodes()
    nodeList.value = data as Node[]
  } catch (error) {
    // ignore error
  } finally {
    isTableLoading.value = false
  }
}
// getTableData()

const showUpgradeDialog = ref(false)
const currentNode = ref(undefined)
const openUpgradeDialog = (node: Node) => {
  currentNode.value = node
  showUpgradeDialog.value = true
}
</script>

<style lang="scss" scoped>
.upload-container {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-around;
  gap: 12px;
}
</style>
