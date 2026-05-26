import {
  createManagedNamespace,
  deleteManagedNamespace,
  getDetailNamespaceList,
  getManagedDetailNamespaceList,
  getManagedNamespaceList,
  getNamespaceConfig,
  updateNamespaceConfig as requestUpdateNamespaceConfig,
} from '@/api/config'
import type { LinkPaginatedResult } from '@/api/config'
import { NamespaceItem } from '@/types/config'
import { GetNamespaceListParams } from '@/types/typeAlias'

export default () => {
  const store = useStore()
  const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
  const currentUserNamespace = computed(() => store.getters.userNamespace)

  let totalManagedNamespaceList: Array<string> = []
  let hasFetchedAllManagedNamespaces = false
  const fetchAllManagedNamespaces = async (): Promise<void> => {
    try {
      const managedNamespaceList = await getManagedNamespaceList({ limit: 10000 })
      totalManagedNamespaceList = managedNamespaceList.data
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
  ): Promise<LinkPaginatedResult<Array<NamespaceItem>>> => {
    try {
      if (!hasFetchedAllManagedNamespaces) {
        await fetchAllManagedNamespaces()
      }
      const namespacePage = await getDetailNamespaceList(params)
      const namespaceList: Array<NamespaceItem> = namespacePage.data.map(
        ({ name: ns, created_at }) => ({
          ns: ns || '',
          created_at,
          config: {},
          not_explicit_created: !ns || !totalManagedNamespaceList.includes(ns),
        }),
      )
      await fillManagedNamespaceConfig(namespaceList)
      return Promise.resolve({ ...namespacePage, data: namespaceList })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const queryManagedNamespaceList = async (
    params: GetNamespaceListParams,
  ): Promise<LinkPaginatedResult<Array<NamespaceItem>>> => {
    try {
      const managedNamespacePage = await getManagedDetailNamespaceList(params)
      if (isNamespaceUser.value) {
        managedNamespacePage.data = managedNamespacePage.data.filter(
          ({ name }) => name === currentUserNamespace.value,
        )
      }
      const namespaceList = managedNamespacePage.data.map(({ name: ns, created_at }) => ({
        ns: ns || '',
        created_at,
        config: {},
        not_explicit_created: false,
      }))
      await fillManagedNamespaceConfig(namespaceList)
      return Promise.resolve({ ...managedNamespacePage, data: namespaceList })
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

export const useManagedNamespaceOptions = () => {
  const { t } = useI18n()
  const store = useStore()
  const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
  const currentUserNamespace = computed(() => store.getters.userNamespace)
  const globalNamespaceOption = {
    label: t('BasicConfig.global'),
    value: 'global',
  }
  const getNamespaceOptions = async () => {
    try {
      const namespaceList = await getManagedNamespaceList({ limit: 10000 })
      if (isNamespaceUser.value) {
        namespaceList.data = namespaceList.data.filter(
          (name) => name === currentUserNamespace.value,
        )
      }
      return namespaceList.data
    } catch (error) {
      return Promise.reject(error)
    }
  }
  return {
    globalNamespaceOption,
    getNamespaceOptions,
  }
}
