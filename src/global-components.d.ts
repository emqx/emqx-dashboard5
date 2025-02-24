import {
  CustomInputPassword,
  CreateButton,
  TableButton,
  RefreshButton,
  SearchButton,
  ResetButton,
  ShowMoreButton,
  LinkButton,
} from '@/components/global-components'

declare module 'vue' {
  export interface GlobalComponents {
    CustomInputPassword: typeof CustomInputPassword
    CreateButton: typeof CreateButton
    TableButton: typeof TableButton
    RefreshButton: typeof RefreshButton
    SearchButton: typeof SearchButton
    ResetButton: typeof ResetButton
    ShowMoreButton: typeof ShowMoreButton
    LinkButton: typeof LinkButton
  }
}
