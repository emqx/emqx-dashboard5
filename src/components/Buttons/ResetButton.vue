<template>
  <el-button link>
    {{ t('Base.reset') }}
  </el-button>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
