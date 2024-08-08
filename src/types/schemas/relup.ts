import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { PostRelupPackageUploadBody, RelupRunningStatus, RelupPackage } from './relup.schemas'

/**
 * @summary Upgrade a specified node
 */
export const postRelupUpgradeNode = <TData = AxiosResponse<void>>(
  node = 'all',
  options?: AxiosRequestConfig,
): Promise<TData> => {
  return axios.post(`/relup/upgrade/${node}`, undefined, options)
}

/**
 * @summary Upgrade all nodes
 */
export const postRelupUpgrade = <TData = AxiosResponse<void>>(
  options?: AxiosRequestConfig,
): Promise<TData> => {
  return axios.post(`/relup/upgrade`, undefined, options)
}

/**
 * @summary Upload a hot upgrade package
 */
export const postRelupPackageUpload = <TData = AxiosResponse<void>>(
  postRelupPackageUploadBody: PostRelupPackageUploadBody,
  options?: AxiosRequestConfig,
): Promise<TData> => {
  const formData = new FormData()
  if (postRelupPackageUploadBody.plugin !== undefined) {
    formData.append('plugin', postRelupPackageUploadBody.plugin)
  }

  return axios.post(`/relup/package/upload`, formData, options)
}

/**
 * @summary Get the hot upgrade status of all nodes
 */
export const getRelupStatus = <TData = AxiosResponse<RelupRunningStatus[]>>(
  options?: AxiosRequestConfig,
): Promise<TData> => {
  return axios.get(`/relup/status`, options)
}

/**
 * @summary Get the installed hot upgrade package
 */
export const getRelupPackage = <TData = AxiosResponse<RelupPackage>>(
  options?: AxiosRequestConfig,
): Promise<TData> => {
  return axios.get(`/relup/package`, options)
}

/**
 * @summary Delete the installed hot upgrade package
 */
export const deleteRelupPackage = <TData = AxiosResponse<void>>(
  options?: AxiosRequestConfig,
): Promise<TData> => {
  return axios.delete(`/relup/package`, options)
}

/**
 * @summary Get the hot upgrade status of a specified node
 */
export const getRelupStatusNode = <TData = AxiosResponse<RelupRunningStatus>>(
  node = 'all',
  options?: AxiosRequestConfig,
): Promise<TData> => {
  return axios.get(`/relup/status/${node}`, options)
}

export type PostRelupUpgradeNodeResult = AxiosResponse<void>
export type PostRelupUpgradeResult = AxiosResponse<void>
export type PostRelupPackageUploadResult = AxiosResponse<void>
export type GetRelupStatusResult = AxiosResponse<RelupRunningStatus[]>
export type GetRelupPackageResult = AxiosResponse<RelupPackage>
export type DeleteRelupPackageResult = AxiosResponse<void>
export type GetRelupStatusNodeResult = AxiosResponse<RelupRunningStatus>
