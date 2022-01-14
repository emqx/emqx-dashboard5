// import VueI18n from "vue-i18n";
// import Vue from "vue";
import store from '@/store'

import { createI18n } from 'vue-i18n'

import zhLocale from 'element-plus/es/locale/lang/zh-cn'
import enLocale from 'element-plus/es/locale/lang/en'

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

// Vue.use(VueI18n);

// export default new VueI18n({
//   locale: store.state.lang,
//   messages: lang,
// });

export default createI18n({
  messages: lang,
  locale: store.state.lang,
})
