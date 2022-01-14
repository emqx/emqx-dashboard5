import { cpoyToClipboard } from './utils'

const clipboardOption = {
  bind(el, binding) {
    let _el = el
    if (binding.arg === 'success') {
      _el._v_clipboard_success = binding.value
    } else if (binding.arg === 'error') {
      _el._v_clipboard_error = binding.value
    } else {
      _el = cpoyToClipboard(_el, binding)
    }
  },
  update(el, binding) {
    if (binding.arg === 'success') {
      el._v_clipboard_success = binding.value
    } else if (binding.arg === 'error') {
      el._v_clipboard_error = binding.value
    } else {
      el._v_clipboard.text = () => binding.value
      el._v_clipboard.action = () => 'copy'
    }
  },
  unbind(el, binding) {
    if (binding.arg === 'success') {
      delete el._v_clipboard_success
    } else if (binding.arg === 'error') {
      delete el._v_clipboard_error
    } else {
      el._v_clipboard.destroy()
      delete el._v_clipboard
    }
  },
}

export default (Vue) => {
  Vue.directive('clipboard', clipboardOption)
}
