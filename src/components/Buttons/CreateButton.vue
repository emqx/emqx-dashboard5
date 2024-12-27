<template>
  <el-button type="primary" :icon="Plus" v-if="noText"></el-button>
  <el-button type="primary" :icon="Plus" v-else>
    <template v-if="!$slots.default">{{ t('Base.create') }}</template>
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { defineProps } from 'vue'

defineProps<{
  noText?: boolean
}>()

const { t } = useI18n()
</script>
