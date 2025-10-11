import { createApp, App as Application } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/style/tailwind.css'
import '@/assets/iconfont/iconfont.css'
import '@/style/common.scss'
import '@emqx/shared-ui-components/dist/style.css'
import 'highlight.js/styles/monokai-sublime.css'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import ElementPlus from 'element-plus'
import elementI18nZhCn from 'element-plus/es/locale/lang/zh-cn'
import elementI18nEn from 'element-plus/es/locale/lang/en'
import safeHTML from '@/common/safeHTML'
import i18n from './i18n'
import globalComponents from './components/global-components'
import permissionsPlugin from './plugins/permissionsPlugin'
import { FlowComponents } from '@emqx/shared-ui-components'

function bindDirective(app: Application) {
  app.directive('safe-html', safeHTML)
}

const elementLang = store.state.lang === 'en' ? elementI18nEn : elementI18nZhCn
const componentLocale = store.state.lang === 'zh' ? 'zh' : 'en'
const app = createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus, {
    locale: elementLang,
  })
  .use(FlowComponents, {
    locale: componentLocale,
  })
  .use(i18n)
  .use(bindDirective)
  .use(globalComponents)
  .use(permissionsPlugin, {
    store,
  })
  .mount('#app')

export default app
