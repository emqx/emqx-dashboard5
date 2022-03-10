<template>
  <el-tooltip
    effect="dark"
    popper-class="info-tooltip"
    placement="top-start"
    :content="content"
    :width="300"
  >
    <template v-if="$slots.content" #content>
      <slot name="content"></slot>
    </template>
    <i class="icon-question">?</i>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InfoTooltip',
})
</script>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  content: String,
})
</script>

<style lang="scss" scoped>
.icon-question {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 4px;
  border: 1px solid currentColor;
  font-size: 10px;
  line-height: 12px;
  text-align: center;
  font-style: normal;
  transform: scale(0.8);
  transform-origin: top;
  cursor: pointer;
  border-radius: (12px) / 2;
  opacity: 0.8;
}
</style>

<style lang="scss">
.info-tooltip {
  max-width: 360px;
}
</style>
