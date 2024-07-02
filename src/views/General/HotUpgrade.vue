<template>
  <div class="hot-upgrade app-wrapper">
    <div class="section-header">
      <div></div>
      <div>
        <el-button type="primary" @click="loadTableData">
          {{ $t('Base.refresh') }}
        </el-button>

        <el-button
          plain
          :icon="Upload"
          :disabled="!$hasPermission('post')"
          @click="openPackageDialog"
        >
          {{ tl('upload') }}
        </el-button>
      </div>
    </div>
    <el-table :data="backupList" v-loading.lock="isTableLoading">
      <el-table-column prop="TODO:" :label="t('Base.node')" />
      <el-table-column prop="TODO:" :label="t('Base.status')" />
      <el-table-column prop="TODO:" :label="t('Dashboard.role')" />
      <el-table-column prop="TODO:" :label="t('Dashboard.currentConnection')" />
      <el-table-column prop="TODO:" :label="tl('currentVersion')" />
      <el-table-column prop="TODO:" :label="tl('upgradeableVersion')" />
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button @click="upgradeNode(row)">
            {{ t('Base.upgrade') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <HotUpgradePackageUploadDialog v-model="showPackageDialog" />
</template>

<script setup lang="ts">
import { getBackups, uploadBackup } from '@/api/systemModule'
import useI18nTl from '@/hooks/useI18nTl'
import { EmqxMgmtApiDataBackupBackupFileInfo } from '@/types/schemas/dataBackup.schemas'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage, UploadInstance, UploadRequestHandler, UploadRequestOptions } from 'element-plus'
import { ref } from 'vue'
import HotUpgradePackageUploadDialog from './components/HotUpgradePackageUploadDialog.vue'

interface BackupItem extends EmqxMgmtApiDataBackupBackupFileInfo {
  size: number
}

const isTableLoading = ref(false)
const uploading = ref(false)
const backupList = ref<BackupItem[]>([])
const UploadRef = ref<UploadInstance>()

const { t, tl } = useI18nTl('General')

const loadTableData = async (params = {}) => {
  isTableLoading.value = true
  const sendParams = { ...params }
  try {
    const { data } = await getBackups(sendParams)
    backupList.value = data as BackupItem[]
  } catch (error) {
    // ignore error
  } finally {
    isTableLoading.value = false
  }
}
loadTableData()

const refreshListData = () => {
  loadTableData()
}

const upgradeNode = (node) => {
  console.log(node)
}

const showPackageDialog = ref(false)
const openPackageDialog = () => {
  showPackageDialog.value = true
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
