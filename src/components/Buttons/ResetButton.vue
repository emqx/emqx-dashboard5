<template>
  <el-tooltip :content="t('Base.reset')" placement="top" :hide-after="0">
    <el-button class="icon-button" plain v-bind="$attrs">
      <Icon icon="lucide:rotate-ccw" />
    </el-button>
  </el-tooltip>
</template>

<script lang="ts" setup>
const { t } = useI18n()
</script>
