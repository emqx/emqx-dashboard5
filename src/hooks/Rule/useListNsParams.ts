const useListNaParams = () => {
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

export default useListNaParams
