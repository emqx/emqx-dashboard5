/**
 * For use in places requiring namespace parameters but not form data.
 */
const useNamespaceValidation = () => {
  const nsErrorMsg = ref<undefined | string>(undefined)
  const { t } = useI18n()
  const validateNamespace = (namespace: string | undefined) => {
    if (!isUndefined(namespace) && !namespace) {
      nsErrorMsg.value = t('Rule.selectFieldRequiredError', { name: t('BasicConfig.namespace') })
      return Promise.reject()
    }
    return Promise.resolve()
  }
  return {
    nsErrorMsg,
    validateNamespace,
  }
}

export default useNamespaceValidation
