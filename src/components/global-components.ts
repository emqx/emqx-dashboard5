import CustomInputPassword from './CustomInputPassword.vue'
import CreateButton from './CreateButton.vue'
import TableButton from './TableButton.vue'
import RefreshButton from './RefreshButton.vue'
import type { App } from 'vue'

export default {
  install(app: App): void {
    app.component('CustomInputPassword', CustomInputPassword)
    app.component('CreateButton', CreateButton)
    app.component('TableButton', TableButton)
    app.component('RefreshButton', RefreshButton)
  },
}
