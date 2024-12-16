import CustomInputPassword from './CustomInputPassword.vue'
import type { App } from 'vue'

export default {
  install(app: App): void {
    app.component('CustomInputPassword', CustomInputPassword)
  },
}

export const setPropsToElComponents = {
  install(app: App): void {
    const elTable = app?._context?.components?.ElTable as any
    if (elTable && elTable.props) {
      elTable.props.stripe = { type: Boolean, default: true }
    }
  },
}
