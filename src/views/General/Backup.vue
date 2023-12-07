<template>
  <div class="backup app-wrapper">
    <div class="section-header">
      <div></div>
      <el-upload
        ref="UploadRef"
        class="upload-container"
        action="/api/v5/data/files"
        name="filename"
        :limit="1"
        :headers="{
          authorization: `Bearer ${store.state.user.token}`,
        }"
        accept=".gz"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
      >
        <el-button plain :icon="Upload" :disabled="!$hasPermission('post')">
          {{ tl('upload') }}
        </el-button>
      </el-upload>
      <el-button
        type="primary"
        :icon="Plus"
        :disabled="!$hasPermission('post')"
        :loading="createLoading"
        @click="handleCreateBackup"
      >
        {{ $t('Base.create') }}
      </el-button>
    </div>
    <el-table class="backup-table" :data="backupList" v-loading.lock="isTableLoading">
      <el-table-column prop="filename" min-width="125" :label="tl('filename')"></el-table-column>
      <el-table-column prop="node" :label="t('Dashboard.nodeName')"></el-table-column>
      <el-table-column prop="created_at" :label="tl('createdAt')">
        <template #default="{ row }">
          {{ moment(row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="size" :label="tl('fileSize')">
        <template #default="{ row }">
          {{ formatSizeUnit(row.size) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" min-width="100">
        <template #default="{ row }">
          <el-button
            size="small"
            :disabled="!$hasPermission('get')"
            @click="handleDownloadBackup(row)"
          >
            {{ $t('Base.download') }}
          </el-button>
          <el-button
            size="small"
            :disabled="!$hasPermission('delete')"
            plain
            @click="handleDeleteBackup(row)"
            >{{ $t('Base.delete') }}</el-button
          >
          <el-button
            size="small"
            :disabled="!$hasPermission('post')"
            @click="handleRestoreBackup(row)"
          >
            {{ tl('restore') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination
        @loadPage="loadBackupFiles"
        v-model:metaData="pageMeta"
      ></common-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { ElMessage, ElMessageBox, UploadInstance } from 'element-plus'
import { ref } from 'vue'
import { Upload, Plus } from '@element-plus/icons-vue'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import commonPagination from '@/components/commonPagination.vue'
import {
  getBackups,
  createBackup,
  deleteBackup,
  restoreBackup,
  downloadBackup,
} from '@/api/systemModule'
import { PageData } from '@/types/common'
import { EmqxMgmtApiDataBackupBackupFileInfo } from '@/types/schemas/dataBackup.schemas'
import { formatSizeUnit, createDownloadBlobLink } from '@emqx/shared-ui-utils'
import moment from 'moment'
import { useStore } from 'vuex'

interface BackupItem extends EmqxMgmtApiDataBackupBackupFileInfo {
  size: number
}

const isTableLoading = ref(false)
const createLoading = ref(false)
const backupList = ref<BackupItem[]>([])
const UploadRef = ref<UploadInstance>()

const store = useStore()
const { pageParams, pageMeta, initPageMeta, setPageMeta } = usePaginationWithHasNext()
const { t, tl } = useI18nTl('General')

const loadBackupFiles = async (params = {}) => {
  isTableLoading.value = true
  const sendParams = { ...pageParams.value, ...params }
  try {
    const { data, meta } = await getBackups(sendParams)
    backupList.value = data as BackupItem[]
    if (meta) {
      setPageMeta(meta as PageData)
    }
  } catch (error) {
    // ignore error
    initPageMeta()
  } finally {
    isTableLoading.value = false
  }
}
loadBackupFiles()

const refreshListData = () => {
  initPageMeta()
  loadBackupFiles()
}

const handleCreateBackup = async () => {
  createLoading.value = true
  try {
    await createBackup()
    ElMessage.success(tl('createBackupSuccess'))
    refreshListData()
  } catch (error) {
    // error
  } finally {
    createLoading.value = false
  }
}

const handleRestoreBackup = async (backup: BackupItem) => {
  ElMessageBox.confirm(tl('confirmRestore'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'info',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        try {
          const { filename, node } = backup
          await restoreBackup({ filename, node })
          ElMessage.success(tl('restoreSuccess'))
          done()
        } catch (error) {
          done()
        }
      } else {
        done()
      }
    },
  })
}

const handleDeleteBackup = async ({ filename, node }: BackupItem) => {
  ElMessageBox.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    confirmButtonClass: 'confirm-danger',
    type: 'warning',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        try {
          await deleteBackup(filename, node)
          ElMessage.success(t('Base.deleteSuccess'))
          refreshListData()
          done()
        } catch (error) {
          done()
        }
      } else {
        done()
      }
    },
  })
}

const handleDownloadBackup = async ({ filename, node }: BackupItem) => {
  const res = await downloadBackup(filename, node)
  if (res.data) {
    createDownloadBlobLink(res.data, filename)
  }
}

const handleUploadSuccess = () => {
  ElMessage.success(t('Dashboard.uploadedSuccessfully'))
  loadBackupFiles()
  UploadRef.value?.clearFiles()
}

const handleUploadError = (error: any) => {
  ElMessage.error(error.message.toString())
  loadBackupFiles()
  UploadRef.value?.clearFiles()
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
