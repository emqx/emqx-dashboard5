<template>
  <el-button :icon="Refresh">
    <template v-if="!$slots.default && !noText">
      {{ t('Base.refresh') }}
    </template>
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { defineProps } from 'vue'

defineProps<{
  noText?: boolean
}>()

const { t } = useI18n()
</script>

<style lang="scss"></style>
