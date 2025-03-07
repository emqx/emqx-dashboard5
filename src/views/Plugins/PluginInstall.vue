<template>
  <div class="plugin-install app-wrapper">
    <detail-header :item="{ name: t('components.plugin-install'), path: '/plugins' }" />
    <el-card class="app-card plugin-install-card">
      <TipContainer>
        <MarkdownContent :content="tl('pluginInstallGuidance')" />
      </TipContainer>
      <el-upload
        class="plugin-uploader"
        drag
        :before-upload="setFile"
        :file-list="fileList"
        :show-file-list="false"
        accept=".gz"
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
      <div class="upload-tip">
        <p>{{ tl('pluginInstallCommand') }}</p>
        <CodeView
          :class="{ empty: !file }"
          :code="!file ? tl('pleaseUploadPluginFirst') : `emqx ctl plugins allow ${fileName}`"
          :show-copy-btn="!!file"
        />
      </div>
      <div class="btns">
        <el-button @click="cancel">
          {{ tl('cancel', 'Base') }}
        </el-button>
        <el-button type="primary" :loading="isUploading" @click="submit">
          {{ tl('install') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue'
import CodeView from '@/components/CodeView.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import TipContainer from '@/components/TipContainer.vue'
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

const fileName = computed(() => file.value?.name?.replace(/\.tar\.gz$/, ''))

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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
  padding-bottom: 64px;
}
.tip-container {
  width: 970px;
  margin-bottom: 24px;
  :deep(.icon-tip) {
    margin-right: 8px;
  }
  :deep(.markdown-body) {
    font-size: 14px;
    background-color: transparent;
  }
}

.plugin-uploader {
  margin-bottom: 24px;
}
.upload-tip {
  width: 500px;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 20px;
}
.code-view.empty {
  opacity: 0.78;
}
.plugin-uploader {
  width: 400px;
  margin-left: auto;
  margin-right: auto;
  .icon-plus {
    display: block;
    width: 24px;
    height: 24px;
    margin-right: auto;
    margin-left: auto;
    color: var(--color-text-placeholder);
    margin-bottom: 12px;
  }
  .upload-placeholder {
    color: var(--color-text-placeholder);
    font-size: 16px;
  }
  :deep(.el-upload) {
    width: 100%;
    .el-upload-dragger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 200px;
    }
  }
}
.file-name {
  padding: 0 28px;
  word-wrap: break-word;
  color: var(--color-text-secondary);
}
.btns {
  & > :not(:last-child) {
    margin-right: 16px;
  }
}
</style>
