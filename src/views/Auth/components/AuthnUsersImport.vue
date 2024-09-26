<template>
  <div class="authn-users-import">
    <el-tooltip :content="$t('Auth.importUsers')" placement="top">
      <el-button
        class="icon-button"
        type="primary"
        plain
        :icon="Upload"
        @click="dialogVisible = true"
      >
      </el-button>
    </el-tooltip>

    <el-dialog
      :title="$t('Auth.importUsers')"
      v-model="dialogVisible"
      modal-class="authn-import-dialog"
      destroy-on-close
      append-to-body
      width="700px"
      :close-on-click-modal="false"
    >
      <el-steps direction="vertical">
        <el-step>
          <template #title>
            <div>{{ $t('Auth.selectImportMethod') }}</div>
          </template>
          <template #description>
            <el-radio-group v-model="passwordType">
              <el-radio value="plain" border>{{ $t('Auth.plaintextPassword') }}</el-radio>
              <el-radio value="hash" border>{{ $t('Auth.encryptedPassword') }}</el-radio>
            </el-radio-group>
          </template>
        </el-step>
        <el-step>
          <template #title>
            <div>{{ $t('Auth.downloadImportTemplate') }}</div>
          </template>
          <template #description>
            <p>{{ $t('Auth.downloadUserImportTemplate') }}</p>
            <el-button type="primary" plain @click="downloadTemplate">
              {{ $t('Auth.downloadTemplate') }}
            </el-button>
          </template>
        </el-step>
        <el-step>
          <template #title>
            <div>{{ $t('Auth.uploadFile') }}</div>
          </template>
          <template #description>
            <el-upload
              ref="UploadRef"
              :auto-upload="false"
              v-model:file-list="fileList"
              :limit="1"
              accept=".csv"
            >
              <el-button type="primary" plain>{{ $t('Auth.clickToSelectFile') }}</el-button>
            </el-upload>
          </template>
        </el-step>
      </el-steps>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" @click="importData" :loading="importLoading">{{
          $t('Base.import')
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { downloadByURL } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { ImportResult } from '@/types/auth'
import { ElMessage, ElUpload } from 'element-plus'
import { uploadUsers } from '@/api/auth'
import { useRoute } from 'vue-router'

type PasswordType = 'plain' | 'hash'

const emits = defineEmits(['uploadedData'])

const { t, tl } = useI18nTl('Auth')
const route = useRoute()

const dialogVisible = ref(false)
const importLoading = ref(false)
const fileList = ref<any[]>([])
const passwordType = ref<PasswordType>('plain')
const UploadRef = ref<typeof ElUpload | null>(null)

const initFileList = () => {
  fileList.value = []
}

watch(
  () => dialogVisible.value,
  (visible: boolean) => {
    if (!visible) {
      initFileList()
    }
  },
)

const popupImportResult = (data: ImportResult) => {
  const { success, total } = data
  if (success === total) {
    ElMessage.success(t('Auth.allImportSuc', { total }))
  } else {
    const keyArr: Array<keyof ImportResult> = ['success', 'override', 'failed', 'skipped', 'total']
    const messageDetail = keyArr.reduce((msg: string, key) => {
      if (data[key]) {
        msg += msg ? t('Base.comma') : ''
        msg += `${t(`Auth.${key}Records`, { [key]: data[key] })}`
      }
      return msg
    }, '')
    const message = `${t('Auth.importCompleted')}${t('Base.comma')}${messageDetail}`
    ElMessage({ type: 'success', message, duration: 8000 })
  }
}

async function importData() {
  if (fileList.value.length === 0) {
    ElMessage.error(tl('selectFileFirst'))
    return
  }
  const file = fileList.value[0]
  importLoading.value = true
  const id = route.params.id as string
  try {
    const result = await uploadUsers(id, passwordType.value, file)
    popupImportResult(result)
    fileList.value = []
    UploadRef.value?.clearFiles()
    dialogVisible.value = false
    emits('uploadedData')
  } catch (error) {
    // error handling
  } finally {
    importLoading.value = false
  }
}

async function downloadTemplate() {
  downloadByURL(`static/templates/user-import-template-${passwordType.value}.csv`)
}
</script>

<style lang="scss">
.authn-users-import {
  line-height: 0;
  .el-button.is-link {
    font-weight: normal;
  }
}
.authn-import-dialog {
  .el-step__title.is-wait,
  .el-step__description,
  .el-step__title.is-process {
    font-weight: normal;
    color: var(--color-text-primary);
    font-size: 14px;
  }
  .el-step__description {
    .el-radio-group,
    .el-button {
      margin-top: 12px;
    }
  }
  .el-step:not(:last-child) {
    .el-radio-group,
    .el-button {
      margin-bottom: 32px;
    }
  }
}
</style>
