import { useI18n } from 'vue-i18n'
import getDocLinks, { DocMap } from '@/common/docLinks'

export default (): { docMap: DocMap } => {
  const { locale } = useI18n()
  const docMap = getDocLinks(locale.value)

  return { docMap }
}
