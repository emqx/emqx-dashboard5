<template>
  <div class="config-item-data-look">
    <el-input class="file-path" v-model="valueForShowInInput" disabled />
    <div class="btn-container">
      <el-tooltip
        effect="dark"
        popper-class="info-tooltip"
        placement="top-start"
        :content="$t('Base.copyFilePath')"
      >
        <el-icon class="icon-copy" :size="18" @click="copyPath">
          <DocumentCopy />
        </el-icon>
      </el-tooltip>
      <el-button @click="reset">{{ $t('Base.resetConfig') }}</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfigItemDataLook',
})
</script>

<script setup lang="ts">
import { defineEmits, defineProps, computed } from 'vue'
import { DocumentCopy } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import useCopy from '@/hooks/useCopy'

const props = defineProps({
  value: {
    type: String,
  },
})

const emit = defineEmits(['reset'])

const reset = () => {
  emit('reset')
}

const { t } = useI18n()
const valueForShowInInput = computed(() => `${t('Base.filePath')}: ${props.value}`)

const { copyText } = useCopy()
const copyPath = () => {
  if (props.value) {
    copyText(props.value)
  }
}
</script>

<style lang="scss">
.config-item-data-look {
  display: flex;
  justify-content: space-between;
  width: 100%;
  .file-path {
    margin-right: 16px;
  }
  .icon-copy {
    margin-right: 12px;
    cursor: pointer;
  }
  .btn-container {
    display: flex;
    align-items: center;
  }
}
</style>
