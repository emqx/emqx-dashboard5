import {
  createManagedNamespace,
  deleteManagedNamespace,
  getDetailNamespaceList,
  getManagedDetailNamespaceList,
  getManagedNamespaceList,
  updateNamespaceConfig as requestUpdateNamespaceConfig,
} from '@/api/config'
import type { LinkPaginatedResult } from '@/api/config'
import { NamespaceItem } from '@/types/config'
import { GetNamespaceListParams } from '@/types/typeAlias'
import useMultiTenancyEnabled from './useMultiTenancyEnabled'

export default () => {
  const store = useStore()
  const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
  const currentUserNamespace = computed(() => store.getters.userNamespace)

  const fetchAllManagedNamespaceConfigs = async (): Promise<
    Map<string, NamespaceItem['config']>
  > => {
    try {
      const managedNamespacePage = await getManagedDetailNamespaceList({ limit: 10000 })
      return new Map(
        managedNamespacePage.data.flatMap(({ name, config }) =>
          name ? [[name, config ?? {}] as const] : [],
        ),
      )
    } catch (error) {
      return Promise.reject(error)
    }
  }
  const queryAllTypeNamespaceList = async (
    params: GetNamespaceListParams,
  ): Promise<LinkPaginatedResult<Array<NamespaceItem>>> => {
    try {
      const managedNamespaceConfigs = await fetchAllManagedNamespaceConfigs()
      const namespacePage = await getDetailNamespaceList(params)
      const namespaceList: Array<NamespaceItem> = namespacePage.data.map(
        ({ name: ns, created_at }) => {
          const notExplicitCreated = !ns || !managedNamespaceConfigs.has(ns)
          return {
            ns: ns || '',
            created_at,
            config: ns ? (managedNamespaceConfigs.get(ns) ?? {}) : {},
            not_explicit_created: notExplicitCreated,
          }
        },
      )
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
      const namespaceList = managedNamespacePage.data.map(({ name: ns, created_at, config }) => ({
        ns: ns || '',
        created_at,
        config: config ?? {},
        not_explicit_created: false,
      }))
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
  const isMultiTenancyEnabled = useMultiTenancyEnabled()
  const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
  const currentUserNamespace = computed(() => store.getters.userNamespace)
  const globalNamespaceOption = {
    label: t('BasicConfig.global'),
    value: GLOBAL_NAMESPACE_VALUE,
  }
  const getNamespaceOptions = async () => {
    if (!isMultiTenancyEnabled.value) {
      return []
    }
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
