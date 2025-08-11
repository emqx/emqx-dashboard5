import { Properties } from '@/types/schemaForm'

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

  return {
    handlePrivateKey,
  }
}

export default useSchemaHandlers
