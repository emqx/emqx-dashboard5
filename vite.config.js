import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { version as packageVersion } from './package.json'

const getVersion = (packageVersion) => {
  const matched = packageVersion.match(/^\d\.\d/)
  return matched ? `v${matched[0]}` : 'latest'
}
const version = getVersion(packageVersion)

const { HOST_URL } = process.env
const target = HOST_URL || 'http://localhost:18083/'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 7000,
    proxy: {
      '/api/v5': {
        target,
        changeOrigin: true,
      },
    },
  },
  define: {
    VITE_EMQX_VERSION: JSON.stringify(version),
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  build: {
    assetsDir: 'static',
    sourcemap: false,
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       'monaco-editor': ['monaco-editor'],
    //     },
    //   },
    // },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['@vue-flow/core', '@emqx/shared-ui-utils'],
  },
})
