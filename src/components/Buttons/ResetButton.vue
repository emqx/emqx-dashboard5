<template>
  <el-button :icon="RefreshLeft" plain>
    {{ t('Base.reset') }}
  </el-button>
</template>

<script lang="ts" setup>
import { RefreshLeft } from '@element-plus/icons-vue'

const { t } = useI18n()
</script>
