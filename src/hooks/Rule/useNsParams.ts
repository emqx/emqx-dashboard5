export const useListNsParams = () => {
  const getListNamespaceParams = (selectedNamespace: string | undefined) => {
    if (selectedNamespace === GLOBAL_NAMESPACE) {
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
