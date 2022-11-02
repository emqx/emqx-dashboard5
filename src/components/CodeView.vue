<template>
  <hljsVuePlugin class="code-view" :code="code" :language="lang" :autodetect="false" />
</template>

<script>
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/solarized-dark.css'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'
import bash from '@/common/highlight/bash'
import yaml from 'highlight.js/lib/languages/yaml'
import javascript from 'highlight.js/lib/languages/javascript'
import hljsVuePlugin from '@highlightjs/vue-plugin'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('yaml', yaml)

export default {
  name: 'CodeView',

  components: {
    hljsVuePlugin: hljsVuePlugin.component,
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
  },
}
</script>

<style lang="scss">
.code-view {
  line-height: 1.6;
  .hljs {
    border-radius: 4px;
    padding: 1em;
  }
}
.el-popper {
  .hljs {
    border-radius: 8px;
  }
}
</style>
