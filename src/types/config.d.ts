import { ComponentPublicInstance } from 'vue'

export interface SubTabComponent extends ComponentPublicInstance {
  index: number
  reloading: () => void
}
