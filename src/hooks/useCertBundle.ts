import { CertBundleIn } from '@/types/typeAlias'

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

  return {
    createEmptyCertBundle,
  }
}

export default useCertBundle
