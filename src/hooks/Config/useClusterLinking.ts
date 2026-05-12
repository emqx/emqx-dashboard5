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
  handleTogglerEnable: (data: CreatedClusterLinking) => Promise<CreatedClusterLinking>
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
      const ret: CreatedClusterLinking = await toggleClusterLinkingEnable({
        ...data,
        enable: !enable,
      })
      data.enable = !data.enable
      ElMessage.success(t(data.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'))
      return Promise.resolve(ret)
    } catch (error) {
      return Promise.reject()
    }
  }

  const { handleSSLDataBeforeSubmit } = useSSL()
  const removeKeys = ['status', 'node_status']
  const cleanTcpOpts = (tcpOpts: ClusterLinkingForm['tcp_opts']) => {
    if (!tcpOpts) return undefined
    const cleaned = Object.entries(tcpOpts).reduce(
      (acc, [k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          ;(acc as any)[k] = v
        }
        return acc
      },
      {} as NonNullable<ClusterLinkingForm['tcp_opts']>,
    )
    return Object.keys(cleaned).length ? cleaned : undefined
  }
  const handleLinkingDataBeforeSubmit = (data: ClusterLinkingForm): ClusterLinkingForm => {
    const tcpOpts = cleanTcpOpts(data.tcp_opts)
    const result: ClusterLinkingForm = {
      ...data,
      ssl: handleSSLDataBeforeSubmit(data.ssl as any) as any,
    }
    if (tcpOpts) {
      result.tcp_opts = tcpOpts
    } else {
      delete (result as Partial<ClusterLinkingForm>).tcp_opts
    }
    return omit(result, removeKeys) as ClusterLinkingForm
  }

  return {
    getDataForUpdate,
    toggleClusterLinkingEnable,
    handleTogglerEnable,
    handleLinkingDataBeforeSubmit,
  }
}
