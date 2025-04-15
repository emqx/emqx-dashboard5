<template>
  <span>{{ label }}</span>
  <InfoTooltip
    v-if="desc"
    v-bind="$attrs"
    :popper-class="`${$attrs.popperClass} ${maxHeight ? 'no-padding-right' : ''}`"
  >
    <template #content>
      <template v-if="!descMarked">{{ desc }}</template>
      <template v-else>
        <el-scrollbar v-if="maxHeight" :max-height="maxHeight">
          <MarkdownContent :content="desc" in-tooltip />
        </el-scrollbar>
        <MarkdownContent v-else :content="desc" in-tooltip />
      </template>
    </template>
  </InfoTooltip>
</template>

<script setup lang="ts">
import MarkdownContent from './MarkdownContent.vue'
import InfoTooltip from './InfoTooltip.vue'

defineProps({
  label: {
    type: String,
  },
  desc: {
    type: String,
  },
  descMarked: {
    type: Boolean,
    default: false,
  },
  maxHeight: {
    type: Number,
  },
})
</script>

<style lang="scss">
.info-tooltip {
  &.no-padding-right {
    padding-right: 0;
    .el-scrollbar__view {
      padding-right: 11px;
    }
  }
}
</style>
