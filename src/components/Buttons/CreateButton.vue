<template>
  <el-button type="primary" v-if="noText" :disabled="!$hasPermission('post')">
    <Plus />
  </el-button>
  <el-button type="primary" v-else :disabled="!$hasPermission('post')">
    <Plus class="mr-2" />
    <template v-if="!$slots.default">{{ t('Base.create') }}</template>
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

defineProps<{
  noText?: boolean
}>()

const { t } = useI18n()
</script>
