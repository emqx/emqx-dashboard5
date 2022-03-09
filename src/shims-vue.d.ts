declare module 'echarts/lib/echarts'
declare module '@/common/http'

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/common/utils'
declare module 'js-sql-parser'
declare module 'highlight.js/lib/core'
declare module 'highlight.js/lib/languages/sql'
