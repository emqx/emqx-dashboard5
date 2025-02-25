<template>
  <div class="hot-upgrade app-wrapper">
    <div class="section-header">
      <div></div>
      <div>
        <el-button type="primary" :disabled="!$hasPermission('post')" @click="openPackageDialog">
          {{ tl('upload') }}
        </el-button>
      </div>
    </div>
    <el-table :data="packageList" v-loading.lock="isTableLoading">
      <el-table-column prop="TODO:" :label="t('Base.name')" />
      <el-table-column prop="TODO:" :label="tl('version')" />
      <el-table-column prop="TODO:" :label="tl('availableVersions')" />
      <el-table-column prop="TODO:" :label="tl('buildDate')" />
      <el-table-column prop="TODO:" :label="tl('fileSize')" />
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <TableButton :disabled="!$hasPermission('delete')" @click="handleDeletePackage(row)">
            {{ $t('Base.delete') }}
          </TableButton>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <HotUpgradePackageUploadDialog v-model="showPackageDialog" @submitted="getTableData" />
</template>

<script setup lang="ts">
import {
  deleteBackup as deleteUpgradePackage,
  getBackups as getUpgradePackages,
} from '@/api/systemModule'
import HotUpgradePackageUploadDialog from './components/HotUpgradePackageUploadDialog.vue'

type PackageItem = any

const isTableLoading = ref(false)
const packageList = ref<PackageItem[]>([])

const { t, tl } = useI18nTl('General')

const getTableData = async () => {
  isTableLoading.value = true
  try {
    const { data } = await getUpgradePackages()
    packageList.value = data as PackageItem[]
  } catch (error) {
    // ignore error
  } finally {
    isTableLoading.value = false
  }
}
getTableData()

const showPackageDialog = ref(false)
const openPackageDialog = () => {
  showPackageDialog.value = true
}

const { confirmDel } = useOperationConfirm()
const handleDeletePackage = async (item: PackageItem) => {
  try {
    await confirmDel(() => deleteUpgradePackage(item))
    getTableData()
  } catch (error) {
    //
  }
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
