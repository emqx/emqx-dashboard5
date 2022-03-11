import { useI18n } from 'vue-i18n'

export default function useI18nTl(collection: string): {
  tl: (
    key: string,
    meta?: {
      [key: string]: string
    },
  ) => string
} {
  const { t } = useI18n()
  const tl = function (key: string, meta?: { [key: string]: string }) {
    if (meta) {
      return t(`${collection}.${key}`, meta)
    }
    return t(`${collection}.${key}`)
  }
  return {
    tl,
  }
}
