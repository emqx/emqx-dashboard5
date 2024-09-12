/// <reference types="vite/client" />

declare const __EMQX_VERSION__: string

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
