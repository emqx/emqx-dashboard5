import { Property } from '@/types/schemaForm'

type TranslateFn = (key: string) => string
type TranslateExistFn = (key: string) => boolean

export default (
  t: TranslateFn,
  te: TranslateExistFn,
): {
  getI18nPrefix: (type: string) => string
  setLabelAndDesc: (prop: Property, path: string) => void
} => ({
  getI18nPrefix: (type: string): string => `BridgeSchema.${type}.`,
  setLabelAndDesc: (prop: Property, path: string): void => {
    if (prop) {
      prop.label = t(`${path}.label`)
      if (te(`${path}.desc`)) {
        prop.description = t(`${path}.desc`)
      }
    }
  },
})
