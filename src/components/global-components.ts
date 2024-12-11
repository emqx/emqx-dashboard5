import CustomInputPassword from './CustomInputPassword.vue'
import type { App } from 'vue'

export default {
  install(app: App): void {
    app.component('CustomInputPassword', CustomInputPassword)
  },
}
