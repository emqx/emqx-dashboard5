<template>
  <el-tooltip :content="t('Base.reset')" placement="top" :hide-after="0">
    <el-button class="icon-button" plain v-bind="$attrs">
      <RotateCcw />
    </el-button>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { RotateCcw } from 'lucide-vue-next'

const { t } = useI18n()
</script>
