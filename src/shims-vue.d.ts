import { ActionType } from './plugins/permissionsPlugin'

declare module 'echarts/lib/echarts'
declare module '@/common/http'

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $hasPermission: (actionType: ActionType) => boolean
  }
}

declare module 'vuex' {
  export * from 'vuex/types/index.d.ts'
  export * from 'vuex/types/helpers.d.ts'
  export * from 'vuex/types/logger.d.ts'
  export * from 'vuex/types/vue.d.ts'
}

declare module '@/common/highlight/sql'
declare module '@/common/highlight/bash'
declare module 'js-sql-parser'
declare module 'highlight.js/*'
declare module 'monaco-editor/esm/vs/basic-languages/sql/sql'
declare module 'hocon-parser'
declare module 'github-markdown-css/*.css'
declare module 'to-json-schema'
