<template>
  <div>
    <pre ref="codeView" class="code-view"><code :class="lang">{{ code }}</code></pre>
  </div>
</template>

<script>
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/solarized-dark.css'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'
import javascript from 'highlight.js/lib/languages/javascript'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)

export default {
  name: 'CodeView',

  components: {},

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

  data() {
    return {}
  },

  watch: {
    code() {
      this.render()
    },
    lang() {
      this.render()
    },
  },

  mounted() {
    this.render()
  },

  methods: {
    render() {
      hljs.highlightElement(this.$refs.codeView)
    },
  },
}
</script>

<style lang="scss">
.code-view {
  line-height: 1.3;
  &.hljs {
    padding: 20px;
    border-radius: 2px;
  }
}
</style>
