import { GLOBAL_NAMESPACE_VALUE, type NamespaceSelection } from '@/common/constants'

export const useListNsParams = () => {
  const getListNamespaceParams = (selectedNamespace: NamespaceSelection | undefined) => {
    if (selectedNamespace === GLOBAL_NAMESPACE_VALUE) {
      return { only_global: true }
    } else if (selectedNamespace) {
      return { ns: selectedNamespace }
    }
    return {}
  }

  return {
    getListNamespaceParams,
  }
}

export const useNsParams = () => {
  const getNsParams = (namespace: string | undefined | null) => {
    return namespace ? { ns: namespace } : {}
  }

  return {
    getNsParams,
  }
}
