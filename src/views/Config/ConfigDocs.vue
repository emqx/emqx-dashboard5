<template>
  <div class="app-wrapper config-docs">{{ mdFile }}</div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'

const mdFile = ref('')
const loadConfigContent = async () => {
  axios.defaults.baseURL = ''
  const res = (await axios.get('config.md')) as string
  if (res !== '') {
    mdFile.value = res
  }
}
loadConfigContent()
</script>

<style lang="scss" scoped></style>
