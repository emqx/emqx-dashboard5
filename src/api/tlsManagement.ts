import http from '@/common/http'
import type {
  CertBundleIn,
  CertBundleInfo,
  CertBundleOut,
  NamespaceCertBundleInfo,
} from '@/types/typeAlias'

export const postGlobalCertBundle = (name: string, data: CertBundleIn): Promise<void> => {
  return http.post(`/certs/global/name/${encodeURIComponent(name)}`, data)
}

export const getGlobalCertBundleList = (): Promise<CertBundleOut[]> => {
  return http.get(`/certs/global/list`)
}

export const getGlobalCertBundleInfo = (name: string): Promise<CertBundleInfo> => {
  return http.get(`/certs/global/name/${encodeURIComponent(name)}`)
}

export const deleteGlobalCertBundle = (name: string): Promise<void> => {
  return http.delete(`/certs/global/name/${encodeURIComponent(name)}`)
}

export const postNamespaceCertBundle = (
  namespace: string,
  name: string,
  data: CertBundleIn,
): Promise<void> => {
  return http.post(
    `/certs/ns/${encodeURIComponent(namespace)}/name/${encodeURIComponent(name)}`,
    data,
  )
}

export const getNamespaceCertBundleList = (namespace: string): Promise<CertBundleOut[]> => {
  return http.get(`/certs/ns/${encodeURIComponent(namespace)}/list`)
}

export const getNamespaceCertBundleInfo = (
  namespace: string,
  name: string,
): Promise<NamespaceCertBundleInfo> => {
  return http.get(`/certs/ns/${encodeURIComponent(namespace)}/name/${encodeURIComponent(name)}`)
}

export const deleteNamespaceCertBundle = (namespace: string, name: string): Promise<void> => {
  return http.delete(`/certs/ns/${encodeURIComponent(namespace)}/name/${encodeURIComponent(name)}`)
}
