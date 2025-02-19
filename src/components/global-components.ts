import CustomInputPassword from './CustomInputPassword.vue'
import {
  CreateButton,
  TableButton,
  RefreshButton,
  SearchButton,
  ResetButton,
  ShowMoreButton,
  LinkButton,
} from './Buttons'
import type { App } from 'vue'

export default {
  install(app: App): void {
    app.component('CustomInputPassword', CustomInputPassword)
    app.component('CreateButton', CreateButton)
    app.component('TableButton', TableButton)
    app.component('RefreshButton', RefreshButton)
    app.component('SearchButton', SearchButton)
    app.component('ResetButton', ResetButton)
    app.component('ShowMoreButton', ShowMoreButton)
    app.component('LinkButton', LinkButton)
  },
}

export {
  CustomInputPassword,
  CreateButton,
  TableButton,
  RefreshButton,
  SearchButton,
  ResetButton,
  ShowMoreButton,
  LinkButton,
}
