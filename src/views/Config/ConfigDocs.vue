<template>
  <div class="app-wrapper config-docs">
    <MarkdownContent class="config-docs-content" :content="mdFile" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import MarkdownContent from '@/components/MarkdownContent.vue'

const mdFile = ref('')
const loadConfigContent = async () => {
  axios.defaults.baseURL = ''
  const res = (await axios.get('static/config.md')) as string
  if (res !== '') {
    mdFile.value = res
  }
}
loadConfigContent()
</script>

<style lang="scss" scoped></style>
