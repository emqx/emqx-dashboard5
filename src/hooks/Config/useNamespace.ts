import {
  createManagedNamespace,
  deleteManagedNamespace,
  getManagedNamespaceList,
  getNamespaceConfig,
  getNamespaceList,
  updateNamespaceConfig as requestUpdateNamespaceConfig,
} from '@/api/config'
import { NamespaceItem } from '@/types/config'
import { GetNamespaceListParams } from '@/types/typeAlias'

export default () => {
  let totalManagedNamespaceList: Array<string> = []
  let hasFetchedAllManagedNamespaces = false
  const fetchAllManagedNamespaces = async (): Promise<void> => {
    try {
      const managedNamespaceList = await getManagedNamespaceList({ limit: 10000 })
      totalManagedNamespaceList = managedNamespaceList
      hasFetchedAllManagedNamespaces = true
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
  const queryAllTypeNamespaceList = async (
    params: GetNamespaceListParams,
  ): Promise<Array<NamespaceItem>> => {
    try {
      if (!hasFetchedAllManagedNamespaces) {
        await fetchAllManagedNamespaces()
      }
      const namespaceNameList: Array<string> = await getNamespaceList(params)
      const namespaceList: Array<NamespaceItem> = namespaceNameList.map((ns) => ({
        ns,
        config: {},
        not_explicit_created: !totalManagedNamespaceList.includes(ns),
      }))
      return Promise.resolve(namespaceList)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const queryManagedNamespaceList = async (
    params: GetNamespaceListParams,
  ): Promise<Array<NamespaceItem>> => {
    try {
      const managedNamespaceList = await getManagedNamespaceList(params)
      const namespaceList: Array<NamespaceItem> = managedNamespaceList.map((ns) => ({
        ns,
        config: {},
        not_explicit_created: false,
      }))
      await Promise.allSettled(
        namespaceList.map(async (namespace) => {
          if (namespace.not_explicit_created) {
            return Promise.resolve()
          }
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
    queryAllTypeNamespaceList,
    queryManagedNamespaceList,
    createNamespace,
    updateNamespaceConfig,
  }
}
