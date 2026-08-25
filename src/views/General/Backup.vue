<template>
  <div class="backup app-wrapper">
    <div class="section-header">
      <div>
        <NamespaceSelect
          v-if="isGlobalAdmin"
          v-model="selectedNamespace"
          class="namespace-select"
          :clearable="false"
          :global="{ enable: true, value: GLOBAL_NAMESPACE }"
          @change="handleNamespaceChanged"
        />
      </div>
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
        <el-button plain :disabled="!$hasPermission('post')" :loading="uploading">
          <Upload class="mr-2" />
          {{ tl('upload') }}
        </el-button>
      </el-upload>
      <CreateButton
        :disabled="!$hasPermission('post') || isNamespaceBackupView"
        :loading="createLoading"
        @click="handleCreateBackup"
      />
    </div>
    <el-alert
      v-if="isNamespaceBackupView"
      class="ns-alert"
      show-icon
      type="info"
      :closable="false"
      :title="tl('namespaceBackupOperationTip', { namespace: namespaceParam ?? '' })"
    />
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
import { PageData } from '@/types/common'
import { UserRole } from '@/types/enum'
import { EmqxMgmtApiDataBackupBackupFileInfo } from '@/types/schemas/dataBackup.schemas'
import NamespaceSelect from '@/components/Namespace/NamespaceSelect.vue'
import { createDownloadBlobLink, formatSizeUnit } from '@emqx/shared-ui-utils'
import dayjs from 'dayjs'
import {
  ElMessage,
  ElMessageBox,
  UploadInstance,
  UploadRequestHandler,
  UploadRequestOptions,
} from 'element-plus'
import { Upload } from 'lucide-vue-next'

interface BackupItem extends EmqxMgmtApiDataBackupBackupFileInfo {
  size: number
}

const isTableLoading = ref(false)
const createLoading = ref(false)
const uploading = ref(false)
const backupList = ref<BackupItem[]>([])
const UploadRef = ref<UploadInstance>()
const selectedNamespace = ref<string | undefined>(GLOBAL_NAMESPACE)
const uploadingNamespace = ref<string | undefined>()

const store = useStore()
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
const isGlobalAdmin = computed(
  () => !isNamespaceUser.value && store.state.user.role === UserRole.Admin,
)
const namespaceParam = computed(() =>
  selectedNamespace.value === GLOBAL_NAMESPACE ? undefined : selectedNamespace.value,
)
const isNamespaceBackupView = computed(
  () => isGlobalAdmin.value && namespaceParam.value !== undefined,
)

const { pageParams, pageMeta, initPageMeta, setPageMeta } = usePaginationWithHasNext()
const { t, tl } = useI18nTl('General')

const loadBackupFiles = async (params = {}) => {
  isTableLoading.value = true
  const sendParams = { ...pageParams.value, ...params, namespace: namespaceParam.value }
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

const handleNamespaceChanged = () => {
  refreshListData()
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
  const targetNamespace = namespaceParam.value
  const confirmMessage = targetNamespace
    ? tl('confirmNamespaceRestore', { namespace: targetNamespace })
    : tl('confirmRestore')
  ElMessageBox.confirm(confirmMessage, {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    customClass: 'backup-restore-confirm',
    type: 'info',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        try {
          const { filename, node } = backup
          await restoreBackup(
            { filename, node },
            targetNamespace ? { namespace: targetNamespace } : undefined,
          )
          ElMessage.success(
            targetNamespace
              ? tl('namespaceRestoreSuccess', { namespace: targetNamespace })
              : tl('restoreSuccess'),
          )
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
  const targetNamespace = namespaceParam.value
  ElMessageBox.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    confirmButtonClass: 'confirm-danger',
    type: 'warning',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        try {
          await deleteBackup(filename, { node, namespace: targetNamespace })
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
  const targetNamespace = namespaceParam.value
  const res = await downloadBackup(filename, { node, namespace: targetNamespace })
  if (res.data) {
    createDownloadBlobLink(res.data, filename)
  }
}

const handleUploadSuccess = () => {
  uploading.value = false
  const targetNamespace = uploadingNamespace.value
  ElMessage.success(
    targetNamespace
      ? tl('namespaceUploadSuccess', { namespace: targetNamespace })
      : t('Dashboard.uploadedSuccessfully'),
  )
  uploadingNamespace.value = undefined
  loadBackupFiles()
  UploadRef.value?.clearFiles()
}

const handleUploadError = () => {
  uploading.value = false
  uploadingNamespace.value = undefined
  loadBackupFiles()
  UploadRef.value?.clearFiles()
}

const customUploadRequest: UploadRequestHandler = async (
  options: UploadRequestOptions,
): Promise<unknown> => {
  uploading.value = true
  const { filename, file } = options
  const targetNamespace = namespaceParam.value
  uploadingNamespace.value = targetNamespace
  return await uploadBackup(
    filename,
    file,
    targetNamespace ? { namespace: targetNamespace } : undefined,
  )
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

.namespace-select {
  width: 240px;
}

.ns-alert {
  margin-bottom: 16px;
}
</style>
