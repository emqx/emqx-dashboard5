<template>
  <el-row class="plugin-info-item">
    <el-col :span="8" class="label">{{ label }}:</el-col>
    <el-col :span="16" class="content">
      <slot></slot>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PluginInfoItem',
})
</script>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  label: {
    type: String,
  },
})
</script>

<style lang="scss" scoped>
.plugin-info-item {
  padding-top: 10px;
  padding-bottom: 10px;
  line-height: 20px;
  .label {
    color: #8d96a2;
  }
  .content {
    color: #1d1d1d;
  }
}
</style>
