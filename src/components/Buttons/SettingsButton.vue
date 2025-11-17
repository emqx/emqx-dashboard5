<template>
  <el-button :disabled="!$hasPermission('put')">
    <Settings class="mr-2" />
    {{ tl('setting') }}
  </el-button>
</template>

<script setup lang="ts">
import { Settings } from 'lucide-vue-next'

const { tl } = useI18nTl('Base')
</script>
