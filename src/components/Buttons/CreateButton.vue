<template>
  <el-button type="primary" :icon="Plus">
    <template v-if="!$slots.default">
      {{ t('Base.create') }}
    </template>
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
