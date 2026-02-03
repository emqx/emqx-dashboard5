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
import { CertKind } from '@/types/enum'
import { CertBundleIn, ManagedCerts, ManagedCertsServer } from '@/types/typeAlias'
import useCertInUseResourceContent from './useCertInUseResourceContent'

export interface CertBundleForm extends CertBundleIn {
  name: string
  namespace?: string
}

export enum CertBundleType {
  /**
   * cert + key + [key_password]
   */
  Regular = 'regular',
  /**
   * acc_key
   */
  ACME = 'acme',
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

  const submitCertBundle = async (form: CertBundleForm) => {
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

  const { tl } = useI18nTl('BasicConfig')
  const { getCertInUseResourceContent } = useCertInUseResourceContent()
  const handleCertInUse = (referencingConfigs: Record<string, string[][]>) => {
    return ElMessageBox({
      title: tl('certBundleInUseTitle'),
      customClass: 'cert-in-use-message',
      message: getCertInUseResourceContent(referencingConfigs),
      confirmButtonText: tl('forceDelete'),
      cancelButtonText: tl('cancel'),
      type: 'warning',
    })
  }

  const deleteCertFile = (formData: CertBundleForm, kind: CertKind, forceDelete?: boolean) => {
    const { name, namespace } = formData
    if (namespace) {
      return deleteNamespaceCertBundle(namespace, name, kind, forceDelete)
    }
    return deleteGlobalCertBundle(name, kind, forceDelete)
  }

  const removeUselessCerts = async (currentForm: CertBundleForm, initialForm: CertBundleForm) => {
    const keysNeedRemove: Array<CertKind> = []
    ;[CertKind.AccKey, CertKind.CA, CertKind.Chain, CertKind.Key, CertKind.KeyPassword].forEach(
      (kind) => {
        if (initialForm[kind] && !currentForm[kind]) {
          keysNeedRemove.push(kind)
        }
      },
    )
    return Promise.all(keysNeedRemove.map((kind: CertKind) => deleteCertFile(currentForm, kind)))
  }

  const getCertBundleList = async (namespace?: string) => {
    if (namespace) {
      return getNamespaceCertBundleList(namespace)
    }
    return await getGlobalCertBundleList()
  }

  const deleteCertBundle = async (name: string, namespace?: string, forceDelete?: boolean) => {
    try {
      if (namespace) {
        await deleteNamespaceCertBundle(namespace, name, undefined, forceDelete)
      }
      await deleteGlobalCertBundle(name, undefined, forceDelete)
      return Promise.resolve()
    } catch (error: any) {
      const { referencing_configs } = error?.response?.data ?? {}
      if (referencing_configs) {
        await handleCertInUse(referencing_configs)
        return deleteCertBundle(name, namespace, true)
      } else {
        return Promise.reject(error)
      }
    }
  }

  const getCertBundleInfo = async (name: string, namespace?: string) => {
    if (namespace) {
      return getNamespaceCertBundleInfo(namespace, name)
    }
    return getGlobalCertBundleInfo(name)
  }

  const { t } = useI18n()
  const isBundleNameDuplicated = async (name: string, namespace?: string): Promise<boolean> => {
    try {
      const list = await getCertBundleList(namespace)
      const isDuplicated = list.some((bundle) => bundle.name === name)
      if (isDuplicated) {
        ElMessage.error(t('Base.isDuplicated'))
        return Promise.reject(new Error(t('Base.isDuplicated')))
      }
      return Promise.resolve(true)
    } catch (error) {
      ElMessage.error(t('Base.duplicatedCheckFailed'))
      return Promise.reject(error)
    }
  }

  return {
    createEmptyCertBundle,
    createEmptyCertBundleForm,
    removeUselessCerts,
    submitCertBundle,
    getCertBundleList,
    deleteCertBundle,
    getCertBundleInfo,
    isBundleNameDuplicated,
  }
}

export const useManagedCertConf = () => {
  const createEmptyManagedCertConf = (): ManagedCerts | ManagedCertsServer => {
    return { bundle_name: '', namespace: undefined }
  }
  return {
    createEmptyManagedCertConf,
  }
}

export default useCertBundle
