<template>
  <div class="app-wrapper config-docs">
    <MarkdownContent class="config-docs-content" :content="mdFile" show-toc />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConfigDocs',
})
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import MarkdownContent from '@/components/MarkdownContent.vue'
import { useStore } from 'vuex'

const mdFile = ref('')
const store = useStore()
const loadConfigContent = async () => {
  const fileRequest = axios.create({
    baseURL: '',
  })
  const filePath = `static/config-${store.state.lang}.md`
  const res = await fileRequest.get<string>(filePath)
  if (res && res.data !== '') {
    mdFile.value = res.data
  }
}
loadConfigContent()
</script>

<style lang="scss">
.config-docs-content {
  h1 {
    font-size: 1.75rem;
    padding-top: 60px;
  }
  h2 {
    font-size: 1.5rem;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid #eaecef;
  }
  h3 {
    font-size: 1.35rem;
  }
  h1,
  h2,
  h3,
  h4 {
    color: var(--el-text-color-primary);
    line-height: 1.25;
    font-weight: 600;
    margin-top: -3.1rem;
    padding-top: 4.6rem;
    margin-bottom: 0;
  }
  ol,
  p,
  ul {
    line-height: 1.7;
    margin: 1rem 0;
  }
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;
    color: #476582;
    padding: 0.25rem 0.5rem;
    margin: 0;
    font-size: 0.85em;
    background-color: #1b1f230d;
    border-radius: 3px;
  }
  pre,
  pre[class*='language-'] {
    line-height: 1.4;
    padding: 1.25rem 1.5rem;
    margin: 0.85rem 0;
    background-color: #282c34;
    border-radius: 6px;
    overflow: auto;
    text-shadow: none;
    code {
      color: #fff;
      padding: 0;
      background-color: transparent;
      border-radius: 0;
    }
    .number {
      display: unset;
      background-color: initial;
      border-radius: initial;
      font-size: 14px;
      height: auto;
      margin-right: initial;
      min-width: initial;
      padding: initial;
      color: #cc99cd;
      text-align: unset;
      vertical-align: unset;
    }
  }
  a {
    font-weight: 500;
  }
  ul {
    list-style: disc;
    padding-left: 1.2em;
  }
  ol {
    list-style: decimal;
    padding-left: 1.2em;
  }
  img {
    max-height: 583px;
  }
  table {
    border-collapse: collapse;
    margin: 1rem 0;
    display: block;
    overflow-x: auto;
  }
  tr {
    border-top: 1px solid #dfe2e5;
  }
  td,
  th {
    border: 1px solid #dfe2e5;
    padding: 0.6em 1em;
  }
  tr:nth-child(2n) {
    background-color: #f6f8fa;
  }
  article {
    margin-right: 40px;
  }
  blockquote {
    background-color: #f3f5f7;
    border-color: var(--el-color-primary);
    padding: 0.1rem 1.5rem;
    border-left-width: 0.5rem;
    border-left-style: solid;
    margin: 1rem 0;
  }
  .toc-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .toc-list {
    position: fixed;
    right: 24px;
    top: 110px;
    bottom: 40px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .toc {
    font-size: 14px;
    list-style: none;
    &.level-2 {
      padding-bottom: 8px;
      padding-top: 8px;
      border-top: 1px dashed #e2e8f0;
    }
    &.level-3 {
      padding-bottom: 8px;
      padding-top: 8px;
      margin-left: 12px;
      border-top: 1px dashed #e2e8f0;
    }
    &.level-4 {
      padding-bottom: 8px;
      padding-top: 8px;
      margin-left: 24px;
    }
    a {
      color: #4a5568;
      &.is-active,
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
