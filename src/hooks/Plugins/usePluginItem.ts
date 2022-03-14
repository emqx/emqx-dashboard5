import { uninstallPlugin } from '@/api/plugins'
import { useI18n } from 'vue-i18n'
import { ElMessageBox, ElMessage } from 'element-plus'
import { PluginItem } from '@/types/plugin'
import { PluginStatus, StatusCommandSendToPlugin, TargetPosition } from '@/types/enum'
import { updatePluginStatus } from '@/api/plugins'
import { movePluginPosition } from '@/api/plugins'

export default () => {
  const { t } = useI18n()

  const NAME_VERSION_JOINER = '-'

  const concatNameWithVersion = ({ name, rel_vsn }: PluginItem) =>
    `${name}${NAME_VERSION_JOINER}${rel_vsn}`

  const checkPlugin = (name: undefined | string) => {
    if (!name) {
      return Promise.reject(new Error('Please pass select a plugin'))
    }
    return Promise.resolve()
  }

  const disablePlugin = async (pluginItem: PluginItem) => {
    try {
      await checkPlugin(concatNameWithVersion(pluginItem))
      await updatePluginStatus(concatNameWithVersion(pluginItem), StatusCommandSendToPlugin.Stop)
      ElMessage.success(t('Base.disabledSuccess'))
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const enablePlugin = async (pluginItem: PluginItem) => {
    try {
      await checkPlugin(concatNameWithVersion(pluginItem))
      await updatePluginStatus(concatNameWithVersion(pluginItem), StatusCommandSendToPlugin.Start)
      ElMessage.success(t('Base.enableSuccess'))
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const uninstall = async (pluginItem: PluginItem) => {
    try {
      await checkPlugin(concatNameWithVersion(pluginItem))
      await ElMessageBox.confirm(t('Plugins.pluginUninstallConfirm', { name: pluginItem.name }))
      await uninstallPlugin(concatNameWithVersion(pluginItem) as string)
      ElMessage.success(t('Plugins.uninstalledSuccessfully'))
      return Promise.resolve()
    } catch (error) {
      console.error(error)
      return Promise.reject()
    }
  }

  const goDoc = (pluginType: string) => {
    // TODO:
  }

  const getTheWorstStatus = (pluginItem: PluginItem) => {
    const { running_status = [] } = pluginItem
    return running_status.every(({ status }) => status === PluginStatus.Running)
      ? PluginStatus.Running
      : PluginStatus.Stopped
  }

  /**
   * all stop = stop; others = running
   */
  const pluginTotalStatus = (pluginItem: PluginItem) => {
    const { running_status = [] } = pluginItem
    return running_status.every(({ status }) => status === PluginStatus.Stopped)
      ? PluginStatus.Stopped
      : PluginStatus.Running
  }

  const getPluginAuthorString = (pluginItem: PluginItem) => {
    const { authors = [] } = pluginItem
    try {
      return authors.join('; ')
    } catch (error) {
      return authors
    }
  }

  const movePluginToTop = (pluginItem: PluginItem) => {
    return movePluginPosition(concatNameWithVersion(pluginItem), TargetPosition.Top)
  }

  const movePluginToBottom = (pluginItem: PluginItem) => {
    return movePluginPosition(concatNameWithVersion(pluginItem), TargetPosition.Bottom)
  }

  const movePluginBeforeAnotherPlugin = (pluginItem: PluginItem, anotherPlugin: PluginItem) => {
    return movePluginPosition(
      concatNameWithVersion(pluginItem),
      TargetPosition.Before + concatNameWithVersion(anotherPlugin),
    )
  }

  const movePluginAfterAnotherPlugin = (pluginItem: PluginItem, anotherPlugin: PluginItem) => {
    return movePluginPosition(
      concatNameWithVersion(pluginItem),
      TargetPosition.After + concatNameWithVersion(anotherPlugin),
    )
  }

  return {
    NAME_VERSION_JOINER,
    concatNameWithVersion,
    disablePlugin,
    enablePlugin,
    uninstall,
    goDoc,
    getTheWorstStatus,
    pluginTotalStatus,
    getPluginAuthorString,
    movePluginToTop,
    movePluginToBottom,
    movePluginBeforeAnotherPlugin,
    movePluginAfterAnotherPlugin,
  }
}
