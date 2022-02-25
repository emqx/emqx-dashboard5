import { useI18n } from 'vue-i18n'

export default function useI18nTl(collection: string): {
  tl: (key: string) => string
} {
  const { t } = useI18n()
  const tl = function (key: string) {
    return t(`${collection}.${key}`)
  }
  return {
    tl,
  }
}
