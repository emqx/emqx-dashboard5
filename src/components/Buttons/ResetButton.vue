<template>
  <el-button :icon="RefreshLeft">
    {{ t('Base.reset') }}
  </el-button>
</template>

<script lang="ts" setup>
import { RefreshLeft } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
