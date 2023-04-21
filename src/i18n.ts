import store from '@/store'

import { createI18n } from 'vue-i18n'

import zhLocale from 'element-plus/es/locale/lang/zh-cn'
import enLocale from 'element-plus/es/locale/lang/en'

import schemaTextZh from '@/schemaText/schema-text-zh.json'
import schemaTextEn from '@/schemaText/schema-text-en.json'

import resourceOptSchemaZh from '@/schemaText/resource-opt-schema-zh.json'
import resourceOptSchemaEn from '@/schemaText/resource-opt-schema-en.json'
import bridgeSchemaTextZh from '@/schemaText/bridge-text-zh.json'
import bridgeSchemaTextEn from '@/schemaText/bridge-text-en.json'

import { get } from 'lodash'

const lang: { [key: string]: any } = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
}
const translations = require.context('./i18n', false, /\.js$/)
Array.prototype.forEach.call(translations.keys(), (path) => {
  const tran = translations(path).default
  const partKey = path.match(/\w+/)[0] //retrieve the filename as partial keys
  lang.en[partKey] = lang.en[partKey] || {}
  lang.zh[partKey] = lang.zh[partKey] || {}
  Object.keys(tran).forEach((k) => {
    const { en, zh } = tran[k]
    lang.en[partKey][k] = en
    lang.zh[partKey][k] = zh
  })
})

lang.en.ConfigSchema = schemaTextEn
lang.zh.ConfigSchema = schemaTextZh

lang.en.BridgeSchema = { ...resourceOptSchemaEn, ...bridgeSchemaTextEn }
lang.zh.BridgeSchema = { ...resourceOptSchemaZh, ...bridgeSchemaTextZh }

const i18nInstance = createI18n({
  messages: lang,
  locale: store.state.lang,
  warnHtmlInMessage: 'off',
})

export const getLocalMessage = (path: string): string => {
  const local = i18nInstance.global.locale
  const messages = i18nInstance.global.messages[local]
  return get(messages, path)
}

export default i18nInstance
