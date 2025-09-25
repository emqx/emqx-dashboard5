<template>
  <el-button class="cancel-button" type="primary" plain>
    {{ tl('cancel') }}
  </el-button>
</template>

<script setup lang="ts">
const { tl } = useI18nTl('Base')
</script>
