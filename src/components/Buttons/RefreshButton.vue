<template>
  <el-button type="primary" :icon="Refresh" v-if="noText"></el-button>
  <el-button type="primary" :icon="Refresh" v-else>
    <template v-if="!$slots.default">
      {{ t('Base.refresh') }}
    </template>
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  noText?: boolean
}>()

const { t } = useI18n()
</script>

<style lang="scss"></style>
