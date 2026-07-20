import { LIMITER_BYTES_RATE_REG, LIMITER_RATE_REG } from '@/common/constants'
import { FormRules } from '@/types/common'

export default (): {
  limiterRules: FormRules
  limiterPlaceholderMap: Record<string, string>
} => {
  const { tl } = useI18nTl('BasicConfig')

  const limiterRules = {
    max_conn_rate: [{ pattern: LIMITER_RATE_REG, message: tl('rateMatchError'), trigger: 'blur' }],
    messages_rate: [{ pattern: LIMITER_RATE_REG, message: tl('rateMatchError'), trigger: 'blur' }],
    bytes_rate: [
      { pattern: LIMITER_BYTES_RATE_REG, message: tl('rateMatchError'), trigger: 'blur' },
    ],
    delivery_messages_rate: [
      { pattern: LIMITER_RATE_REG, message: tl('rateMatchError'), trigger: 'blur' },
    ],
    delivery_bytes_rate: [
      { pattern: LIMITER_BYTES_RATE_REG, message: tl('rateMatchError'), trigger: 'blur' },
    ],
    subscribes_rate: [
      { pattern: LIMITER_RATE_REG, message: tl('rateMatchError'), trigger: 'blur' },
    ],
  }

  const limiterPlaceholderMap = {
    max_conn_rate: '1000/s',
    messages_rate: '1000/s',
    bytes_rate: '100MB/s',
    delivery_messages_rate: '1000/s',
    delivery_bytes_rate: '100MB/s',
    subscribes_rate: '1000/s',
  }
  return {
    limiterRules,
    limiterPlaceholderMap,
  }
}
