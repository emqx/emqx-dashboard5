<template>
  <el-button :disabled="!$hasPermission('put')" :icon="Setting">
    <slot>
      {{ tl('setting') }}
    </slot>
  </el-button>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'

const { tl } = useI18nTl('Base')
</script>
