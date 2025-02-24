import { FormRules } from '@/types/common'

export default (): {
  limiterRules: FormRules
  limiterPlaceholderMap: Record<string, string>
} => {
  const { tl } = useI18nTl('BasicConfig')

  const rateRegExp = /^((\d+(\/\d*[smhd])?)|(infinity))$/i
  const bytesRateExp = /^((\d+(kb|mb|gb)?(\/\d*[smhd])?)|(infinity))$/i
  const limiterRules = {
    max_conn_rate: [{ pattern: rateRegExp, message: tl('rateMatchError'), trigger: 'blur' }],
    messages_rate: [{ pattern: rateRegExp, message: tl('rateMatchError'), trigger: 'blur' }],
    bytes_rate: [{ pattern: bytesRateExp, message: tl('rateMatchError'), trigger: 'blur' }],
  }

  const limiterPlaceholderMap = {
    max_conn_rate: '1000/s',
    messages_rate: '1000/s',
    bytes_rate: '100MB/s',
  }
  return {
    limiterRules,
    limiterPlaceholderMap,
  }
}
