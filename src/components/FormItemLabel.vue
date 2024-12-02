<template>
  <span>{{ label }}</span>
  <InfoTooltip v-bind="$attrs">
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
import { defineProps } from 'vue'
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
