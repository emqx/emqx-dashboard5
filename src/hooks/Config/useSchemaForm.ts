import { inject, ref, Ref, watch } from 'vue'
import _ from 'lodash'
import { InjectSchema, Properties, Component, Schema } from '@/types/schemaForm'

export default function useSchemaForm(path: string): {
  schema: InjectSchema
  components: Ref
} {
  const schema: InjectSchema = inject('schema')
  const components = ref<Properties>({})
  watch(
    () => schema?.value,
    (val) => {
      handleInjectChanged(val)
    },
  )
  const filter = (ref: string) => ref.replace('#/', '').split('/')
  // https://www.lodashjs.com/docs/lodash.get
  const getComponentByRef = (data: Schema, ref: string): Component => _.get(data, filter(ref), {})
  const getComponents = (data: Schema) => {
    const transComponents = (component: Component) => {
      const res: Properties = {}
      const { properties, type } = component
      if (type === 'object' && properties) {
        Object.keys(properties).forEach((key) => {
          const property = properties[key]
          const { $ref } = property
          if ($ref) {
            const component = getComponentByRef(data, $ref)
            property.properties = transComponents(component)
          }
          res[key] = property
        })
      }
      return res
    }
    const { $ref } = data.paths[path].get
    const component = getComponentByRef(data, $ref)
    const components = transComponents(component)
    return components
  }
  const handleInjectChanged = (data: Schema) => {
    components.value = getComponents(data)
  }
  return {
    schema,
    components,
  }
}
