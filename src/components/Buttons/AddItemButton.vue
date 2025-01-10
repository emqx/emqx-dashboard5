<template>
  <el-button class="add-item-button" :icon="Plus" :disabled="!$hasPermission('post')">
    <slot v-if="!$slots.default"></slot>
    <template v-else>
      {{ t('Base.add') }}
    </template>
  </el-button>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss">
.add-item-button {
  width: 400px;
  &.el-button {
    border-style: dashed;
  }
}
</style>
