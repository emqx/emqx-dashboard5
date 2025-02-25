import { putClusterLinking } from '@/api/cluster'
import {
  ClusterLinkingForm,
  ClusterLinkingFormForUpdate,
  CreatedClusterLinking,
} from '@/types/typeAlias'
import useI18nTl from '../useI18nTl'
import useOperationConfirm from '../useOperationConfirm'
import useSSL from '../useSSL'

export default (): {
  getDataForUpdate: (link: CreatedClusterLinking) => ClusterLinkingFormForUpdate
  toggleClusterLinkingEnable: (link: CreatedClusterLinking) => Promise<CreatedClusterLinking>
  handleTogglerEnable: (data: CreatedClusterLinking) => Promise<void>
  handleLinkingDataBeforeSubmit: (data: ClusterLinkingForm) => ClusterLinkingForm
} => {
  const { t } = useI18nTl('BasicConfig')

  const getDataForUpdate = (link: CreatedClusterLinking) =>
    omit(link, ['node', 'status', 'name', 'node_status']) as ClusterLinkingFormForUpdate

  const toggleClusterLinkingEnable = (link: CreatedClusterLinking) => {
    return putClusterLinking(link.name, getDataForUpdate(link))
  }

  const { operationWarning } = useOperationConfirm()
  const handleTogglerEnable = async (data: CreatedClusterLinking) => {
    try {
      const { enable } = data
      if (enable) {
        await operationWarning(t('Base.confirmDisabled'))
      }
      await toggleClusterLinkingEnable({ ...data, enable: !enable })
      data.enable = !data.enable
      ElMessage.success(t(data.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'))
    } catch (error) {
      //
    }
  }

  const { handleSSLDataBeforeSubmit } = useSSL()
  const removeKeys = ['status', 'node_status']
  const handleLinkingDataBeforeSubmit = (data: ClusterLinkingForm): ClusterLinkingForm => {
    return omit(
      {
        ...data,
        ssl: handleSSLDataBeforeSubmit(data.ssl as any) as any,
      },
      removeKeys,
    ) as ClusterLinkingForm
  }

  return {
    getDataForUpdate,
    toggleClusterLinkingEnable,
    handleTogglerEnable,
    handleLinkingDataBeforeSubmit,
  }
}
