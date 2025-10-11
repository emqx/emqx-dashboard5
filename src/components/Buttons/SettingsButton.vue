<template>
  <el-button :disabled="!$hasPermission('put')">
    <Icon icon="lucide:settings" class="mr-2" />
    {{ tl('setting') }}
  </el-button>
</template>

<script setup lang="ts">
const { tl } = useI18nTl('Base')
</script>
