import { cloneDeep, get, set } from 'lodash'
import type { ConfigField } from '@/types/plugin'

const PASSWORD_MASK = '******'

/** Keep saved passwords separate from the editable form, including nested records. */
export function createPluginPasswordForm(
  data: Record<string, any>,
  fields: Record<string, ConfigField>,
) {
  const original = cloneDeep(data)
  const values = cloneDeep(data)
  const passwordPaths: string[][] = []

  const maskFields = (configs: Record<string, ConfigField>, parent: string[] = []) => {
    Object.entries(configs).forEach(([name, config]) => {
      const path = [...parent, name]
      if (config.component === 'input-password') {
        passwordPaths.push(path)
        const value = get(original, path)
        if (typeof value === 'string' && value !== '') {
          set(values, path, PASSWORD_MASK)
        }
      } else if (!config.component && config.children) {
        maskFields(config.children, path)
      }
    })
  }
  maskFields(fields)

  return {
    values,
    restore(form: Record<string, any>, editedFields: ReadonlySet<string>) {
      const result = cloneDeep(form)
      passwordPaths.forEach((path) => {
        if (!editedFields.has(path.join('.')) && get(result, path) === PASSWORD_MASK) {
          set(result, path, get(original, path))
        }
      })
      return result
    },
  }
}
