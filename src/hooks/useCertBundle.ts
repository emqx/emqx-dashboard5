import {
  deleteGlobalCertBundle,
  deleteNamespaceCertBundle,
  getGlobalCertBundleInfo,
  getGlobalCertBundleList,
  getNamespaceCertBundleInfo,
  getNamespaceCertBundleList,
  postGlobalCertBundle,
  postNamespaceCertBundle,
} from '@/api/tlsManagement'
import { CertBundleIn } from '@/types/typeAlias'

export interface CertBundleForm extends CertBundleIn {
  name: string
  namespace?: string
}

const useCertBundle = () => {
  const createEmptyCertBundle = (): CertBundleIn => {
    return {
      acc_key: '',
      ca: '',
      chain: '',
      key: '',
      key_password: '',
    }
  }

  const createEmptyCertBundleForm = (): CertBundleForm => {
    return {
      name: '',
      namespace: undefined,
      ...createEmptyCertBundle(),
    }
  }

  const submitNewCertBundle = async (form: CertBundleForm) => {
    try {
      const { name, namespace, ...data } = form
      const dataToSubmit = checkNOmitFromObj(cloneDeep(data))
      if (namespace) {
        await postNamespaceCertBundle(namespace, name, dataToSubmit)
      } else {
        await postGlobalCertBundle(name, dataToSubmit)
      }
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getCertBundleList = async (namespace?: string) => {
    if (namespace) {
      return getNamespaceCertBundleList(namespace)
    }
    return await getGlobalCertBundleList()
  }

  const deleteCertBundle = async (name: string, namespace?: string) => {
    if (namespace) {
      return deleteNamespaceCertBundle(namespace, name)
    }
    return deleteGlobalCertBundle(name)
  }

  const getCertBundleInfo = async (name: string, namespace?: string) => {
    if (namespace) {
      return getNamespaceCertBundleInfo(namespace, name)
    }
    return getGlobalCertBundleInfo(name)
  }

  return {
    createEmptyCertBundle,
    createEmptyCertBundleForm,
    submitNewCertBundle,
    getCertBundleList,
    deleteCertBundle,
    getCertBundleInfo,
  }
}

export default useCertBundle
