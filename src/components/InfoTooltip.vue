<template>
  <el-tooltip
    effect="dark"
    :popper-class="tooltipPopperClass"
    :placement="place"
    :content="content"
    :show-after="showAfter"
  >
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
import { defineProps, computed, PropType } from 'vue'

const props = defineProps({
  content: {
    type: String,
  },
  popperClass: {
    type: String,
  },
  place: {
    type: String as PropType<any>,
    default: 'top',
  },
  showAfter: {
    type: Number,
    default: 500,
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
  margin-left: 8px;
}
</style>

<style lang="scss">
.info-tooltip {
  p {
    margin: 0;
  }
  code {
    padding-top: 2px;
    padding-bottom: 2px;
  }
  pre code {
    white-space: break-spaces;
    word-break: break-all;
  }
}
</style>
