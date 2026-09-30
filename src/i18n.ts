import store from '@/store'

import { createI18n } from 'vue-i18n'

import zhLocale from 'element-plus/es/locale/lang/zh-cn'
import zhTWLocale from 'element-plus/es/locale/lang/zh-tw'
import enLocale from 'element-plus/es/locale/lang/en'

import schemaTextZh from '@/schemaText/schema-text-zh'
import schemaTextEn from '@/schemaText/schema-text-en'

import {
  enSymbolLabel as symbolLabelEn,
  zhSymbolLabel as symbolLabelZh,
} from '@emqx/shared-ui-i18n'

import actionText from '@/schemaText/actionText/index'
import zhTWMessages from '@/i18n/zh-TW.json'

const lang: { [key: string]: any } = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
  'zh-TW': {
    ...zhTWLocale,
  },
}

// Traditional Chinese is generated from the Simplified Chinese texts by
// scripts/i18n/gen-zh-TW.mjs, but it is a locale in its own right: a string
// zh-TW.json does not cover shows English, not Simplified Chinese. This is the
// same rule the broker applies to the config descriptions.
const zhTW = zhTWMessages as Record<string, any>

const withZhTW = (enText: any, overrides: any): any => {
  if (!isPlainObject(enText) && !isPlainObject(overrides)) {
    return overrides ?? enText
  }
  const keys = new Set([...Object.keys(enText ?? {}), ...Object.keys(overrides ?? {})])
  return [...keys].reduce((acc: Record<string, any>, key) => {
    acc[key] = withZhTW(enText?.[key], overrides?.[key])
    return acc
  }, {})
}

// Dynamically import all translation files
const modules = import.meta.glob('./i18n/*.ts')

// Process each module
Object.keys(modules).forEach((path) => {
  const partKey = path.match(/\/(\w+)\.ts$/)?.[1] // retrieve the filename as partial keys
  if (partKey) {
    modules[path]().then((mod) => {
      const tran = mod.default
      lang.en[partKey] = lang.en[partKey] || {}
      lang.zh[partKey] = lang.zh[partKey] || {}
      lang['zh-TW'][partKey] = lang['zh-TW'][partKey] || {}
      Object.keys(tran).forEach((k) => {
        const { en, zh } = tran[k]
        lang.en[partKey][k] = en
        lang.zh[partKey][k] = zh
        lang['zh-TW'][partKey][k] = zhTW[partKey]?.[k] ?? en
      })
    })
  }
})

lang.en.ConfigSchema = schemaTextEn
lang.zh.ConfigSchema = schemaTextZh
lang['zh-TW'].ConfigSchema = withZhTW(schemaTextEn, zhTW.ConfigSchema)

lang.en.BridgeSchema = actionText.en
lang.zh.BridgeSchema = actionText.zh
lang['zh-TW'].BridgeSchema = withZhTW(actionText.en, zhTW.BridgeSchema)

lang.en.SchemaSymbolLabel = symbolLabelEn
lang.zh.SchemaSymbolLabel = symbolLabelZh
lang['zh-TW'].SchemaSymbolLabel = withZhTW(symbolLabelEn, zhTW.SchemaSymbolLabel)

const i18nInstance = createI18n({
  legacy: false,
  messages: lang,
  locale: store.state.lang,
  warnHtmlMessage: false,
})

export const getLocalMessage = (path: string): string => {
  const local = i18nInstance.global.locale
  const messages = i18nInstance.global.messages[local]
  return get(messages, path)
}

export default i18nInstance
