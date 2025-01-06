import CustomInputPassword from './CustomInputPassword.vue'
import {
  CreateButton,
  TableButton,
  RefreshButton,
  SearchButton,
  ResetButton,
  ShowMoreButton
  AddItemButton,
} from './Buttons'
import ListCard from './ListCard.vue'
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
    app.component('AddItemButton', AddItemButton)
    app.component('ListCard', ListCard)
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
