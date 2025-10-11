<template>
  <el-button type="primary" v-if="noText" :disabled="!$hasPermission('post')">
    <Icon icon="lucide:plus" />
  </el-button>
  <el-button type="primary" v-else :disabled="!$hasPermission('post')">
    <Icon icon="lucide:plus" class="mr-2" />
    <template v-if="!$slots.default">{{ t('Base.create') }}</template>
    <slot />
  </el-button>
</template>

<script setup lang="ts">
defineProps<{
  noText?: boolean
}>()

const { t } = useI18n()
</script>
