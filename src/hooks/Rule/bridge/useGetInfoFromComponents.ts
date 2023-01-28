/**
 * No direct rendering of the form with the schema,
 * but some of the data in the schema is needed
 */
import { Properties, Property } from '@/types/schemaForm'
import { Ref } from 'vue'
import { get } from 'lodash'

export default (
  components: Ref<Properties>,
): {
  getPropItem: (recordPath: string) => Property
} => {
  const getPropPath = (recordPath: string) => {
    const pathArr = recordPath.split('.')
    return pathArr.reduce((path, current) => {
      if (!path) {
        return current
      }
      return `${path}.properties.${current}`
    }, '')
  }
  const getPropItem = (recordPath: string) => {
    return get(components.value, getPropPath(recordPath)) || {}
  }

  return {
    getPropItem,
  }
}
