import {
  createManagedNamespace,
  deleteManagedNamespace,
  getManagedNamespaceList,
  getNamespaceConfig,
  updateNamespaceConfig as requestUpdateNamespaceConfig,
} from '@/api/config'
import { NamespaceItem } from '@/types/config'

export default () => {
  const queryNamespaceList = async (): Promise<Array<NamespaceItem>> => {
    try {
      const list = await getManagedNamespaceList()
      const namespaceList: Array<NamespaceItem> = list.map((ns) => ({ ns, config: {} }))
      await Promise.allSettled(
        namespaceList.map(async (namespace) => {
          const config = await getNamespaceConfig(namespace.ns)
          namespace.config = config
        }),
      )
      return Promise.resolve(namespaceList)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  const createNamespace = async (namespace: NamespaceItem) => {
    let isNamespaceCreated = false
    try {
      await createManagedNamespace(namespace.ns)
      isNamespaceCreated = true
      await requestUpdateNamespaceConfig(namespace.ns, namespace.config)
      return Promise.resolve(namespace)
    } catch (error) {
      if (isNamespaceCreated) {
        deleteManagedNamespace(namespace.ns)
      }
      return Promise.reject(error)
    }
  }
  const updateNamespaceConfig = async (namespace: NamespaceItem) => {
    return requestUpdateNamespaceConfig(namespace.ns, namespace.config)
  }
  return {
    queryNamespaceList,
    createNamespace,
    updateNamespaceConfig,
  }
}
