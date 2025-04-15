import {
  createManagedNamespace,
  deleteManagedNamespace,
  getManagedNamespaceList,
  getNamespaceConfig,
  updateNamespaceConfig as requestUpdateNamespaceConfig,
} from '@/api/config'
import { NamespaceItem } from '@/types/config'

export default () => {
  /**
   * because the namespace list is not updated when the namespace is deleted, so we need to filter the namespace list
   */
  const queryNamespaceList = async (filterItem?: string): Promise<Array<NamespaceItem>> => {
    try {
      const list = await getManagedNamespaceList()
      const namespaceList: Array<NamespaceItem> = list
        .filter((item) => !filterItem || item !== filterItem)
        .map((ns) => ({ ns, config: {} }))
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
