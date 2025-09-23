<template>
  <el-tooltip :content="t('Base.reset')" placement="top" :hide-after="0">
    <IconButton :icon="RefreshLeft" v-bind="$attrs" />
  </el-tooltip>
</template>

<script lang="ts" setup>
import { RefreshLeft } from '@element-plus/icons-vue'

const { t } = useI18n()
</script>
