import store from '@/store'

import { createI18n } from 'vue-i18n'
import type { DefineLocaleMessage } from 'vue-i18n'

import zhLocale from 'element-plus/es/locale/lang/zh-cn'
import zhTWLocale from 'element-plus/es/locale/lang/zh-tw'
import enLocale from 'element-plus/es/locale/lang/en'

import schemaTextZh from '@/schemaText/schema-text-zh'
import schemaTextZhTW from '@/schemaText/schema-text-zh-TW'
import schemaTextEn from '@/schemaText/schema-text-en'

import {
  enFlow,
  zhFlow,
  enRuleFunction,
  zhRuleFunction,
  enRuleSQL,
  zhRuleSQL,
  enSymbolLabel as symbolLabelEn,
  zhSymbolLabel as symbolLabelZh,
} from '@emqx/shared-ui-i18n'

import { zhTWSymbolLabel } from '@emqx/shared-ui-i18n/zh-TW/integration'
import { zhTWRuleSQL } from '@emqx/shared-ui-i18n/zh-TW/ruleSQL'
import { zhTWRuleFunction } from '@emqx/shared-ui-i18n/zh-TW/ruleFunction'
import { zhTWFlow } from '@emqx/shared-ui-i18n/zh-TW/flow'

import actionText from '@/schemaText/actionText/index'
import zhTWMessages from '@/i18n/zh-TW.json'

const lang: Record<'en' | 'zh' | 'zh-TW', DefineLocaleMessage> = {
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
const zhTW: Record<string, Record<string, string>> = zhTWMessages

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

// Load messages before creating i18n so the first render has all translations.
const modules = import.meta.glob<Record<string, { en: string; zh: string }>>('./i18n/*.ts', {
  eager: true,
  import: 'default',
})

Object.entries(modules).forEach(([path, translations]) => {
  const partKey = path.slice(path.lastIndexOf('/') + 1, -3)
  const isFlow = partKey === 'Flow'
  const enMessages: Record<string, string> = isFlow ? { ...enFlow } : {}
  const zhMessages: Record<string, string> = isFlow ? { ...zhFlow } : {}
  const zhTWTexts: Record<string, string> = isFlow ? { ...zhTWFlow } : {}
  const localZhTW = zhTW[partKey]
  Object.entries(translations).forEach(([key, { en, zh }]) => {
    enMessages[key] = en
    zhMessages[key] = zh
    zhTWTexts[key] = localZhTW?.[key] ?? zhTWTexts[key] ?? en
  })
  lang.en[partKey] = enMessages
  lang.zh[partKey] = zhMessages
  lang['zh-TW'][partKey] = isFlow ? { ...enFlow, ...zhTWTexts } : zhTWTexts
})

// Keep the existing Function namespace backed by shared resources.
lang.en.Function = enRuleFunction
lang.zh.Function = zhRuleFunction
lang['zh-TW'].Function = withZhTW(enRuleFunction, zhTWRuleFunction)

lang.en.ruleSQL = enRuleSQL
lang.zh.ruleSQL = zhRuleSQL
lang['zh-TW'].ruleSQL = withZhTW(enRuleSQL, zhTWRuleSQL)

lang.en.ConfigSchema = schemaTextEn
lang.zh.ConfigSchema = schemaTextZh
lang['zh-TW'].ConfigSchema = withZhTW(schemaTextEn, schemaTextZhTW)

lang.en.BridgeSchema = actionText.en
lang.zh.BridgeSchema = actionText.zh
lang['zh-TW'].BridgeSchema = withZhTW(actionText.en, actionText['zh-TW'])

lang.en.SchemaSymbolLabel = symbolLabelEn
lang.zh.SchemaSymbolLabel = symbolLabelZh
lang['zh-TW'].SchemaSymbolLabel = withZhTW(
  symbolLabelEn,
  withZhTW(zhTWSymbolLabel, zhTW.SchemaSymbolLabel),
)

const i18nInstance = createI18n({
  legacy: false,
  messages: lang,
  locale: store.state.lang,
  fallbackLocale: { 'zh-TW': ['en'], default: ['en'] },
  warnHtmlMessage: false,
})

export const getLocalMessage = (path: string): string => {
  return i18nInstance.global.t(path)
}

export default i18nInstance
