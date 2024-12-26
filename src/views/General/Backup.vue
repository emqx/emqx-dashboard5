<template>
  <div class="backup app-wrapper">
    <div class="section-header">
      <div></div>
      <el-upload
        ref="UploadRef"
        class="upload-container"
        name="filename"
        :limit="1"
        accept=".gz"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :http-request="customUploadRequest"
      >
        <el-button plain :icon="Upload" :disabled="!$hasPermission('post')" :loading="uploading">
          {{ tl('upload') }}
        </el-button>
      </el-upload>
      <CreateButton :loading="createLoading" @click="handleCreateBackup" />
    </div>
    <el-table class="backup-table" :data="backupList" v-loading.lock="isTableLoading">
      <el-table-column prop="filename" min-width="125" :label="tl('filename')" />
      <el-table-column prop="node" min-width="128" :label="t('Dashboard.nodeName')" />
      <el-table-column prop="created_at" :label="tl('createdAt')" min-width="164">
        <template #default="{ row }">
          {{ dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="size" :label="tl('fileSize')" min-width="100">
        <template #default="{ row }">
          {{ formatSizeUnit(row.size) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')" min-width="228">
        <template #default="{ row }">
          <TableButton :disabled="!$hasPermission('get')" @click="handleDownloadBackup(row)">
            {{ $t('Base.download') }}
          </TableButton>
          <TableButton :disabled="!$hasPermission('delete')" @click="handleDeleteBackup(row)">
            {{ $t('Base.delete') }}
          </TableButton>
          <TableButton :disabled="!$hasPermission('post')" @click="handleRestoreBackup(row)">
            {{ tl('restore') }}
          </TableButton>
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <common-pagination @loadPage="loadBackupFiles" v-model:metaData="pageMeta" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  createBackup,
  deleteBackup,
  downloadBackup,
  getBackups,
  restoreBackup,
  uploadBackup,
} from '@/api/systemModule'
import commonPagination from '@/components/commonPagination.vue'
import useI18nTl from '@/hooks/useI18nTl'
import usePaginationWithHasNext from '@/hooks/usePaginationWithHasNext'
import { PageData } from '@/types/common'
import { EmqxMgmtApiDataBackupBackupFileInfo } from '@/types/schemas/dataBackup.schemas'
import { Upload } from '@element-plus/icons-vue'
import { createDownloadBlobLink, formatSizeUnit } from '@emqx/shared-ui-utils'
import {
  ElMessage,
  ElMessageBox,
  UploadInstance,
  UploadRequestHandler,
  UploadRequestOptions,
} from 'element-plus'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { useStore } from 'vuex'

interface BackupItem extends EmqxMgmtApiDataBackupBackupFileInfo {
  size: number
}

const isTableLoading = ref(false)
const createLoading = ref(false)
const uploading = ref(false)
const backupList = ref<BackupItem[]>([])
const UploadRef = ref<UploadInstance>()

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

const store = useStore()
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
        store.commit('CLEAR_ABORT_CONTROLLERS')
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
  uploading.value = false
  ElMessage.success(t('Dashboard.uploadedSuccessfully'))
  loadBackupFiles()
  UploadRef.value?.clearFiles()
}

const handleUploadError = () => {
  uploading.value = false
  loadBackupFiles()
  UploadRef.value?.clearFiles()
}

const customUploadRequest: UploadRequestHandler = async (
  options: UploadRequestOptions,
): Promise<unknown> => {
  uploading.value = true
  const { filename, file } = options
  return await uploadBackup(filename, file)
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
