<template>
  <div class="code-view">
    <component :is="maxHeight ? ElScrollbar : 'div'" v-bind="maxHeight ? { maxHeight } : {}">
      <component :is="hljsVuePlugin.component" :code="code" :language="lang" :autodetect="false" />
    </component>
    <el-tooltip v-if="showCopyBtn" effect="dark" placement="top" :content="tl('copy')">
      <el-icon class="icon-copy" @click="copyText(code)">
        <copy-document />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import sql from '@/common/highlight/sql'
import bash from '@/common/highlight/bash'
import yaml from 'highlight.js/lib/languages/yaml'
import javascript from 'highlight.js/lib/languages/javascript'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import { ElScrollbar } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('yaml', yaml)

defineProps<{
  code: string
  lang: string
  showCopyBtn?: boolean
  maxHeight?: number
}>()

const { tl } = useI18nTl('Base')
const { copyText } = useCopy()
</script>

<style lang="scss">
.code-view {
  position: relative;
  margin: 1em 0;
  .hljs {
    border-radius: var(--border-radius-small);
    padding: 20px;
    background-color: #232933;
    border: 1px solid var(--color-border-primary);
  }
  pre {
    margin: 0;
  }
  .icon-copy {
    position: absolute;
    top: 6px;
    right: 8px;
    cursor: pointer;
    color: #fff;
  }
}
.el-popper {
  .hljs {
    border-radius: var(--border-radius-small);
  }
}
</style>
