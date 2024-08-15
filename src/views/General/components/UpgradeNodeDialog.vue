<template>
  <el-dialog
    :title="tl('upgradePackageUpload')"
    v-model="showDialog"
    class="upgrade-dialog"
    destroy-on-close
    width="860px"
  >
    <div v-loading="isLoading">
      <GuideBar :guide-list="stepList" :active-guide-index-list="activeGuideIndexList" />
      <div v-if="currentStep === 0">
        <div class="uploader-container" v-if="!nodePackage">
          <p class="tip-no-package">{{ tl('uploadPackageTip') }}</p>
          <el-upload
            class="object-uploader"
            drag
            :before-upload="setFile"
            :show-file-list="false"
            accept=".gz"
            :disabled="isUploading"
          >
            <div v-if="!file?.name">
              <el-icon class="icon-plus">
                <Plus class="icon-plus" />
              </el-icon>
              <span class="upload-placeholder">
                {{ t('Plugins.dragFilePlaceholder') }}
              </span>
            </div>
            <p class="file-name" v-else>{{ file.name }}</p>
          </el-upload>
          <p class="upload-tip">{{ tl('packageTip') }}</p>
        </div>
        <div class="package-display" v-else>
          <div class="radio-container">
            <el-radio :model-value="true" :label="true">
              <div class="vertical-align-center">
                <span>{{ nodePackage?.name }}</span>
                <el-upload
                  ref="upload"
                  class="file-upload"
                  action="/api/v5/data/file"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleReUpload"
                  accept=".gz"
                >
                  <el-button type="danger" :loading="isUploading">
                    {{ tl('deleteAndReUpload') }}
                  </el-button>
                </el-upload>
              </div>
            </el-radio>
          </div>
        </div>
      </div>
      <div v-if="currentStep === 1">
        <p>{{ tl('packageConfirm') }}</p>
        <div>
          <p class="part-header">{{ t('Dashboard.basic') }}</p>
          <ul class="info-list">
            <li v-for="{ label, value, key } in infoList" :key="key">
              <label>{{ label }}: </label>
              <span v-if="key !== 'md5_sum'">{{ value }}</span>
              <span v-else>
                {{ value }}
              </span>
            </li>
          </ul>
        </div>
        <div>
          <p class="part-header">{{ tl('updateLog') }}</p>
          <el-card class="update-log">
            <ul class="info-list">
              <li v-for="item in nodePackage?.change_logs || []" :key="item">
                <MarkdownContent :content="item" />
              </li>
            </ul>
          </el-card>
        </div>
      </div>
      <div v-if="currentStep === 2">
        <MarkdownContent :content="tl('upgradeWarning')" />
        <el-checkbox v-model="isConfirm">
          {{ tl('upgradeConfirm') }}
        </el-checkbox>
      </div>
    </div>
    <template #footer v-if="!isLoading">
      <div class="first-step-ft" v-if="currentStep === 0 && !nodePackage">
        <el-button size="large" @click="showDialog = false">{{ t('Base.cancel') }}</el-button>
        <el-button
          size="large"
          type="primary"
          :loading="isUploading"
          :disabled="!$hasPermission('post')"
          @click="uploadPackage"
        >
          {{ tl('upload') }}
        </el-button>
      </div>
      <el-button v-else-if="currentStep === 0 && nodePackage" @click="showDialog = false">
        {{ t('Base.cancel') }}
      </el-button>
      <el-button @click="goPreStep" v-if="currentStep > 0" :disabled="isSubmitting">
        {{ $t('Base.backStep') }}
      </el-button>
      <el-button
        v-if="currentStep < 2 && nodePackage"
        type="primary"
        :disabled="isUploading"
        @click="goNextStep"
      >
        {{ t('Base.nextStep') }}
      </el-button>
      <el-button
        v-if="currentStep === 2"
        type="primary"
        :loading="isSubmitting"
        :disabled="!$hasPermission('post')"
        @click="submit"
      >
        {{ tl('startUpgrade') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  getUpgradePackage,
  uploadUpgradePackage,
  upgradeNode,
  deleteUpgradePackage,
} from '@/api/hotUpgrade'
import GuideBar from '@/components/GuideBar.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { HotUpgradePackage, NodeUpgradeData } from '@/types/typeAlias'
import { Plus } from '@element-plus/icons-vue'
import { ElDialog, ElMessage, UploadFile } from 'element-plus'
import moment from 'moment'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean; node?: NodeUpgradeData }>()
const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'submitted'): void
}>()

const isSubmitting = ref(false)

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('General')

const stepList = [tl('selectUpgradePackage'), tl('upgradePackageInfo'), tl('startUpgrade')]
const currentStep = ref(0)
const activeGuideIndexList = computed(() =>
  Array.from({ length: currentStep.value + 1 }, (_, index) => index),
)

const goPreStep = () => {
  currentStep.value -= 1
}
const goNextStep = () => {
  currentStep.value += 1
}

const isLoading = ref(false)
const nodePackage = ref<HotUpgradePackage | undefined>(undefined)

const file = ref<undefined | File>(undefined)

const setFile = (selectedFile: File) => {
  file.value = selectedFile
  return false
}

const isUploading = ref(false)

const uploadPackage = async () => {
  if (!file.value) {
    ElMessage.warning(tl('packageRequired'))
    return
  }
  try {
    isUploading.value = true
    await uploadUpgradePackage(file.value)
    getCurrentPackage()
  } catch (error) {
    //
  } finally {
    isUploading.value = false
  }
}

const { operationWarning } = useOperationConfirm()
const handleReUpload = async (file: UploadFile) => {
  if (!file.raw) {
    return
  }
  await operationWarning(tl('confirmDeleteAndReUpload'))
  try {
    isUploading.value = true
    await deleteUpgradePackage()
    await uploadUpgradePackage(file.raw)
    await getCurrentPackage(false)
  } catch (error) {
    //
  } finally {
    isUploading.value = false
  }
}

const getCurrentPackage = async (toggleLoading = true) => {
  try {
    isLoading.value = toggleLoading && true
    nodePackage.value = await getUpgradePackage()
  } catch (error: any) {
    if (error.code === 404) {
      nodePackage.value = undefined
    }
  } finally {
    isLoading.value = false
  }
}

const infoMap: Array<{ label: string; key: keyof HotUpgradePackage }> = [
  { label: t('Base.name'), key: 'name' },
  { label: tl('version'), key: 'target_vsn' },
  { label: tl('availableVersions'), key: 'applicable_vsns' },
  { label: tl('buildDate'), key: 'build_date' },
  { label: tl('packageCheckCode'), key: 'md5_sum' },
]
const infoList = computed(() => {
  return infoMap.map(({ key, label }) => {
    let value = nodePackage.value?.[key]
    if (key === 'applicable_vsns' && Array.isArray(value)) {
      value = value?.join(', ')
    } else if (key === 'build_date') {
      value = moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
    return { label, value, key }
  })
})

const isConfirm = ref(false)

const submit = async () => {
  try {
    if (!props.node?.node) {
      return
    }
    if (!isConfirm.value) {
      ElMessage.warning(tl('confirmUpgradeRequired'))
      return
    }

    isSubmitting.value = true
    await upgradeNode(props.node.node)
    emit('submitted')
    showDialog.value = false
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

watch(showDialog, (val) => {
  if (val) {
    getCurrentPackage()
  } else {
    currentStep.value = 0
    isConfirm.value = false
    nodePackage.value = undefined
  }
})
</script>

<style lang="scss">
.upgrade-dialog {
  .el-loading-mask {
    background-color: var(--color-bg-content) !important;
    top: -10px;
    left: -10px;
  }
  .markdown-content {
    ol {
      padding-left: 20px;
    }
    li {
      line-height: 1.6;
    }
  }
  .package-display {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
  }
  .radio-container {
    padding: 20px;
    border-top: 1px solid var(--color-border-primary);
    border-bottom: 1px solid var(--color-border-primary);
    .el-button {
      margin-left: 20px;
    }
  }
  .tip-no-package {
    margin-bottom: 24px;
  }
  .uploader-container {
    padding-bottom: 8px;
    text-align: center;
  }
  ul {
    list-style: none;
  }
  ul,
  li {
    padding: 0;
    margin-top: 0;
  }
  .info-list {
    li {
      line-height: 1.5;
      margin-bottom: 8px;
    }
    label {
      margin-right: 4px;
      color: var(--color-text-secondary);
      opacity: 0.8;
    }
  }
  .update-log {
    background-color: var(--color-bg-split);
    .el-card__body {
      padding: 4px 24px;
    }
  }
  .upload-tip {
    margin-top: 32px;
    margin-bottom: 0;
    margin-left: auto;
    margin-right: auto;
  }
  .first-step-ft {
    padding-bottom: 20px;
    text-align: center;
    .el-button {
      width: 140px;
      &:not(:last-child) {
        margin-right: 28px;
      }
    }
  }
}
</style>
