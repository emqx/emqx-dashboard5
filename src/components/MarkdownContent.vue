<template>
  <div class="markdown-content" ref="containerEle"></div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from 'vue'

export default defineComponent({
  name: 'MarkdownContent',
})
</script>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { marked } from 'marked'

const containerEle = ref()

const props = defineProps({
  content: String as PropType<string>,
})

watch(
  () => props.content,
  (val) => {
    if (!val) {
      containerEle.value.innerHTML = ''
    } else {
      containerEle.value.innerHTML = marked.parse(val)
    }
  },
)
</script>
