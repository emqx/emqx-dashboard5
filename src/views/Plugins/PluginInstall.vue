<template>
  <div class="plugin-install app-wrapper">
    <detail-header :item="{ name: t('components.plugin-install'), path: '/plugins' }" />
    <TipContainer>
      <MarkdownContent :content="tl('pluginInstallGuidance')" />
    </TipContainer>
    <el-card class="app-card plugin-install-card">
      <el-upload
        class="object-uploader plugin-uploader"
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
          lang="bash"
          :class="{ empty: !file }"
          :code="!file ? tl('pleaseUploadPluginFirst') : `emqx ctl plugins allow ${fileName}`"
          :show-copy-btn="!!file"
        />
      </div>
      <div class="btns">
        <el-button @click="cancel">
          {{ tl('cancel', 'Base') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          :loading="isUploading"
          @click="submit"
        >
          {{ tl('install') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { installPlugin } from '@/api/plugins'
import CustomMessage from '@/common/CustomMessage'
import getErrorMessage from '@/common/getHTTPErrorMessage'
import HTTPErrorMessage from '@/common/HTTPErrorMessage'
import xss from 'xss'

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

/**
 * Pull out a backtick-quoted command from a backend message such as:
 *   "Package is not allowed installation; first allow it to be
 *    installed by running: `emqx ctl plugins allow foo-1.0.0`"
 *   "Package sha256 does not match the value bound by
 *    `emqx ctl plugins allow foo-1.0.0 sha256:...`"
 */
const extractCommand = (message: string): string => {
  return message?.match(/`(.*?)`/)?.[1] ?? ''
}

const showHtmlError = (msg: string) => {
  ElMessage({
    dangerouslyUseHTMLString: true,
    message: msg,
    customClass: 'markdown-body',
    type: 'error',
  })
}

/**
 * The backend returns 403 + code=FORBIDDEN for two distinct cases that the
 * dashboard must distinguish (see emqx PR 17200):
 *   - "first allow it to be installed by running ..." → not yet allowed
 *   - "sha256 does not match the value bound by ..." → upload bytes do not
 *     match the sha256 the operator pinned via `emqx ctl plugins allow`
 * Anything else is shown using the backend's own message rather than being
 * forced into the "not allowed" template (the previous behavior of the
 * dashboard, which produced misleading toasts).
 */
const handleForbidden = (message: string) => {
  const cmd = extractCommand(message)
  if (/sha256 does not match/i.test(message)) {
    showHtmlError(xss(t('Plugins.pluginInstallSha256Mismatch', { code: cmd })))
    return
  }
  if (/first allow it/i.test(message) || /not allowed installation/i.test(message)) {
    showHtmlError(xss(t('Plugins.pluginInstallForbidden', { code: cmd })))
    return
  }
  // Unknown 403 variant — surface the backend message verbatim so we never
  // again silently mis-label a new error class.
  CustomMessage.error(message)
}

const handleInstallError = (error: any) => {
  const { data, status } = error?.response ?? {}
  const message: string = data?.message ?? ''
  if (status === 403 && data?.code === 'FORBIDDEN') {
    handleForbidden(message)
    return
  }
  // Zip-slip rejection lands here (the backend wraps the reason map and
  // typically yields a non-403 status). Detect by the marker in the message.
  if (message && /unsafe_tar_entry_path/.test(message)) {
    showHtmlError(xss(tl('pluginInstallUnsafePath')))
    return
  }
  HTTPErrorMessage(getErrorMessage(data, status) as VNode)
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
  } catch (error: any) {
    handleInstallError(error)
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
  padding-top: 48px;
  padding-bottom: 64px;
}
.tip-container {
  margin-bottom: 24px;
  :deep(.result-tip) {
    align-items: flex-start;
  }
  :deep(.icon-tip) {
    margin-right: 8px;
    margin-top: 3px;
  }
  :deep(.markdown-body) {
    font-size: 14px;
    background-color: transparent;
  }
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
  width: 440px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 24px;
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

<style lang="scss">
.el-message.markdown-body {
  background: #ffe9e7;
}
</style>
