import { DirectiveBinding } from 'vue'
import xss from 'xss'

// TODO: try to rewrite the v-html
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding): void {
    el.innerHTML = typeof binding?.value === 'string' ? xss(binding.value) : ''
  },
  updated(el: HTMLElement, binding: DirectiveBinding): void {
    el.innerHTML = typeof binding?.value === 'string' ? xss(binding.value) : ''
  },
}
