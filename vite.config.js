import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { version as packageVersion } from './package.json'

const getVersion = (packageVersion) => {
  const matched = packageVersion.match(/^\d\.\d/)
  return matched ? `v${matched[0]}` : 'latest'
}
const version = getVersion(packageVersion)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const { HOST_URL } = env
  const target = HOST_URL || 'http://localhost:18083/'

  return {
    plugins: [
      vue(),
      vueJsx({ include: /\.[jt]s[x]?$/ }),
      nodePolyfills({
        include: ['path', 'util'],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          util: true,
        },
      }),
    ],
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
      __EMQX_VERSION__: JSON.stringify(version),
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
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
  }
})