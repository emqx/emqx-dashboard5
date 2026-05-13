import {
  createManagedNamespace,
  deleteManagedNamespace,
  getDetailNamespaceListWithLinkMeta,
  getAllManagedNamespaceList,
  getManagedDetailNamespaceListWithLinkMeta,
  getNamespaceConfig,
  updateNamespaceConfig as requestUpdateNamespaceConfig,
} from '@/api/config'
import { NamespaceItem } from '@/types/config'
import { GetNamespaceListParams } from '@/types/typeAlias'

type NamespaceListWithMeta = {
  data: Array<NamespaceItem>
  meta: {
    cursor?: string
    hasnext: boolean
  }
}

export default () => {
  let totalManagedNamespaceList: Array<string> = []
  let hasFetchedAllManagedNamespaces = false
  const fetchAllManagedNamespaces = async (): Promise<void> => {
    try {
      totalManagedNamespaceList = await getAllManagedNamespaceList()
      hasFetchedAllManagedNamespaces = true
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }
  const fillManagedNamespaceConfig = async (namespaceList: Array<NamespaceItem>) => {
    return Promise.allSettled(
      namespaceList.map(async (namespace) => {
        if (namespace.not_explicit_created) {
          return Promise.resolve()
        }
        const config = await getNamespaceConfig(namespace.ns)
        namespace.config = config
      }),
    )
  }
  const queryAllTypeNamespaceList = async (
    params: GetNamespaceListParams,
  ): Promise<NamespaceListWithMeta> => {
    try {
      if (!hasFetchedAllManagedNamespaces) {
        await fetchAllManagedNamespaces()
      }
      const { data: namespaceNameList, meta } = await getDetailNamespaceListWithLinkMeta(params)
      const namespaceList: Array<NamespaceItem> = namespaceNameList.map(
        ({ name: ns, created_at }) => ({
          ns: ns || '',
          created_at,
          config: {},
          not_explicit_created: !ns || !totalManagedNamespaceList.includes(ns),
        }),
      )
      await fillManagedNamespaceConfig(namespaceList)
      return Promise.resolve({ data: namespaceList, meta })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const queryManagedNamespaceList = async (
    params: GetNamespaceListParams,
  ): Promise<NamespaceListWithMeta> => {
    try {
      const { data: managedNamespaceList, meta } =
        await getManagedDetailNamespaceListWithLinkMeta(params)
      const namespaceList = managedNamespaceList.map(({ name: ns, created_at }) => ({
        ns: ns || '',
        created_at,
        config: {},
        not_explicit_created: false,
      }))
      await fillManagedNamespaceConfig(namespaceList)
      return Promise.resolve({ data: namespaceList, meta })
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
