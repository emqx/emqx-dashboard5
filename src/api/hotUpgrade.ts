import http from '@/common/http'
import { NodeUpgradeData, HotUpgradePackage } from '@/types/typeAlias'

export const upgradeNode = (node: string): Promise<void> => {
  return http.post(`/relup/upgrade/${encodeURIComponent(node)}`)
}

export const uploadUpgradePackage = (file: Blob): Promise<void> => {
  const formData = new FormData()
  formData.append('plugin', file)
  return http.post(`/relup/package/upload`, formData)
}

export const getAllNodeStatus = (): Promise<Array<NodeUpgradeData>> => {
  return http.get(`/relup/status`)
}

export const getUpgradePackage = (): Promise<HotUpgradePackage> => {
  return http.get(`/relup/package`, { errorsHandleCustom: [404] })
}

export const deleteUpgradePackage = (): Promise<void> => {
  return http.delete(`/relup/package`)
}

export const getNodeUpgradeHistory = (node: string): Promise<NodeUpgradeData> => {
  return http.get(`/relup/status/${encodeURIComponent(node)}`)
}
