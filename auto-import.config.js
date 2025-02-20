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
    'vue-router',

    // custom
    {
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
  ],
  dts: 'src/auto-imports.d.ts',
}
