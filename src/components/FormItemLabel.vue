<template>
  <span>{{ label }}</span>
  <InfoTooltip v-if="desc" v-bind="$attrs">
    <template #content>
      <template v-if="!descMarked">{{ desc }}</template>
      <MarkdownContent v-else :content="desc" />
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
})
</script>
