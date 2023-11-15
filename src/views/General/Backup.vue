<template>
  <div class="backup app-wrapper">
    <div class="section-header">
      <div></div>
      <el-upload
        class="upload-container"
        action="http://www.example.com/upload"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
      >
        <el-button plain :icon="Upload" :disabled="!$hasPermission('post')">
          {{ tl('upload') }}
        </el-button>
      </el-upload>
      <el-button type="primary" :disabled="!$hasPermission('get')" @click="downloadBackup">
        {{ $t('Base.download') }}
      </el-button>
    </div>
    <el-table class="backup-table" :data="backupList" v-loading.lock="isTableLoading">
      <el-table-column prop="filename" :label="tl('filename')"></el-table-column>
      <el-table-column prop="creationTime" :label="tl('createdAt')"></el-table-column>
      <el-table-column prop="fileSize" :label="tl('fileSize')"></el-table-column>
      <el-table-column :label="$t('Base.operation')" min-width="100">
        <template #default="{ row }">
          <el-button size="small" :disabled="!$hasPermission('get')" @click="downloadBackup">
            {{ $t('Base.download') }}
          </el-button>
          <el-button
            size="small"
            :disabled="!$hasPermission('delete')"
            plain
            @click="deleteBackup(row)"
            >{{ $t('Base.delete') }}</el-button
          >
          <el-button size="small" :disabled="!$hasPermission('put')" @click="restoreBackup(row)">
            {{ tl('restore') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { ElTable, ElTableColumn, ElButton } from 'element-plus'
import { ref } from 'vue'
import { UploadFile, UploadFiles } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

interface BackupItem {
  filename: string
  creationTime: string
  fileSize: string
}

const backupList = ref<BackupItem[]>([
  {
    filename: 'backup1',
    creationTime: '2022-01-01 00:00:00',
    fileSize: '10MB',
  },
  {
    filename: 'backup2',
    creationTime: '2022-02-01 00:00:00',
    fileSize: '20MB',
  },
])

const { tl } = useI18nTl('General')

const isTableLoading = ref(false)

const downloadBackup = () => {
  // Implement the download backup logic here
}

const restoreBackup = (backup: BackupItem) => {
  // Implement the restore backup logic here
}

const deleteBackup = (backup: BackupItem) => {
  // Implement the delete backup logic here
}

const handleUploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  // Implement the upload success logic here
  console.log('File uploaded successfully')
}

const handleUploadError = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  // Implement the upload error logic here
  console.log('Error during file upload')
}
</script>

<style lang="scss" scoped>
.upload-container {
  display: flex;
}
</style>
