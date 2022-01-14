import http from '@/common/http'
import { PluginStatus, StatusCommandSendToPlugin } from '@/types/enum'
import { PluginDetail, PluginItem } from '@/types/plugin'

export const queryPlugins = (status?: PluginStatus): Promise<Array<PluginItem>> => {
  return http.get(`/plugins`, { status })
}

export const queryPluginDetail = (nameWithVersion: string): Promise<PluginDetail> => {
  return http.get(`/plugins/${nameWithVersion}`)
}

export const installPlugin = (file: File) => {
  const form = new FormData()
  form.append('plugin', file)
  return http.post(`/plugins/install`, form)
}

export const uninstallPlugin = (nameWithVersion: string) => {
  return http.delete(`/plugins/${nameWithVersion}`)
}

export const updatePluginStatus = (nameWithVersion: string, status: StatusCommandSendToPlugin) => {
  return http.put(`/plugins/${nameWithVersion}/${status}`)
}

export const movePluginPosition = (nameWithVersion: string, position: string) => {
  return http.post(`/plugins/${nameWithVersion}/move`, { position })
}
