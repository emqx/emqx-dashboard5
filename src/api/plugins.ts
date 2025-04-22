import http from '@/common/http'
import { PluginStatus, StatusCommandSendToPlugin } from '@/types/enum'
import { AvroSchema, PluginDetail, PluginItem } from '@/types/plugin'
import type { UploadFile } from 'element-plus'

export const queryPlugins = (status?: PluginStatus): Promise<Array<PluginItem>> => {
  return http.get(`/plugins`, { status })
}

export const queryPluginDetail = (nameWithVersion: string): Promise<PluginDetail> => {
  return http.get(`/plugins/${nameWithVersion}`)
}

export const installPlugin = (file: File): Promise<void> => {
  const form = new FormData()
  form.append('plugin', file)
  return http.post(`/plugins/install`, form, { errorsHandleCustom: [403] })
}

export const uninstallPlugin = (nameWithVersion: string): Promise<void> => {
  return http.delete(`/plugins/${nameWithVersion}`)
}

export const updatePluginStatus = (
  nameWithVersion: string,
  status: StatusCommandSendToPlugin,
): Promise<void> => {
  return http.put(`/plugins/${nameWithVersion}/${status}`)
}

export const movePluginPosition = (nameWithVersion: string, position: string): Promise<void> => {
  return http.post(`/plugins/${nameWithVersion}/move`, { position })
}

export const getPluginSchema = (
  pluginName: string,
  pluginVersion: string,
): Promise<{
  avsc: AvroSchema
  i18n: Record<string, any>
}> => {
  return http.get(`/plugins/${pluginName}-${pluginVersion}/schema`)
}

export const getPluginConfigs = (
  pluginName: string,
  pluginVersion: string,
): Promise<Record<string, any>> => {
  return http.get(`/plugins/${pluginName}-${pluginVersion}/config`)
}

export const updatePluginConfigs = (
  pluginName: string,
  pluginVersion: string,
  data: Record<string, any>,
): Promise<void> => {
  return http.put(`/plugins/${pluginName}-${pluginVersion}/config`, data)
}

export const syncPluginVersion = (pluginInfo: { name: string; version: string }): Promise<void> => {
  const pluginId = `${pluginInfo.name}-${pluginInfo.version}`
  return http.post(`/plugins/cluster_sync`, { name: pluginId })
}

export const downloadPluginConfig = async (pluginName: string, pluginVersion: string) => {
  try {
    const res = await http.get(
      `/plugins/${encodeURIComponent(pluginName)}-${encodeURIComponent(pluginVersion)}/config/download`,
      {
        responseType: 'blob',
      },
    )
    downloadBlobData(res as any)
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}

export const uploadPluginConfig = async (
  pluginName: string,
  pluginVersion: string,
  file: UploadFile,
) => {
  if (!file.raw) {
    return Promise.reject(new Error('File is required'))
  }
  const formData = new FormData()
  formData.append('filename', file.raw)
  return http.post(
    `/plugins/${encodeURIComponent(pluginName)}-${encodeURIComponent(pluginVersion)}/config/upload`,
    formData,
  )
}
