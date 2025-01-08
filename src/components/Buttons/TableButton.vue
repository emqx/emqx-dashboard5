<template>
  <el-button class="table-button" ref="ButtonRef" size="small" link type="primary">
    <template v-if="isDefaultIcon">
      <el-icon v-if="isDefaultIcon">
        <Setting v-if="isSetting" />
        <Delete v-if="isDelete" />
        <Edit v-if="isEdit" />
      </el-icon>
      <span><slot></slot></span>
    </template>
    <slot v-else></slot>
  </el-button>
</template>

<script lang="ts" setup>
import useI18nTl from '@/hooks/useI18nTl'
import { Setting, Delete, Edit } from '@element-plus/icons-vue'
import { computed, onMounted, ref } from 'vue'

const ButtonRef = ref()
const buttonText = ref('')

const { tl } = useI18nTl('Base')
const isSetting = computed(() => buttonText.value === tl('setting'))
const isDelete = computed(() => buttonText.value === tl('delete'))
const isEdit = computed(() => buttonText.value === tl('edit'))
const isDefaultIcon = computed(() => isSetting.value || isDelete.value || isEdit.value)

onMounted(() => {
  buttonText.value = ButtonRef.value?.$el?.innerText ?? ''
})
</script>

<style lang="scss">
.table-button.el-button {
  padding: 0;
  border: none;
  .iconfont {
    color: var(--el-color-primary);
  }
}
</style>
