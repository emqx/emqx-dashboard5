export default {
  // targets to transform
  include: [
    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
    /\.vue$/,
    /\.vue\?vue/, // .vue
  ],

  // global imports to register
  imports: [
    // presets
    'vue',
    // custom
    {
      'vue-router': [
        'useRouter',
        'onBeforeRouteLeave',
        'useRoute',
        'createRouter',
        'createWebHashHistory',
        'onBeforeRouteUpdate',
      ],
      axios: [
        // default imports
        ['default', 'axios'], // import { default as axios } from 'axios',
      ],
      lodash: [
        ['default', '_'],
        'get',
        'pick',
        'isFunction',
        'isString',
        'isPlainObject',
        'throttle',
        'cloneDeep',
        'escape',
        'isObject',
        'isUndefined',
        'omit',
        'round',
        'set',
        'escapeRegExp',
        'isEqual',
        'debounce',
        'snakeCase',
        'isArray',
        'chunk',
        'isRegExp',
        'orderBy',
        'assign',
        'merge',
        'camelCase',
        'mergeWith',
        'startCase',
        'groupBy',
        'isNumber',
        'lowerCase',
      ],
    },
    {
      from: 'vue-router',
      imports: ['RouteLocationRaw', 'RouteRecordRaw'],
      type: true,
    },
  ],
  dts: 'src/auto-imports.d.ts',
}
