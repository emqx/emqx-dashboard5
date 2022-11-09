<template>
  <div class="code-view">
    <hljsVuePlugin :code="code" :language="lang" :autodetect="false" />
    <el-tooltip v-if="showCopyBtn" effect="dark" placement="top" :content="tl('copy')">
      <el-icon class="icon-copy" @click="copyText(code)">
        <copy-document />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script>
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/monokai-sublime.css'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'
import bash from '@/common/highlight/bash'
import yaml from 'highlight.js/lib/languages/yaml'
import javascript from 'highlight.js/lib/languages/javascript'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import useI18nTl from '@/hooks/useI18nTl'
import { CopyDocument } from '@element-plus/icons-vue'
import useCopy from '@/hooks/useCopy'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('yaml', yaml)

export default {
  name: 'CodeView',

  components: {
    hljsVuePlugin: hljsVuePlugin.component,
    CopyDocument,
  },

  props: {
    code: {
      type: String,
      default: '',
    },
    lang: {
      type: String,
      default: 'json',
    },
    showCopyBtn: {
      type: Boolean,
      default: true,
    },
  },

  setup() {
    const { tl } = useI18nTl('Base')
    const { copyText } = useCopy()

    return {
      tl,
      copyText,
    }
  },
}
</script>

<style lang="scss">
.code-view {
  position: relative;
  margin: 1em 0;
  .hljs {
    border-radius: 8px;
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
  }
}
.el-popper {
  .hljs {
    border-radius: 8px;
  }
}
</style>
