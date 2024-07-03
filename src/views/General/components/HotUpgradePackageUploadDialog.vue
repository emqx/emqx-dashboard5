<template>
  <el-dialog
    :title="tl('upgradePackageUpload')"
    v-model="showDialog"
    class="package-dialog"
    :width="700"
    destroy-on-close
  >
    <div>
      <el-upload
        class="object-uploader"
        drag
        :before-upload="setFile"
        :show-file-list="false"
        accept=".gz"
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

    <template #footer>
      <div class="dialog-align-footer">
        <el-button size="large" @click="showDialog = false">{{ t('Base.cancel') }}</el-button>
        <el-button
          size="large"
          type="primary"
          :loading="isSubmitting"
          :disabled="!$hasPermission('post')"
          @click="submit"
        >
          {{ tl('upload') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import useI18nTl from '@/hooks/useI18nTl'
import { Plus } from '@element-plus/icons-vue'
import { ElDialog } from 'element-plus'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const isSubmitting = ref(false)

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('General')

const file = ref<undefined | File>(undefined)

const setFile = (selectedFile: File) => {
  file.value = selectedFile
  return false
}

watch(showDialog, (val) => {
  if (val) {
    //  TODO:
  } else {
    file.value = undefined
  }
})

const submit = async () => {
  try {
    isSubmitting.value = true
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss">
.package-dialog {
  .el-dialog__body {
    padding-bottom: 8px;
    text-align: center;
  }
  .upload-tip {
    margin-top: 32px;
    margin-left: auto;
    margin-right: auto;
  }
  .el-dialog__footer {
    text-align: center;
    padding-bottom: 32px;
    .el-button {
      width: 140px;
      &:not(:last-child) {
        margin-right: 28px;
      }
    }
  }
}
</style>
