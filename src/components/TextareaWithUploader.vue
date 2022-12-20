<template>
  <div class="textarea-with-uploader">
    <el-input type="textarea" :rows="rows" v-model="inputValue" :placeholder="placeholder" />
    <div class="uploader-ft">
      <p class="tip">{{ tipForShow }}</p>
      <el-upload
        ref="upload"
        class="file-upload"
        :show-file-list="false"
        action="/api/v5/data/file"
        :auto-upload="false"
        :on-change="handleChange"
        :on-error="handleError"
        :accept="accept"
      >
        <el-button plain>{{ $t('Base.selectFile') }}</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TextareaWithUploader',
})
</script>

<script setup lang="ts">
import { defineProps, computed, defineEmits, PropType } from 'vue'
import { UploadFile, ElMessageBox, ElMessage } from 'element-plus'
import useI18nTl from '@/hooks/useI18nTl'
import { findExtensionByName } from '@/common/tools'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  rows: {
    type: Number,
    default: 5,
  },
  accept: {
    type: String,
  },
  allowExtensions: {
    type: Array as PropType<Array<string>>,
  },
  placeholder: {
    type: String,
  },
  tip: {
    type: String,
  },
})

const emit = defineEmits(['update:modelValue'])

const { tl } = useI18nTl('Base')

const tipForShow = computed(() => props.tip || tl('inputWithUploaderTip'))

const inputValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const confirmReplacement = () => {
  return ElMessageBox.confirm(tl('confirmReplacement'), {
    confirmButtonText: tl('confirm'),
    cancelButtonText: tl('cancel'),
    type: 'warning',
  })
}

const checkExtension = (file: File) => {
  const extension = findExtensionByName(file.name)
  const { allowExtensions } = props
  return allowExtensions ? allowExtensions.some((item) => item === extension) : true
}

const handleChange = async (file: UploadFile) => {
  const reader = new FileReader()
  const fileRaw = file.raw
  if (!fileRaw) {
    return
  }
  if (props.allowExtensions && !checkExtension(fileRaw)) {
    ElMessage.warning(tl('extensionErrorMsg', { extensions: props.allowExtensions.join(', ') }))
    return
  }
  reader.readAsText(fileRaw)
  reader.onload = async (event: ProgressEvent<FileReader>) => {
    const content = (event.currentTarget as FileReader)?.result
    if (inputValue.value) {
      await confirmReplacement()
    }
    inputValue.value = content as string
  }
  reader.onerror = () => {
    ElMessage.error(tl('uploadFailed'))
  }
}

const handleError = (error: any) => {
  ElMessage.error(error.toString())
}
</script>

<style lang="scss" scoped>
.textarea-with-uploader {
  position: relative;
  :deep(.el-textarea__inner) {
    position: relative;
    box-sizing: border-box;
    resize: none;
    border-bottom: 60px solid transparent;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--color-border-primary));
    &:hover {
      box-shadow: 0 0 0 1px var(--el-input-hover-border-color);
    }
    &:focus {
      box-shadow: 0 0 0 1px var(--el-input-focus-border-color);
    }
  }
  .uploader-ft {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
    padding: 10px 12px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 12px;
      display: block;
      height: 1px;
      width: calc(100% - 12px - 12px);
      background: var(--color-border-primary);
    }
  }
  .tip {
    font-size: 12px;
    line-height: 1.4;
    margin-right: 16px;
  }
  .el-button {
    font-weight: normal;
    font-size: 14px;
    background-color: var(--color-bg-primary);
    border-color: var(--color-border-primary);
  }
}
</style>
