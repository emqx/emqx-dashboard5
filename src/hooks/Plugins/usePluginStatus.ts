import { PluginStatus } from '@/types/enum'

export default (
  tl: (key: string, moduleName?: string) => string,
): {
  dotClass: (status: PluginStatus) => string
  statusText: (status: PluginStatus) => string
  statusTextClass: (status: PluginStatus) => string
} => {
  const dotClass = (status: PluginStatus) =>
    ({
      [PluginStatus.Running]: 'success',
      [PluginStatus.Stopped]: 'danger',
    }[status] || 'danger')

  const statusText = (status: PluginStatus) =>
    ({
      [PluginStatus.Running]: tl('active'),
      [PluginStatus.Stopped]: tl('inactive'),
    }[status] || 'unknown')

  const statusTextClass = dotClass

  return {
    dotClass,
    statusText,
    statusTextClass,
  }
}
