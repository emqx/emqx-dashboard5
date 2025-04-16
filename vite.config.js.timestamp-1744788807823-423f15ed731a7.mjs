// vite.config.js
import vue from "file:///Users/ysfscream/Workspace/EMQ/emqx-dashboard5/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/ysfscream/Workspace/EMQ/emqx-dashboard5/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { resolve } from "path";
import AutoImport from "file:///Users/ysfscream/Workspace/EMQ/emqx-dashboard5/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///Users/ysfscream/Workspace/EMQ/emqx-dashboard5/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig, loadEnv } from "file:///Users/ysfscream/Workspace/EMQ/emqx-dashboard5/node_modules/vite/dist/node/index.js";
import { nodePolyfills } from "file:///Users/ysfscream/Workspace/EMQ/emqx-dashboard5/node_modules/vite-plugin-node-polyfills/dist/index.js";

// auto-import.config.js
var auto_import_config_default = {
  // targets to transform
  include: [
    /\.[tj]sx?$/,
    // .ts, .tsx, .js, .jsx
    /\.vue$/,
    /\.vue\?vue/
    // .vue
  ],
  // global imports to register
  imports: [
    // presets
    "vue",
    // custom
    {
      "vue-router": [
        "useRouter",
        "onBeforeRouteLeave",
        "useRoute",
        "createRouter",
        "createWebHashHistory",
        "onBeforeRouteUpdate"
      ],
      axios: [
        // default imports
        ["default", "axios"]
        // import { default as axios } from 'axios',
      ],
      lodash: [
        ["default", "_"],
        "get",
        "pick",
        "isFunction",
        "isString",
        "isPlainObject",
        "throttle",
        "cloneDeep",
        "escape",
        "isObject",
        "isUndefined",
        "omit",
        "round",
        "set",
        "escapeRegExp",
        "isEqual",
        "debounce",
        "snakeCase",
        "isArray",
        "chunk",
        "isRegExp",
        "orderBy",
        "assign",
        "merge",
        "camelCase",
        "mergeWith",
        "startCase",
        "groupBy",
        "isNumber",
        "lowerCase",
        "pickBy",
        "toUpper",
        "trim",
        "unionBy",
        "sum",
        "uniq",
        "uniqBy"
      ],
      vuex: ["useStore", "createStore"],
      "vue-i18n": ["useI18n"],
      "element-plus": ["ElMessage", "ElMessageBox", "ElNotification"]
    },
    {
      from: "vue-router",
      imports: ["RouteLocationRaw", "RouteRecordRaw"],
      type: true
    },
    {
      from: "vue-i18n",
      imports: ["ComposerTranslation"],
      type: true
    }
  ],
  dts: "src/auto-imports.d.ts",
  vueTemplate: true,
  dirs: [
    "src/hooks/**",
    "src/common/constants.ts",
    "src/common/tools.ts",
    {
      glob: "src/hooks/**",
      types: true
      // enable import the types
    }
  ]
};
var autoImportComponentsConfig = {
  dts: "src/components.d.ts",
  dirs: ["src/components/**"],
  extensions: ["vue", "tsx", "jsx"]
};

// package.json
var version = "5.9.0";

// vite.config.js
var __vite_injected_original_dirname = "/Users/ysfscream/Workspace/EMQ/emqx-dashboard5";
var getVersion = (packageVersion) => {
  const matched = packageVersion.match(/^\d\.\d/);
  return matched ? `v${matched[0]}` : "latest";
};
var version2 = getVersion(version);
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const { HOST_URL } = env;
  const target = HOST_URL || "http://localhost:18083/";
  return {
    plugins: [
      vue(),
      vueJsx({ include: /\.[jt]s[x]?$/ }),
      nodePolyfills({
        include: ["path", "util"],
        // Whether to polyfill specific globals.
        globals: {
          Buffer: true,
          // can also be 'build', 'dev', or false
          global: true,
          util: true
        }
      }),
      AutoImport(auto_import_config_default),
      Components(autoImportComponentsConfig)
    ],
    server: {
      port: 7001,
      proxy: {
        "/api/v5": {
          target,
          changeOrigin: true
        }
      }
    },
    define: {
      __EMQX_VERSION__: JSON.stringify(version2)
    },
    css: {
      modules: {
        localsConvention: "camelCaseOnly"
      },
      preprocessorOptions: {
        scss: {
          api: "modern"
        }
      }
    },
    build: {
      assetsDir: "static",
      sourcemap: false
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
        "@": resolve(__vite_injected_original_dirname, "src")
      }
    },
    optimizeDeps: {
      include: ["@vue-flow/core", "@emqx/shared-ui-utils"],
      esbuildOptions: {
        define: {
          global: "globalThis"
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAiYXV0by1pbXBvcnQuY29uZmlnLmpzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy95c2ZzY3JlYW0vV29ya3NwYWNlL0VNUS9lbXF4LWRhc2hib2FyZDVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy95c2ZzY3JlYW0vV29ya3NwYWNlL0VNUS9lbXF4LWRhc2hib2FyZDUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3lzZnNjcmVhbS9Xb3Jrc3BhY2UvRU1RL2VtcXgtZGFzaGJvYXJkNS92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgeyBub2RlUG9seWZpbGxzIH0gZnJvbSAndml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHMnXG5pbXBvcnQgYXV0b0ltcG9ydENvbmZpZywgeyBhdXRvSW1wb3J0Q29tcG9uZW50c0NvbmZpZyB9IGZyb20gJy4vYXV0by1pbXBvcnQuY29uZmlnLmpzJ1xuaW1wb3J0IHsgdmVyc2lvbiBhcyBwYWNrYWdlVmVyc2lvbiB9IGZyb20gJy4vcGFja2FnZS5qc29uJ1xuXG5jb25zdCBnZXRWZXJzaW9uID0gKHBhY2thZ2VWZXJzaW9uKSA9PiB7XG4gIGNvbnN0IG1hdGNoZWQgPSBwYWNrYWdlVmVyc2lvbi5tYXRjaCgvXlxcZFxcLlxcZC8pXG4gIHJldHVybiBtYXRjaGVkID8gYHYke21hdGNoZWRbMF19YCA6ICdsYXRlc3QnXG59XG5jb25zdCB2ZXJzaW9uID0gZ2V0VmVyc2lvbihwYWNrYWdlVmVyc2lvbilcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKVxuICBjb25zdCB7IEhPU1RfVVJMIH0gPSBlbnZcbiAgY29uc3QgdGFyZ2V0ID0gSE9TVF9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6MTgwODMvJ1xuXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgdnVlKCksXG4gICAgICB2dWVKc3goeyBpbmNsdWRlOiAvXFwuW2p0XXNbeF0/JC8gfSksXG4gICAgICBub2RlUG9seWZpbGxzKHtcbiAgICAgICAgaW5jbHVkZTogWydwYXRoJywgJ3V0aWwnXSxcbiAgICAgICAgLy8gV2hldGhlciB0byBwb2x5ZmlsbCBzcGVjaWZpYyBnbG9iYWxzLlxuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgQnVmZmVyOiB0cnVlLCAvLyBjYW4gYWxzbyBiZSAnYnVpbGQnLCAnZGV2Jywgb3IgZmFsc2VcbiAgICAgICAgICBnbG9iYWw6IHRydWUsXG4gICAgICAgICAgdXRpbDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgQXV0b0ltcG9ydChhdXRvSW1wb3J0Q29uZmlnKSxcbiAgICAgIENvbXBvbmVudHMoYXV0b0ltcG9ydENvbXBvbmVudHNDb25maWcpLFxuICAgIF0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA3MDAxLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgJy9hcGkvdjUnOiB7XG4gICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIF9fRU1RWF9WRVJTSU9OX186IEpTT04uc3RyaW5naWZ5KHZlcnNpb24pLFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBtb2R1bGVzOiB7XG4gICAgICAgIGxvY2Fsc0NvbnZlbnRpb246ICdjYW1lbENhc2VPbmx5JyxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhcGk6ICdtb2Rlcm4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBhc3NldHNEaXI6ICdzdGF0aWMnLFxuICAgICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICAgIC8vIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIC8vICAgb3V0cHV0OiB7XG4gICAgICAvLyAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAvLyAgICAgICAnbW9uYWNvLWVkaXRvcic6IFsnbW9uYWNvLWVkaXRvciddLFxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgIH0sXG4gICAgICAvLyB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgaW5jbHVkZTogWydAdnVlLWZsb3cvY29yZScsICdAZW1xeC9zaGFyZWQtdWktdXRpbHMnXSxcbiAgICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAgIGRlZmluZToge1xuICAgICAgICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9XG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMveXNmc2NyZWFtL1dvcmtzcGFjZS9FTVEvZW1xeC1kYXNoYm9hcmQ1XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMveXNmc2NyZWFtL1dvcmtzcGFjZS9FTVEvZW1xeC1kYXNoYm9hcmQ1L2F1dG8taW1wb3J0LmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMveXNmc2NyZWFtL1dvcmtzcGFjZS9FTVEvZW1xeC1kYXNoYm9hcmQ1L2F1dG8taW1wb3J0LmNvbmZpZy5qc1wiO2V4cG9ydCBkZWZhdWx0IHtcbiAgLy8gdGFyZ2V0cyB0byB0cmFuc2Zvcm1cbiAgaW5jbHVkZTogW1xuICAgIC9cXC5bdGpdc3g/JC8sIC8vIC50cywgLnRzeCwgLmpzLCAuanN4XG4gICAgL1xcLnZ1ZSQvLFxuICAgIC9cXC52dWVcXD92dWUvLCAvLyAudnVlXG4gIF0sXG5cbiAgLy8gZ2xvYmFsIGltcG9ydHMgdG8gcmVnaXN0ZXJcbiAgaW1wb3J0czogW1xuICAgIC8vIHByZXNldHNcbiAgICAndnVlJyxcbiAgICAvLyBjdXN0b21cbiAgICB7XG4gICAgICAndnVlLXJvdXRlcic6IFtcbiAgICAgICAgJ3VzZVJvdXRlcicsXG4gICAgICAgICdvbkJlZm9yZVJvdXRlTGVhdmUnLFxuICAgICAgICAndXNlUm91dGUnLFxuICAgICAgICAnY3JlYXRlUm91dGVyJyxcbiAgICAgICAgJ2NyZWF0ZVdlYkhhc2hIaXN0b3J5JyxcbiAgICAgICAgJ29uQmVmb3JlUm91dGVVcGRhdGUnLFxuICAgICAgXSxcbiAgICAgIGF4aW9zOiBbXG4gICAgICAgIC8vIGRlZmF1bHQgaW1wb3J0c1xuICAgICAgICBbJ2RlZmF1bHQnLCAnYXhpb3MnXSwgLy8gaW1wb3J0IHsgZGVmYXVsdCBhcyBheGlvcyB9IGZyb20gJ2F4aW9zJyxcbiAgICAgIF0sXG4gICAgICBsb2Rhc2g6IFtcbiAgICAgICAgWydkZWZhdWx0JywgJ18nXSxcbiAgICAgICAgJ2dldCcsXG4gICAgICAgICdwaWNrJyxcbiAgICAgICAgJ2lzRnVuY3Rpb24nLFxuICAgICAgICAnaXNTdHJpbmcnLFxuICAgICAgICAnaXNQbGFpbk9iamVjdCcsXG4gICAgICAgICd0aHJvdHRsZScsXG4gICAgICAgICdjbG9uZURlZXAnLFxuICAgICAgICAnZXNjYXBlJyxcbiAgICAgICAgJ2lzT2JqZWN0JyxcbiAgICAgICAgJ2lzVW5kZWZpbmVkJyxcbiAgICAgICAgJ29taXQnLFxuICAgICAgICAncm91bmQnLFxuICAgICAgICAnc2V0JyxcbiAgICAgICAgJ2VzY2FwZVJlZ0V4cCcsXG4gICAgICAgICdpc0VxdWFsJyxcbiAgICAgICAgJ2RlYm91bmNlJyxcbiAgICAgICAgJ3NuYWtlQ2FzZScsXG4gICAgICAgICdpc0FycmF5JyxcbiAgICAgICAgJ2NodW5rJyxcbiAgICAgICAgJ2lzUmVnRXhwJyxcbiAgICAgICAgJ29yZGVyQnknLFxuICAgICAgICAnYXNzaWduJyxcbiAgICAgICAgJ21lcmdlJyxcbiAgICAgICAgJ2NhbWVsQ2FzZScsXG4gICAgICAgICdtZXJnZVdpdGgnLFxuICAgICAgICAnc3RhcnRDYXNlJyxcbiAgICAgICAgJ2dyb3VwQnknLFxuICAgICAgICAnaXNOdW1iZXInLFxuICAgICAgICAnbG93ZXJDYXNlJyxcbiAgICAgICAgJ3BpY2tCeScsXG4gICAgICAgICd0b1VwcGVyJyxcbiAgICAgICAgJ3RyaW0nLFxuICAgICAgICAndW5pb25CeScsXG4gICAgICAgICdzdW0nLFxuICAgICAgICAndW5pcScsXG4gICAgICAgICd1bmlxQnknLFxuICAgICAgXSxcbiAgICAgIHZ1ZXg6IFsndXNlU3RvcmUnLCAnY3JlYXRlU3RvcmUnXSxcbiAgICAgICd2dWUtaTE4bic6IFsndXNlSTE4biddLFxuICAgICAgJ2VsZW1lbnQtcGx1cyc6IFsnRWxNZXNzYWdlJywgJ0VsTWVzc2FnZUJveCcsICdFbE5vdGlmaWNhdGlvbiddLFxuICAgIH0sXG4gICAge1xuICAgICAgZnJvbTogJ3Z1ZS1yb3V0ZXInLFxuICAgICAgaW1wb3J0czogWydSb3V0ZUxvY2F0aW9uUmF3JywgJ1JvdXRlUmVjb3JkUmF3J10sXG4gICAgICB0eXBlOiB0cnVlLFxuICAgIH0sXG4gICAge1xuICAgICAgZnJvbTogJ3Z1ZS1pMThuJyxcbiAgICAgIGltcG9ydHM6IFsnQ29tcG9zZXJUcmFuc2xhdGlvbiddLFxuICAgICAgdHlwZTogdHJ1ZSxcbiAgICB9LFxuICBdLFxuICBkdHM6ICdzcmMvYXV0by1pbXBvcnRzLmQudHMnLFxuICB2dWVUZW1wbGF0ZTogdHJ1ZSxcbiAgZGlyczogW1xuICAgICdzcmMvaG9va3MvKionLFxuICAgICdzcmMvY29tbW9uL2NvbnN0YW50cy50cycsXG4gICAgJ3NyYy9jb21tb24vdG9vbHMudHMnLFxuICAgIHtcbiAgICAgIGdsb2I6ICdzcmMvaG9va3MvKionLFxuICAgICAgdHlwZXM6IHRydWUsIC8vIGVuYWJsZSBpbXBvcnQgdGhlIHR5cGVzXG4gICAgfSxcbiAgXSxcbn1cblxuZXhwb3J0IGNvbnN0IGF1dG9JbXBvcnRDb21wb25lbnRzQ29uZmlnID0ge1xuICBkdHM6ICdzcmMvY29tcG9uZW50cy5kLnRzJyxcbiAgZGlyczogWydzcmMvY29tcG9uZW50cy8qKiddLFxuICBleHRlbnNpb25zOiBbJ3Z1ZScsICd0c3gnLCAnanN4J10sXG59XG4iLCAie1xuICBcIm5hbWVcIjogXCJlbXF4LWRhc2hib2FyZDVcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiNS45LjBcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiZGV2XCI6IFwidml0ZVwiLFxuICAgIFwiZGV2OmVudGVycHJpc2VcIjogXCJWSVRFX0FQUF9WRVJTSU9OPWVudGVycHJpc2Ugdml0ZVwiLFxuICAgIFwiYnVpbGRcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJidWlsZDplbnRlcnByaXNlXCI6IFwiVklURV9BUFBfVkVSU0lPTj1lbnRlcnByaXNlIHZpdGUgYnVpbGRcIixcbiAgICBcImxpbnRcIjogXCJlc2xpbnQgLS1leHQgLmpzLC52dWUgLS1pZ25vcmUtcGF0aCAuZ2l0aWdub3JlIC0tZml4IHNyY1wiLFxuICAgIFwiZm9ybWF0XCI6IFwicHJldHRpZXIgLS13cml0ZSBcXFwic3JjLyoqLyouanNcXFwiIFxcXCJzcmMvKiovKi50c1xcXCIgXFxcInNyYy8qKi8qLnRzeFxcXCIgXFxcInNyYy8qKi8qLnZ1ZVxcXCIgXFxcInNyYy8qKi8qLnNjc3NcXFwiXCIsXG4gICAgXCJlc2NhcGVcIjogXCJub2RlIC4vc2NyaXB0cy9lc2NhcGVJMThOLmpzXCIsXG4gICAgXCJjaGVja1Blcm1pc3Npb25cIjogXCJub2RlIC4vc2NyaXB0cy9jaGVja1Blcm1pc3Npb24uanNcIixcbiAgICBcImNoZWNrSTE4blwiOiBcIm5vZGUgLi9zY3JpcHRzL2NoZWNrVXNlbGVzc0kxOG4uanNcIixcbiAgICBcInJlbW92ZS1vcnZhbC1jbGllbnRcIjogXCJub2RlIC4vc2NyaXB0cy9yZW1vdmVPcnZhbENsaWVudC5qc1wiLFxuICAgIFwib3J2YWw6YXBpXCI6IFwic291cmNlIC4vLmVudi5kZXZlbG9wbWVudC5sb2NhbCAmJiBwbnBtIG9ydmFsIC0taW5wdXQgJEhPU1RfVVJMXFxcXGFwaS1kb2NzL3N3YWdnZXIuanNvblwiLFxuICAgIFwib3J2YWw6bG9jYWxcIjogXCJwbnBtIG9ydmFsIC0taW5wdXQgLi9zd2FnZ2VyLmpzb25cIixcbiAgICBcInByZXBhcmVcIjogXCJodXNreVwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBlbGVtZW50LXBsdXMvaWNvbnMtdnVlXCI6IFwiXjEuMS4wXCIsXG4gICAgXCJAZW1xeC9zaGFyZWQtdWktaTE4blwiOiBcIn4wLjAuMzlcIixcbiAgICBcIkBlbXF4L3NoYXJlZC11aS11dGlsc1wiOiBcIn4wLjAuMTZcIixcbiAgICBcIkBoaWdobGlnaHRqcy92dWUtcGx1Z2luXCI6IFwiXjIuMS4wXCIsXG4gICAgXCJAdnVlLWZsb3cvY29yZVwiOiBcIl4xLjIwLjFcIixcbiAgICBcImFqdlwiOiBcIl44LjE3LjFcIixcbiAgICBcImFqdi1kcmFmdC0wNFwiOiBcIl4xLjAuMFwiLFxuICAgIFwiYWp2LWZvcm1hdHNcIjogXCJeMi4xLjFcIixcbiAgICBcImFzeW5jLXZhbGlkYXRvclwiOiBcIjQuMi41XCIsXG4gICAgXCJhdnNjXCI6IFwiNS43LjdcIixcbiAgICBcImF4aW9zXCI6IFwiXjEuNC4wXCIsXG4gICAgXCJjb21wYXJlLXZlcnNpb25zXCI6IFwiXjYuMC4wLXJjLjNcIixcbiAgICBcImNvcHktdG8tY2xpcGJvYXJkXCI6IFwiXjMuMy4xXCIsXG4gICAgXCJjcnlwdG8tanNcIjogXCJeNC4xLjFcIixcbiAgICBcImRheWpzXCI6IFwiXjEuMTEuMTNcIixcbiAgICBcImVjaGFydHNcIjogXCJeNS4yLjFcIixcbiAgICBcImVsZW1lbnQtcGx1c1wiOiBcIl4yLjkuNFwiLFxuICAgIFwiZ2Vuc29uLWpzXCI6IFwiXjAuMC44XCIsXG4gICAgXCJnaXRodWItbWFya2Rvd24tY3NzXCI6IFwiXjUuNy4wXCIsXG4gICAgXCJoaWdobGlnaHQuanNcIjogXCIxMC43LjNcIixcbiAgICBcImhvY29uLXBhcnNlclwiOiBcIl4xLjAuMVwiLFxuICAgIFwianMtYmFzZTY0XCI6IFwiXjMuNy4yXCIsXG4gICAgXCJqc29uLXRvLWF2cm9cIjogXCJeMS4xLjFcIixcbiAgICBcImxvZGFzaFwiOiBcIl40LjE3LjIxXCIsXG4gICAgXCJtYXJrZWRcIjogXCJeNC4wLjlcIixcbiAgICBcIm1vbmFjby1lZGl0b3JcIjogXCJeMC4zMC4wXCIsXG4gICAgXCJtcXR0XCI6IFwiXjQuMi44XCIsXG4gICAgXCJucHJvZ3Jlc3NcIjogXCJeMC4yLjBcIixcbiAgICBcInBhcGFwYXJzZVwiOiBcIl41LjQuMVwiLFxuICAgIFwicXJjb2RlXCI6IFwiXjEuNS40XCIsXG4gICAgXCJxc1wiOiBcIl42LjEyLjFcIixcbiAgICBcInNvcnRhYmxlanNcIjogXCJeMS4xNC4wXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxsc1wiOiBcIl4wLjIyLjBcIixcbiAgICBcInZ1ZVwiOiBcIl4zLjIuMTZcIixcbiAgICBcInZ1ZS1pMThuXCI6IFwiXjkuMi4wLWJldGEuMTlcIixcbiAgICBcInZ1ZS1yb3V0ZXJcIjogXCJeNC4wLjAtMFwiLFxuICAgIFwidnVleFwiOiBcIl40LjAuMC0wXCIsXG4gICAgXCJ4c3NcIjogXCJeMS4wLjE0XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHR5cGVzL2NyeXB0by1qc1wiOiBcIl40LjEuMVwiLFxuICAgIFwiQHR5cGVzL2xvZGFzaFwiOiBcIl40LjE0LjE5MVwiLFxuICAgIFwiQHR5cGVzL21hcmtlZFwiOiBcIl40LjAuMVwiLFxuICAgIFwiQHR5cGVzL25wcm9ncmVzc1wiOiBcIl4wLjIuM1wiLFxuICAgIFwiQHR5cGVzL3BhcGFwYXJzZVwiOiBcIl41LjMuMTRcIixcbiAgICBcIkB0eXBlcy9xcmNvZGVcIjogXCJeMS41LjVcIixcbiAgICBcIkB0eXBlcy9zb3J0YWJsZWpzXCI6IFwiXjEuMTAuN1wiLFxuICAgIFwiQHR5cGVzL3V0ZjhcIjogXCJeMy4wLjFcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9lc2xpbnQtcGx1Z2luXCI6IFwiXjcuMTguMFwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl43LjE4LjBcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiOiBcIl41LjAuMFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiOiBcIl40LjAuMFwiLFxuICAgIFwiQHZ1ZS9lc2xpbnQtY29uZmlnLXByZXR0aWVyXCI6IFwiXjkuMC4wXCIsXG4gICAgXCJAdnVlL2VzbGludC1jb25maWctdHlwZXNjcmlwdFwiOiBcIl4xMy4wLjBcIixcbiAgICBcIkB2dWUvdGVzdC11dGlsc1wiOiBcIl4yLjAuMC0wXCIsXG4gICAgXCJlc2xpbnRcIjogXCJeOC41Ny4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXByZXR0aWVyXCI6IFwiXjUuMC4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLXZ1ZVwiOiBcIl45LjI4LjBcIixcbiAgICBcImVzbVwiOiBcIl4zLjIuMjVcIixcbiAgICBcImh1c2t5XCI6IFwiXjkuMS41XCIsXG4gICAgXCJsaW50LXN0YWdlZFwiOiBcIl4xNS4yLjEwXCIsXG4gICAgXCJvcnZhbFwiOiBcIl42LjE3LjBcIixcbiAgICBcInByZXR0aWVyXCI6IFwiXjMuMy4zXCIsXG4gICAgXCJzYXNzXCI6IFwiXjEuODQuMFwiLFxuICAgIFwidHlwZS1mZXN0XCI6IFwiMC4yMC4yXCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwifjUuNS40XCIsXG4gICAgXCJ1bnBsdWdpbi1hdXRvLWltcG9ydFwiOiBcIl4xOS4xLjBcIixcbiAgICBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzXCI6IFwiXjI4LjQuMFwiLFxuICAgIFwidml0ZVwiOiBcIl41LjAuMFwiLFxuICAgIFwidnVlLXRzY1wiOiBcIl4yLjIuNFwiXG4gIH0sXG4gIFwiaHVza3lcIjoge1xuICAgIFwiaG9va3NcIjoge1xuICAgICAgXCJwcmUtY29tbWl0XCI6IFwibGludC1zdGFnZWRcIlxuICAgIH1cbiAgfSxcbiAgXCJsaW50LXN0YWdlZFwiOiB7XG4gICAgXCIqLntqcyx0cyx2dWV9XCI6IFtcbiAgICAgIFwiZXNsaW50IC0tZml4XCIsXG4gICAgICBcInByZXR0aWVyIC0td3JpdGVcIlxuICAgIF0sXG4gICAgXCIqLnNjc3NcIjogW1xuICAgICAgXCJwcmV0dGllciAtLXdyaXRlXCJcbiAgICBdXG4gIH1cbn0iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRULE9BQU8sU0FBUztBQUM1VSxPQUFPLFlBQVk7QUFDbkIsU0FBUyxlQUFlO0FBQ3hCLE9B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
