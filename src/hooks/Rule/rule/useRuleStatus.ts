import { NodeStatusClass } from '@/types/enum'
import { useI18n } from 'vue-i18n'

export default (): {
  getStatusLabel: (enable: boolean | undefined) => string
  getStatusClass: (enable: boolean | undefined) => NodeStatusClass.Success | NodeStatusClass.Danger
} => {
  const { t } = useI18n()

  const getStatusLabel = (enable: boolean | undefined) =>
    enable ? t('Base.enable') : t('Base.disable')

  const getStatusClass = (enable: boolean | undefined) =>
    enable ? NodeStatusClass.Success : NodeStatusClass.Danger

  return { getStatusLabel, getStatusClass }
}
