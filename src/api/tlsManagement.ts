import http from '@/common/http'
import type {
  CertBundleIn,
  CertBundleInfo,
  CertBundleOut,
  NamespaceCertBundleInfo,
} from '@/types/typeAlias'

export const postGlobalCert = (name: string, data: CertBundleIn): Promise<void> => {
  return http.post(`/certs/global/name/${encodeURIComponent(name)}`, data)
}

export const getGlobalCertList = (): Promise<CertBundleOut[]> => {
  return http.get(`/certs/global/list`)
}

export const getGlobalCertInfo = (name: string): Promise<CertBundleInfo> => {
  return http.get(`/certs/global/name/${encodeURIComponent(name)}`)
}

export const deleteGlobalCert = (name: string): Promise<void> => {
  return http.delete(`/certs/global/name/${encodeURIComponent(name)}`)
}

export const postNamespaceCert = (
  namespace: string,
  name: string,
  data: CertBundleIn,
): Promise<void> => {
  return http.post(
    `/certs/ns/${encodeURIComponent(namespace)}/name/${encodeURIComponent(name)}`,
    data,
  )
}

export const getNamespaceCertList = (namespace: string): Promise<CertBundleOut[]> => {
  return http.get(`/certs/ns/${encodeURIComponent(namespace)}/list`)
}

export const getNamespaceCertInfo = (
  namespace: string,
  name: string,
): Promise<NamespaceCertBundleInfo> => {
  return http.get(`/certs/ns/${encodeURIComponent(namespace)}/name/${encodeURIComponent(name)}`)
}

export const deleteNamespaceCert = (namespace: string, name: string): Promise<void> => {
  return http.delete(`/certs/ns/${encodeURIComponent(namespace)}/name/${encodeURIComponent(name)}`)
}
