<template>
  <div class="plugin-install app-wrapper">
    <detail-header :item="{ name: tl('installPlugin'), path: '/plugins' }" />
    <el-card class="app-card plugin-install-card">
      <el-upload
        class="plugin-uploader"
        drag
        :before-upload="setFile"
        :file-list="fileList"
        :show-file-list="false"
      >
        <div v-if="!file?.name">
          <el-icon class="icon-plus">
            <Plus class="icon-plus" />
          </el-icon>
          <span class="upload-placeholder">
            {{ tl('dragFilePlaceholder') }}
          </span>
        </div>
        <p class="file-name" v-else>{{ file.name }}</p>
      </el-upload>
      <p class="upload-tip">{{ tl('uploadTip') }}</p>
      <div class="btns">
        <el-button type="primary" :loading="isUploading" @click="submit">
          {{ tl('install') }}
        </el-button>
        <el-button @click="cancel">
          {{ tl('cancel', 'Base') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { installPlugin } from '@/api/plugins'
import DetailHeader from '@/components/DetailHeader.vue'

const router = useRouter()
const { t } = useI18n()
const tl = (key: string, moduleName = 'Plugins') => t(`${moduleName}.${key}`)
const isUploading = ref(false)

const cancel = () => router.push({ name: 'plugins' })

const file: Ref<undefined | File> = ref(undefined)
const fileList = computed(() => (file.value && file.value.name ? [file] : []))

const setFile = (selectedFile: File) => {
  file.value = selectedFile
  return false
}

const submit = async () => {
  if (!file.value) {
    ElMessage.error(tl('uploadWarning'))
    return
  }
  try {
    isUploading.value = true
    await installPlugin(file.value as File)
    ElMessage.success(tl('successfulInstallation'))
    router.push({ name: 'plugins' })
  } catch (error) {
    console.error(error)
  } finally {
    isUploading.value = false
  }
}
</script>

<style lang="scss" scoped>
.plugin-install-card {
  display: flex;
  justify-content: center;
  text-align: center;
}
:deep(.el-card__body) {
  padding-top: 64px;
  padding-bottom: 64px;
}
.plugin-uploader {
  margin-bottom: 24px;
}
.upload-tip {
  width: 540px;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 20px;
}
.plugin-uploader {
  width: 250px;
  margin-left: auto;
  margin-right: auto;
  .icon-plus {
    display: block;
    width: 24px;
    height: 24px;
    margin-right: auto;
    margin-left: auto;
    color: #8d96a2;
    margin-bottom: 12px;
  }
  .upload-placeholder {
    color: #8d96a2;
    font-size: 12px;
  }
  :deep(.el-upload) {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
      height: 100px;
      padding-top: 20px;
    }
  }
}
.file-name {
  padding: 0 28px;
  word-wrap: break-word;
  color: #282e38;
}
.btns {
  & > :not(:last-child) {
    margin-right: 16px;
  }
}
</style>
