import { MessageParamsNormalized, MessageParams, MessageOptions, messageTypes } from 'element-plus'

/* for rewrite some configuration */
const PER_MIN_LETTERS = 25
const countDuration = (message: string) => {
  const millSec = Number((message.length / PER_MIN_LETTERS).toFixed(3)) * 1000
  return millSec < 3000 ? 3000 : millSec > 8000 ? 8000 : millSec
}

const normalizeOptions = (params?: MessageParams): MessageParamsNormalized => {
  const options = !params || isString(params) || isFunction(params) ? { message: params } : params
  return options as MessageParamsNormalized
}

const message: any = (options: MessageOptions) => {
  const { message, duration: dur, showClose: showC, type } = normalizeOptions(options)
  const duration = dur || (message && countDuration(message as string)) || undefined
  const showClose = showC || type === 'error'
  const instance = ElMessage({ ...options, duration, showClose })
  return instance
}

messageTypes.forEach((type) => {
  message[type] = (options = {}) => {
    const normalized = normalizeOptions(options)
    return message({ ...normalized, type })
  }
})

export default message
