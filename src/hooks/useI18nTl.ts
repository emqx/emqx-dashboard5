export default function useI18nTl(collection: string): {
  t: ComposerTranslation
  tl: (
    key: string,
    meta?: {
      [key: string]: string | number
    },
  ) => string
  te: (key: string, locale?: string) => boolean
} {
  const { t, te, locale } = useI18n()
  const tl = function (key: string, meta?: { [key: string]: string | number }) {
    if (meta) {
      return t(`${collection}.${key}`, meta)
    }
    return t(`${collection}.${key}`)
  }
  return {
    t,
    tl,
    // Preserve locale-only lookup; I18n 11 otherwise searches fallback locales.
    te: (key, targetLocale = locale.value) => te(key, targetLocale),
  }
}
