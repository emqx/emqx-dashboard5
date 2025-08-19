import { Properties, Property } from '@/types/schemaForm'

const useSchemaHandlers = () => {
  const handlePrivateKey = (components: Properties): Properties => {
    const walk = (com: Properties): Properties => {
      Object.entries(com).forEach(([, prop]) => {
        if (prop.properties) {
          walk(prop.properties)
        } else if (prop.key === 'private_key' && prop.type === 'string') {
          prop.componentProps = {
            ...(prop.componentProps ?? {}),
            type: 'textarea',
            rows: 3,
          }
        }
      })
      return com
    }
    return walk(components)
  }

  const setComponentProps = (prop: Property, componentProps: Record<string, any>) => {
    prop.componentProps = Object.assign(prop.componentProps || {}, componentProps)
  }

  return {
    handlePrivateKey,
    setComponentProps,
  }
}

export default useSchemaHandlers
