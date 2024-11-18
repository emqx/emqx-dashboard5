import store from '@/store'

import { createI18n } from 'vue-i18n'

import zhLocale from 'element-plus/es/locale/lang/zh-cn'
import enLocale from 'element-plus/es/locale/lang/en'

import schemaTextZh from '@/schemaText/schema-text-zh'
import schemaTextEn from '@/schemaText/schema-text-en'

import {
  enSymbolLabel as symbolLabelEn,
  zhSymbolLabel as symbolLabelZh,
} from '@emqx/shared-ui-i18n'

import actionText from '@/schemaText/actionText/index'

import { get } from 'lodash'

const lang: { [key: string]: any } = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
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
      Object.keys(tran).forEach((k) => {
        const { en, zh } = tran[k]
        lang.en[partKey][k] = en
        lang.zh[partKey][k] = zh
      })
    })
  }
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
  const local = i18nInstance.global.locale
  const messages = i18nInstance.global.messages[local]
  return get(messages, path)
}

export default i18nInstance
