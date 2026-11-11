import store from '@/store'

import { createI18n } from 'vue-i18n'
import type { DefineLocaleMessage } from 'vue-i18n'

import zhLocale from 'element-plus/es/locale/lang/zh-cn'
import enLocale from 'element-plus/es/locale/lang/en'

import schemaTextZh from '@/schemaText/schema-text-zh'
import schemaTextEn from '@/schemaText/schema-text-en'

import {
  enSymbolLabel as symbolLabelEn,
  zhSymbolLabel as symbolLabelZh,
} from '@emqx/shared-ui-i18n'

import actionText from '@/schemaText/actionText/index'

const lang: Record<'en' | 'zh', DefineLocaleMessage> = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
}

// Load messages before creating i18n so the first render has all translations.
const modules = import.meta.glob<Record<string, { en: string; zh: string }>>('./i18n/*.ts', {
  eager: true,
  import: 'default',
})

Object.entries(modules).forEach(([path, translations]) => {
  const partKey = path.slice(path.lastIndexOf('/') + 1, -3)
  const enMessages: Record<string, string> = {}
  const zhMessages: Record<string, string> = {}
  Object.entries(translations).forEach(([key, { en, zh }]) => {
    enMessages[key] = en
    zhMessages[key] = zh
  })
  lang.en[partKey] = enMessages
  lang.zh[partKey] = zhMessages
})

lang.en.ConfigSchema = schemaTextEn
lang.zh.ConfigSchema = schemaTextZh

lang.en.BridgeSchema = actionText.en
lang.zh.BridgeSchema = actionText.zh

lang.en.SchemaSymbolLabel = symbolLabelEn
lang.zh.SchemaSymbolLabel = symbolLabelZh

const i18nInstance = createI18n({
  legacy: false,
  messages: lang,
  locale: store.state.lang,
  warnHtmlMessage: false,
})

export const getLocalMessage = (path: string): string => {
  return i18nInstance.global.t(path)
}

export default i18nInstance
