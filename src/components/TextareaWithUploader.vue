<template>
  <div class="textarea-with-uploader">
    <el-input type="textarea" :rows="rows" v-model="inputValue" />
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
})

const emit = defineEmits(['update:modelValue'])

const { tl } = useI18nTl('Base')

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
    inputValue.value = content
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
  .el-textarea__inner {
    padding-bottom: 6px + 28px;
    box-sizing: border-box;
    resize: none;
  }
  .file-upload {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 4px 18px 6px;
  }
  .el-button {
    font-weight: normal;
    font-size: 14px;
    background-color: #f7f7f7;
    border-color: #f7f7f7;
  }
}
</style>
