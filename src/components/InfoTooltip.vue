<template>
  <el-tooltip effect="dark" :popper-class="tooltipPopperClass" placement="top" :content="content">
    <template v-if="$slots.content" #content>
      <slot name="content"></slot>
    </template>
    <i class="iconfont icon-question"></i>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InfoTooltip',
})
</script>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
  },
  popperClass: {
    type: String,
  },
})

const tooltipPopperClass = computed(() => `info-tooltip ${props.popperClass}`)
</script>

<style lang="scss" scoped>
@use 'sass:math';
.icon-question {
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  left: 8px;
  top: 0px;
}
</style>
