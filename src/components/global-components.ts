import CustomInputPassword from './CustomInputPassword.vue'
import CreateButton from './CreateButton.vue'
import type { App } from 'vue'

export default {
  install(app: App): void {
    app.component('CustomInputPassword', CustomInputPassword)
    app.component('CreateButton', CreateButton)
  },
}
